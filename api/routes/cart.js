const auth = require("../../config/auth");

const express = require("express");
const router = express.Router();
const cart = require("../controllers/cartController");

router.get("/:userId", cart.getCart); // get shopping cart
router.post("/", cart.createCart); // create new shopping cart
router.put("/", cart.updateCart);

module.exports = router;
