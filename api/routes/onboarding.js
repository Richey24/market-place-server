const express = require("express");
const router = express.Router();
const onboardingController = require("../controllers/onboardingController");
const auth = require("../../config/auth");
const asyncHandler = require("../../config/asyncHandler");

router.post("", auth, asyncHandler(onboardingController.postOnboarding)); // Initiates the onboarding process and creates a new onboarding record.
router.get("/:domain", asyncHandler(onboardingController.getOnboarding)); // Initiates the onboarding process and creates a new onboarding record.
router.post("/domain/verify", auth, asyncHandler(onboardingController.verifyDomainName)); // Initiates the onboarding process and creates a new onboarding record.
router.post("/companyname/verify", auth, asyncHandler(onboardingController.verifyCompanyName)); // Initiates the onboarding process and creates a new onboarding record.
router.put("/site/update/:id", onboardingController.updateTemplate)

module.exports = router;
