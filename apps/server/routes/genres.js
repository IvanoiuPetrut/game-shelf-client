const express = require("express");
const router = express.Router();
const { proxyToRawg, PAGE_PARAMS } = require("../lib/rawgProxy");

router.get("/", (req, res) => {
  proxyToRawg("/genres", req, res, PAGE_PARAMS);
});

module.exports = router;
