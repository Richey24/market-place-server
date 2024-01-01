const express = require("express");
const router = express.Router();
const vistor = require("../controllers/visitorController");

router.post("/unique", vistor.getUniqueVisitors); // api/ads

module.exports = router;
