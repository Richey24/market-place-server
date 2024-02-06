const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");

router.post("/add", boardController.updateUserBoard)
router.get("/get/user/:id", boardController.getUserBoard)

module.exports = router