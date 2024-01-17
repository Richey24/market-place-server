const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema(
     {
          amount: {
               type: Number,
               required: true,
          },
          currency: {
               type: String,
               required: true,
          },
          paymentIntentId: {
               type: String,
               required: true,
          },
          captureMethod: {
               type: String,
          },
          confirmationMethod: {
               type: String,
          },
          status: {
               type: String,
          },
          connectedAccountId: {
               type: String,
               required: true,
          },
          clientSecret: {
               type: String,
               required: true,
          },

          orderId: {
               type: Number,
               required: true,
          },
          buyer: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
          },
          site: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Site",
          },
     },
     {
          timestamps: true,
     },
);

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
