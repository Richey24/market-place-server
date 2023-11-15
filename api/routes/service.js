const express = require('express');
const serviceController = require('../controllers/serviceController');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: "./upload" })

router.post("/create", upload.single("image"), serviceController.createService)
router.put("/update/:id", upload.single("image"), serviceController.updateService)
router.get("/get/all", serviceController.getAllService)
router.get("/get/one/:id", serviceController.getOneService)
router.get("/get/user/:id", serviceController.getServiceByUserId)
router.post("/search", serviceController.searchService)
router.post("/rate", serviceController.rateService)
router.delete("/delete/:id", serviceController.deleteService)

module.exports = router;