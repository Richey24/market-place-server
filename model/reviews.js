const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
     {
          service: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Service",
               required: true,
          },
          user: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
               required: true,
          },
          rating: {
               type: Number,
               required: true,
               min: 1,
               max: 5,
          },
          reviewText: {
               type: String,
               required: true,
          },
     },
     { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
