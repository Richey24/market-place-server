const mongoose = require("mongoose");

const pluginSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [true, "Plugin name is required"],
          trim: true,
          unique: true,
     },
     description: {
          type: String,
          required: [true, "Description is required"],
          maxlength: [500, "Description too long"],
     },
     categories: [
          {
               type: String,
               required: true,
          },
     ],
     popularity: {
          type: Number,
          default: 0,
          min: [0, "Popularity cannot be negative"],
     },
     imageUrl: {
          type: String,
          required: [true, "Image URL is required"],
     },
     createdDate: {
          type: Date,
          default: Date.now,
     },
     updatedDate: Date,
     active: {
          type: Boolean,
          default: true,
     },
     user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
     },
});

const Plugin = mongoose.model("Plugin", pluginSchema);

module.exports = Plugin;
