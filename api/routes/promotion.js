const express = require('express');
const router = express.Router();
const auth = require('../../config/auth');

const promotionController = require('../controllers/promotionController');

router.get('/:company_id', promotionController.getPromotions);
router.post('/', promotionController.createPromotions);
router.put('/:id', promotionController.updatePromotion);

router.post('/rewards', promotionController.createRewards);
router.get('/rewards', promotionController.getRewards);

router.get('/conditions', promotionController.getCondtions);
router.post('/conditions', promotionController.createCondition);

router.get('/banners', promotionController.getPromotionBanner);
// router.get('/rewards/:promoId'. promotionController.getPromoRewards);
// router.post('/rewards/:promoId'. promotionController.createPromoRewards);
module.exports = router;