const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validator");
const auth = require("../../config/auth");
const {
     createAdvertSchema,
     getAdvertSchema,
     newAdvertTypeSchema,
} = require("../../schemas/advert.schema");
const advertController = require("../controllers/adsController");

router.get("/", advertController.findAll);
router.get("/advert-service", advertController.findAllAdsService);
router.get("/company-adverts", advertController.findAdsByCompany);
router.post("/", validate(createAdvertSchema), advertController.create);
router.post("/new-advert-type", validate(newAdvertTypeSchema), advertController.createAdvertType);
router.patch("/:advertId", validate(getAdvertSchema), advertController.updateOne);

module.exports = router;
