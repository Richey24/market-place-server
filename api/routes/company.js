const express = require("express");
const {
     updateCompany,
     updateBrandColor,
     sendMeetingInvite,
     getCompany,
} = require("../controllers/companyController");
const auth = require("../../config/auth");
const router = express.Router();

router.get("/get/:id", getCompany);
router.put("/update/:id", updateCompany);
router.put("/updateBrandColor/:companyId", auth, updateBrandColor);
router.post("/video/invite", sendMeetingInvite);

module.exports = router;
