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
          ref: "Service",
          required: true,
     },
     status: {
          type: String,
          default: "pending",
     },
     customer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
     },
     paymentStatus: {
          type: String,
          default: "pending", 
     },
     paymentDate: {
          type: Date,
          default: null, 
     },
});

serviceOrderSchema.pre("save", function (next) {
     if (this.isNew) {
          this.orderId = orderCounter++;
     }
     next();
});

serviceOrderSchema.virtual("orderId").get(function () {
     return this._id.toHexString();
});

module.exports = mongoose.model("ServiceOrder", serviceOrderSchema);
