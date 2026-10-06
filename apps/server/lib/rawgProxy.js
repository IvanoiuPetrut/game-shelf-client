const axios = require("axios");

const rawg = axios.create({ baseURL: "https://api.rawg.io/api" });

// RAWG data changes slowly, so successful responses are kept in memory for a
// while to save on the API quota and speed up repeated requests.
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX_ENTRIES = 500;
const cache = new Map();

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
// (or the upstream error status) back to the client.
const proxyToRawg = (path, req, res) => {
  const key = cacheKey(path, req.query);
  const cached = cache.get(key);

  if (cached && cached.expires > Date.now()) {
    res.set("Cache-Control", `public, max-age=${CACHE_TTL_MS / 1000}`);
    res.send(cached.data);
    return;
  }

  rawg
    .get(path, { params: { ...req.query, key: process.env.RAWG_API_KEY } })
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

module.exports = { proxyToRawg };
