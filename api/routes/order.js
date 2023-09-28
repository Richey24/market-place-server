const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");

const orderController = require("../controllers/orderController");

router.get("/", orderController.getOrders);
router.post("/", orderController.createOrder);

module.exports = router;
