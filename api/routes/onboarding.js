const express = require("express");
const router = express.Router();
const onboardingController = require("../controllers/onboardingController");
const auth = require("../../config/auth");
const asyncHandler = require("../../config/asyncHandler");

router.post("", auth, asyncHandler(onboardingController.getOnboarding)); // Initiates the onboarding process and creates a new onboarding record.

module.exports = router;
