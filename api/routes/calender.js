const express = require("express");
const router = express.Router();
const calenderController = require("../controllers/calenderController");


router.post("/create", calenderController.createCalender)
router.put("/update/:id", calenderController.updateCalender)
router.get("/get/user/:id", calenderController.getCalenderByUserID)
router.get("/get/one/:id", calenderController.getCalenderByID)
router.delete("/delete/:id", calenderController.deleteCalender)

module.exports = router