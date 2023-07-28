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

const siteSchema = new mongoose.Schema({
     theme: { type: String, required: true },
     pages: [pageSchema],
     pageLinks: [String],
     company: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
     },
     styles: {
          colors: [String],
          mode: String,
     },
});

const Site = mongoose.model("site", siteSchema);

module.exports = Site;
