const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");
const dashboardController = require("../controllers/dashboardController");

router.get("/sales-report/:startDate/:endDate", dashboardController.getSalesReport);
router.get("/best-selling/:startDate/:endDate", dashboardController.getBestSellingProducts);
router.get("/total-orders/:startDate/:endDate", dashboardController.getOrdersByCustomers);
router.get("/customers-revenue/:startDate/:endDate", dashboardController.getRevenueByCustomers);
router.get("/reorder", dashboardController.getProductReorder);
//.
router.get("/admin/sales-report/:startDate/:endDate", dashboardController.getAdminSalesReport);
router.get("/admin/top-products/:startDate/:endDate", dashboardController.getAdminTopProducts);
router.get("/admin/best-vendors", dashboardController.getBestSellingVendor);
router.get("/admin/vendors", dashboardController.getVendorsData);
router.get("/admin/canceled-orders/:startDate/:endDate", dashboardController.getRefundData);
router.get("/admin/canceled-orders-count/:startDate/:endDate", dashboardController.getRefundCount);
router.get(
     "/admin/company-orders-count/:startDate/:endDate",
     dashboardController.getCompanyOrderCount,
);
router.get(
     "/admin/company-orders-amount/:startDate/:endDate",
     dashboardController.getCompanyOrderAmount,
);
module.exports = router;
