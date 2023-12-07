const mongoose = require("mongoose");
const { ADVERT_STATUS, ADVERT_TYPE } = require("../schemas/advert.schema");

const AdvertSchema = mongoose.Schema(
     {
          title: {
               type: String,
               required: true,
          },
          advertType: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "AdvertType",
               required: true,
          },
          company_id: {
               type: String,
               required: [true, "Company id is required"],
          },
          imageUrl: {
               type: String,
               required: true,
          },
          targetUrl: {
               type: String,
               required: true,
          },
          description: {
               type: String,
          },
          discountType: {
               type: String,
          },
          discountValue: {
               type: Number,
          },
          status: {
               type: String,
               default: ADVERT_STATUS.DISABLED,
               enum: [ADVERT_STATUS.ACTIVE, ADVERT_STATUS.DISABLED],
               required: true,
          },
          productId: {
               type: Number,
               required: false,
          },
          category: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "MainCategory",
               required: false,
          },
          endDatePeriod: {
               type: Date,
               default: Date.now,
               required: true,
          },
     },
     {
          timestamps: true,
     },
);

// Middleware to add 30 days to the endDatePeriod before saving
AdvertSchema.pre("save", function (next) {
     // Get the current endDatePeriod value
     let endDatePeriod = this.endDatePeriod;

     // Add 30 days to the endDatePeriod
     endDatePeriod.setDate(endDatePeriod.getDate() + 30);

     // Update the endDatePeriod in the document
     this.endDatePeriod = endDatePeriod;

     next();
});

AdvertSchema.virtual("advertTypeName", {
     ref: "AdvertType",
     localField: "advertType",
     foreignField: "_id",
     justOne: true,
     options: { select: "name" }, // Retrieve only the "name" field from AdvertType
});

const Advert = mongoose.model("Advert", AdvertSchema);

module.exports = Advert;
