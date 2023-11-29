const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");

const orderController = require("../controllers/orderController");

router.get("/company/:companyId", auth, orderController.getOrdersByCompanyId);
router.get("/customer/:partner_id", orderController.getOrdersByPartner);
router.get("/customer/history/:partner_id", orderController.getOrderHistoryByPartner);
router.post("/create", orderController.createOrder);
router.get("/:orderId", orderController.getOrderById);
router.post("/product", orderController.addProductToOrder);
router.delete("/product/:id", orderController.removeProductFromOrderLine);
router.put("/product/qty/:id", orderController.updateProductToOrderLine);
router.put("/status", orderController.changeOrderStatus);
router.put("/delivery", orderController.addDeliveryDetailsToOrder);

module.exports = router;
