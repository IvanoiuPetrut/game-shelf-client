const express = require("express");
const router = express.Router();
const { proxyToRawg } = require("../lib/rawgProxy");

router.get("/:id", (req, res) => {
  proxyToRawg(`/developers/${req.params.id}`, req, res);
});

module.exports = router;
