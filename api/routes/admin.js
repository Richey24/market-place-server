const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
// const auth = require("../../config/auth");
const adminAuth = async (req, res, next) => {
     try {
          const token = req.headers.authorization.replace("Bearer ", "");
          const decoded = jwt.verify(token, "adminsecret");
          req.userData = decoded;

          next();
     } catch (err) {
          return res.status(401).json({
               message: "Authentification Failed",
          });
     }
};

const adminController = require("../controllers/adminController");
const asyncHandler = require("../../config/asyncHandler");

router.post("/register", adminAuth, asyncHandler(adminController.register));
router.post("/login", asyncHandler(adminController.login));
router.put("/update-user", adminAuth, adminController.updateAdminDetails);
router.put("/update-password", adminController.resetPassword);
router.post("/forgot-password", adminController.forgotPassword);
router.get("/", adminAuth, adminController.getAllUsers);
router.get("/user/:userId", adminAuth, adminController.getSingleUser);

module.exports = router;
