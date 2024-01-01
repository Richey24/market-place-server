// db.js
const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
     identifier: { type: String, required: true }, // Use IP address or another identifier
     visitedSite: { type: String, required: true }, // Store the visited site URL
     visitedPages: { type: [String], default: [] }, // Store an array of visited pages
     timestamp: { type: Date, default: Date.now },
});

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;
