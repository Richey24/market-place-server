const mongoose = require("mongoose");
const { ADVERT_TYPE } = require("../schemas/advert.schema");

const advertTypeSchema = mongoose.Schema(
     {
          name: {
               type: String,
               unique: true,
               enum: [ADVERT_TYPE.PRODUCT, ADVERT_TYPE.SERVICE],
               required: true,
          },
          maxAdsLimit: {
               type: Number,
               default: 1,
          },
     },
     {
          timestamps: true,
     },
);

const AdvertType = mongoose.model("AdvertType", advertTypeSchema);

module.exports = AdvertType;
