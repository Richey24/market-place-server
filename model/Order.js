const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
     orderNumber: {
          type: String,
          required: true,
          unique: true,
     },

     customer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
     },

     productId: {
          type: Number,
          required: true,
     },

     productName: {
          type: String,
          required: true,
     },

     productPrice: {
          type: Number,
          required: true,
     },

     productImage: {
          type: String,
          required: true,
     },

     productQty: {
          type: Number,
          default: 1,
     },

     status: {
          type: String,
          enum: ["pending", "processing", "shipped", "delivered"],
          default: "pending",
     },

     createdAt: {
          type: Date,
          default: Date.now,
     },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;