const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");

const orderController = require("../controllers/orderController");

router.get("/", auth, orderController.getOrders);
router.post("/", auth, orderController.createOrder);

module.exports = router;
