const express = require("express");
const router = express.Router();
const {
  proxyToRawg,
  validateId,
  PAGE_PARAMS,
  LIST_PARAMS,
} = require("../lib/rawgProxy");

router.param("id", validateId);

router.get("/", (req, res) => {
  proxyToRawg("/games", req, res, LIST_PARAMS);
});

router.get("/:id", (req, res) => {
  proxyToRawg(`/games/${req.params.id}`, req, res);
});

router.get("/:id/screenshots", (req, res) => {
  proxyToRawg(`/games/${req.params.id}/screenshots`, req, res, PAGE_PARAMS);
});

router.get("/:id/movies", (req, res) => {
  proxyToRawg(`/games/${req.params.id}/movies`, req, res, PAGE_PARAMS);
});

router.get("/:id/game-series", (req, res) => {
  proxyToRawg(`/games/${req.params.id}/game-series`, req, res, PAGE_PARAMS);
});

router.get("/:id/additions", (req, res) => {
  proxyToRawg(`/games/${req.params.id}/additions`, req, res, PAGE_PARAMS);
});

// get store links
router.get("/:id/stores", (req, res) => {
  proxyToRawg(`/games/${req.params.id}/stores`, req, res, PAGE_PARAMS);
});

module.exports = router;
