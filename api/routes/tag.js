const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validator");
const auth = require("../../config/auth");
const tagsController = require("../controllers/tagsController");

// router.get("/:id", tagsController.findOne);
router.get("/", tagsController.findAll);
router.post("/", tagsController.create);
router.patch("/:id", auth, tagsController.update);
router.delete("/:id", tagsController.delete);

module.exports = router;
