const mongoose = require("mongoose");


const categorySchema = mongoose.Schema({
    type: {
        type: String,
        required: [true, "Please include type"]
    },
    category: {
        type: String,
        required: [true, "Please include category"]
    },
    subcategory: {
        type: Array
    }

})


const Category = mongoose.model('Category', categorySchema);
module.exports = Category;