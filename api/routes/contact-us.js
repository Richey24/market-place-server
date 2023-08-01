const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validator");
const contactController = require("../controllers/contactUsController");
const { sendMessageSchema } = require("../../schemas/contactUs.schema");

router.post("/", validate(sendMessageSchema), contactController.sendMessage);

module.exports = router;
