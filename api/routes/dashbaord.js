const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");
const dashboardController = require("../controllers/dashboardController");

router.get("/sales-report/:startDate/:endDate", dashboardController.getSalesReport);
router.get("/best-selling/:startDate/:endDate", dashboardController.getBestSellingProducts);
router.get("/total-orders/:startDate/:endDate", dashboardController.getOrdersByCustomers);
router.get("/customers-revenue/:startDate/:endDate", dashboardController.getRevenueByCustomers);
router.get("/reorder", dashboardController.getSalesByCategory);

module.exports = router;
