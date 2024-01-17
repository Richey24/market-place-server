const mongoose = require("mongoose");

const carrierSchema = new mongoose.Schema({
     name: String,
     code: String,
});

const Carrier = mongoose.model("Carrier", carrierSchema);

module.exports = Carrier;
