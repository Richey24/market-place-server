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

const privacyPolicySchema = new mongoose.Schema({
     type: { type: String },
     content: { type: String },
});

const pageSchema = new mongoose.Schema({
     name: { type: String, required: true },
     layout: String,
     sections: [sectionSchema],
});

const siteSchema = new mongoose.Schema({
     theme: { type: String, required: true },
     pages: [pageSchema],
     pageLinks: [String],
     header: sectionSchema,
     footer: sectionSchema,
     topAds: sectionSchema,
     company: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
     },
     styles: {
          colors: [String],
          mode: String,
          demoLink: String,
     },
     privacyPolicy: privacyPolicySchema,
});

const Site = mongoose.model("Site", siteSchema);

module.exports = Site;
