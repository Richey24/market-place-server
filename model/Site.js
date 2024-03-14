const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema({
     theme: { type: String, required: true },
     props: { type: mongoose.Schema.Types.Mixed },
});

const sectionSchema = new mongoose.Schema({
     name: { type: String, required: true },
     content: String,
     component: componentSchema,
});

const pageSchema = new mongoose.Schema({
     name: { type: String, required: true },
     layout: String,
     sections: [sectionSchema],
});

const conditionSchema = new mongoose.Schema({
     target: {
          type: String,
          required: true,
          enum: ["quantity", "price"],
     },
     count: {
          type: Number,
          required: true,
     },
});

const freeConditionSchema = new mongoose.Schema({
     condition: {
          type: conditionSchema,
          required: true,
     },
});

const shippingSchema = new mongoose.Schema({
     free: {
          type: freeConditionSchema,
          required: true,
     },
});

const siteSchema = new mongoose.Schema({
     theme: { type: String, required: true },
     pages: [pageSchema],
     pageLinks: [String],
     header: sectionSchema,
     footer: sectionSchema,
     topAds: sectionSchema,
     freeShipping: shippingSchema,
     company: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
     },
     styles: {
          colors: [String],
          mode: String,
          demoLink: String,
     },
});

const Site = mongoose.model("Site", siteSchema);

module.exports = Site;
