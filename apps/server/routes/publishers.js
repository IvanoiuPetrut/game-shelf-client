const express = require("express");
const router = express.Router();
const { proxyToRawg, validateId } = require("../lib/rawgProxy");

router.param("id", validateId);

router.get("/:id", (req, res) => {
  proxyToRawg(`/publishers/${req.params.id}`, req, res);
});

module.exports = router;
