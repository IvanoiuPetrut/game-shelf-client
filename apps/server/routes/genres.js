const express = require("express");
const router = express.Router();
const { proxyToRawg } = require("../lib/rawgProxy");

router.get("/", (req, res) => {
  proxyToRawg("/genres", req, res);
});

module.exports = router;
