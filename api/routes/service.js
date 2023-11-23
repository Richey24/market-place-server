const express = require('express');
const serviceController = require('../controllers/serviceController');
const router = express.Router();
const multer = require('multer');
const { addFirstCat, addSecondCat, addThirdCat, getCat } = require('../controllers/serviceCatController');
const upload = multer({ dest: "./upload" })

router.post("/create", upload.single("image"), serviceController.createService)
router.put("/update/:id", upload.single("image"), serviceController.updateService)
router.get("/get/all", serviceController.getAllService)
router.get("/get/one/:id", serviceController.getOneService)
router.get("/get/user/:id", serviceController.getServiceByUserId)
router.post("/search", serviceController.searchService)
router.post("/rate", serviceController.rateService)
router.post("/cat/first/add", addFirstCat)
router.post("/cat/second/add", addSecondCat)
router.post("/cat/third/add", addThirdCat)
router.get("/cat/get", getCat)
router.delete("/delete/:id", serviceController.deleteService)

module.exports = router;