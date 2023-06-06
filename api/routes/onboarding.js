const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');

router.get('', onboardingController.getOnboarding) // Initiates the onboarding process and creates a new onboarding record.

module.exports = router;