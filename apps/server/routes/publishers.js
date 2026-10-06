const express = require("express");
const router = express.Router();
const { proxyToRawg } = require("../lib/rawgProxy");

router.get("/:id", (req, res) => {
  proxyToRawg(`/publishers/${req.params.id}`, req, res);
});

module.exports = router;
