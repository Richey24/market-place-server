const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");
const multer = require("multer");
const productController = require("../controllers/productController");

// router.get("/:companyId/:productId", productController.getProductById);

router.get("/category/:companyId/:categoryId", productController.getProductbyCategory);
router.post("/", auth, productController.createProduct);
router.post("/variants", multer().any("images"), productController.createProductWithVariant);
router.put("/:id", auth, multer().any("images"), productController.updateProduct);
router.post("/multiple", productController.createMultipleProducts);
router.post("/search", productController.searchProduct);
router.post("/inventory/products/sales/:startDate/:endDate", productController.salesProducts);
router.post("/inventory/products/out-of-stock", productController.productOutOfStock);
router.post("/inventory/total/sales", productController.totalSales);
router.post("/inventory/quantity/sold", productController.totalSalesQuantity);
router.post("/inventory/order/failed", productController.totalFailedOrder);
router.delete("/delete/:id", productController.deleteProduct);

router.get("/attributes", productController.fetchProductAttributes);
router.post("/attributes", productController.createProductAttributes);
router.get("/attribute-values/:attributeId", productController.fetchProductAttributeValues);
router.post("/search/suggestions", productController.searchProductsAndcateg);
router.get("/:companyId/featured", productController.getFeaturedProducts);
router.get("/details/:id", productController.productDetails);
router.get("/filter", productController.filterProducts);
router.post("/search-filter", productController.filterProductSearch);
//FilterProducts
router.get("/site/:companyId", productController.getProductbyCompanyId);
router.get("/search/:companyId", productController.getProductbyCompanyIdAndSearch);
router.get("/image/:productId", productController.getProductImage);
router.post("/rating/mail", productController.sendRateMail);
router.post("/rate", productController.rateProduct);
router.get("/rate/:id", productController.getProductRating);
router.get("/unrated/:id/:companyId", productController.getUnratedProducts);
router.delete("/rate/:id", productController.deleteProductRating);
router.get("/ads/product", productController.getAdsProduct);
router.post("/wishlist", productController.createWishlistRecord);
router.get("/wishlist/:partner_id", productController.fetchWishlist);

router.get("/best-selling/:companyId", productController.getBestSellingProducts);

router.get("/:companyId", auth, productController.getProductbyCompanyId);

module.exports = router;
