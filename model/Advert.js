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
        //   company_id: {
        //        type: Number,
        //        required: [true, "Company id is required"],
        //   },
          imageUrl: {
               type: String,
               required: true,
          },
          status: {
               type: String,
               default: ADVERT_STATUS.ACTIVE,
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

const Advert = mongoose.model("Advert", AdvertSchema);

module.exports = Advert;
