const express = require("express");
const router = express.Router();
const { proxyToRawg } = require("../lib/rawgProxy");

router.get("/", (req, res) => {
  proxyToRawg("/games", req, res);
});

router.get("/:id", (req, res) => {
  proxyToRawg(`/games/${req.params.id}`, req, res);
});

router.get("/:id/screenshots", (req, res) => {
  proxyToRawg(`/games/${req.params.id}/screenshots`, req, res);
});

router.get("/:id/movies", (req, res) => {
  proxyToRawg(`/games/${req.params.id}/movies`, req, res);
});

// get store links
router.get("/:id/stores", (req, res) => {
  proxyToRawg(`/games/${req.params.id}/stores`, req, res);
});

module.exports = router;
