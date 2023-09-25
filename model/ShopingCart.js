const mongoose = require("mongoose");

// Define the ShoppingCart schema
const ShoppingCartSchema = mongoose.Schema({
     userId: {
          type: String,
          required: true,
     },
     companyId: {
          type: String,
          required: true,
     },
     items: [String],
     createdAt: {
          type: Date,
          default: Date.now,
     },
});

// Create the ShoppingCart model
const ShoppingCart = mongoose.model("ShoppingCart", ShoppingCartSchema);

module.exports = ShoppingCart;
