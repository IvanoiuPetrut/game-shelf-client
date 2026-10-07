const axios = require("axios");

const rawg = axios.create({
  baseURL: "https://api.rawg.io/api",
  timeout: 10 * 1000,
});

// RAWG data changes slowly, so successful responses are kept in memory for a
// while to save on the API quota and speed up repeated requests.
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX_ENTRIES = 500;
const cache = new Map();

// Query params the client may forward. Anything else (including `key`) is
// dropped, so the proxy can't be used for other RAWG features or to bust the
// cache with junk params.
const PAGE_PARAMS = ["page", "page_size"];
const LIST_PARAMS = [
  ...PAGE_PARAMS,
  "search",
  "search_precise",
  "ordering",
  "genres",
  "platforms",
  "tags",
  "stores",
  "developers",
  "publishers",
  "dates",
  "metacritic",
  "exclude_additions",
];
const MAX_PARAM_LENGTH = 200;
const MAX_PAGE = 1000;
const MAX_PAGE_SIZE = 40;

// RAWG ids are numbers or slugs. Anything else (e.g. `../`, `?` or `#` once
// decoded) could rewrite the upstream URL, so it's rejected.
const ID_PATTERN = /^[a-z0-9-]{1,100}$/i;

// For `router.param("id", validateId)`
const validateId = (req, res, next, id) => {
  if (!ID_PATTERN.test(id)) {
    res.status(404).send({ message: "Not found" });
    return;
  }
  next();
};

const isIntInRange = (value, max) =>
  /^\d{1,5}$/.test(value) && Number(value) >= 1 && Number(value) <= max;

// Picks the allowed params from the request query. Returns null when a value
// is malformed (repeated, nested, too long or out of range).
const pickParams = (query, allowed) => {
  const params = {};
  for (const name of allowed) {
    if (!Object.hasOwn(query, name)) continue;
    const value = query[name];
    if (typeof value !== "string" || value.length > MAX_PARAM_LENGTH) {
      return null;
    }
    if (name === "page" && !isIntInRange(value, MAX_PAGE)) return null;
    if (name === "page_size" && !isIntInRange(value, MAX_PAGE_SIZE)) {
      return null;
    }
    params[name] = value;
  }
  return params;
};

const cacheKey = (path, query) => {
  const params = new URLSearchParams(query);
  params.sort();
  return `${path}?${params}`;
};

const remember = (key, data) => {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
  if (cache.size > CACHE_MAX_ENTRIES) {
    // Maps iterate in insertion order, so the first key is the oldest entry
    cache.delete(cache.keys().next().value);
  }
};

// RAWG's pagination links repeat the request URL, API key included, so the
// key is stripped before responses reach the browser.
const stripKey = (data) => {
  for (const field of ["next", "previous"]) {
    if (typeof data?.[field] !== "string") continue;
    const url = new URL(data[field]);
    url.searchParams.delete("key");
    data[field] = url.toString();
  }
  return data;
};

// Forwards a request to RAWG, appending the API key, and relays the response
// (or the upstream error status) back to the client. Only the query params
// listed in `allowedParams` are forwarded.
const proxyToRawg = (path, req, res, allowedParams = []) => {
  const params = pickParams(req.query, allowedParams);
  if (!params) {
    res.status(400).send({ message: "Invalid query parameters" });
    return;
  }

  const key = cacheKey(path, params);
  const cached = cache.get(key);

  if (cached && cached.expires > Date.now()) {
    res.set("Cache-Control", `public, max-age=${CACHE_TTL_MS / 1000}`);
    res.send(cached.data);
    return;
  }

  rawg
    .get(path, { params: { ...params, key: process.env.RAWG_API_KEY } })
    .then((response) => {
      const data = stripKey(response.data);
      remember(key, data);
      res.set("Cache-Control", `public, max-age=${CACHE_TTL_MS / 1000}`);
      res.send(data);
    })
    .catch((err) => {
      console.error(`RAWG request failed: ${path}`, err.message);
      res
        .status(err.response?.status ?? 502)
        .send({ message: "Failed to fetch data from RAWG" });
    });
};

module.exports = { proxyToRawg, validateId, PAGE_PARAMS, LIST_PARAMS };
