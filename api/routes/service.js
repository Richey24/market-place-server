const express = require("express");
const serviceController = require("../controllers/serviceController");
const router = express.Router();
const multer = require("multer");
const {
     addFirstCat,
     addSecondCat,
     addThirdCat,
     getCat,
     getMainCategory,
     getFirstSubCategory,
     getSecondSubCategory,
} = require("../controllers/serviceCatController");
const auth = require("../../config/auth");
const upload = multer({ dest: "./upload" });

router.post("/create", auth, serviceController.createService);
router.put("/update/:id", auth, serviceController.updateService);
router.get("/get/all", serviceController.getAllService);
router.get("/get/one/:id", serviceController.getOneService);
router.get("/get/user", auth, serviceController.getServiceByUserId);
router.post("/search", serviceController.searchService);
router.post("/rate", serviceController.rateService);
router.post("/cat/first/add", addFirstCat);
router.post("/cat/second/add", addSecondCat);
router.post("/cat/third/add", addThirdCat);
router.get("/cat/get", getCat);
router.get("/cat/get/main", getMainCategory);
router.post("/cat/get/first", getFirstSubCategory);
router.post("/cat/get/second", getSecondSubCategory);
router.delete("/delete/:id", serviceController.deleteService);

module.exports = router;
