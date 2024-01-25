const mongoose = require("mongoose");

let orderCounter = 1000;
const serviceOrderSchema = new mongoose.Schema({
     deliveredDate: {
          type: Date,
          default: null,
     },

     orderDate: {
          type: Date,
          default: Date.now,
     },
     startDate: {
          type: Date,
     },
     price: {
          type: Number,
          required: true,
     },
     service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service", // assuming you have a Service model
          required: true,
     },
     customer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // assuming you have a Customer model
          required: true,
     },
});

serviceOrderSchema.pre("save", function (next) {
     if (this.isNew) {
          this.orderId = orderCounter++; // Increment the counter for each new order
     }
     next();
});

serviceOrderSchema.virtual("orderId").get(function () {
     return this._id.toHexString();
});

module.exports = mongoose.model("ServiceOrder", serviceOrderSchema);
