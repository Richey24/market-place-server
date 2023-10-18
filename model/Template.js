const mongoose = require("mongoose");
const templateSchema = new mongoose.Schema({
     theme_url: {
          type: String,
          required: [true, "Please Include your first name"],
     },
     category_id: {
          type: Number,
          required: [true, "Category id is required"],
     },
     name: {
          type: String,
          required: [true, "Name id is required"],
     },
     type: {
          type: String,
     },
});
const VendorTemplate = mongoose.model("VendorTemplate", templateSchema);
module.exports = VendorTemplate;
