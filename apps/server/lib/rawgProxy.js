const axios = require("axios");

const rawg = axios.create({ baseURL: "https://api.rawg.io/api" });

// Forwards a request to RAWG, appending the API key, and relays the response
// (or the upstream error status) back to the client.
const proxyToRawg = (path, req, res) => {
  rawg
    .get(path, { params: { ...req.query, key: process.env.RAWG_API_KEY } })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.error(`RAWG request failed: ${path}`, err.message);
      res
        .status(err.response?.status ?? 502)
        .send({ message: "Failed to fetch data from RAWG" });
    });
};

module.exports = { proxyToRawg };
