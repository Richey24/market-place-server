const express = require('express');
const router = express.Router();
const ads = require('../controllers/adsController');

router.post('/', ads.adsCreate ) // api/ads

module.exports = router;