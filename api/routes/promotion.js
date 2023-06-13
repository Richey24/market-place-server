const express = require('express') ;
const router = express.Router();
const auth = require('../../config/auth');

const promotionController = require('../controllers/promotionController');

router.get('/', promotionController.getPromotions);
router.post('/', promotionController.createPromotions);
// router.post('/:id', promotionController.updatePromotion);

// router.get('/rewards/:promoId'. promotionController.getPromoRewards);
// router.post('/rewards/:promoId'. promotionController.createPromoRewards);
module.exports = router;