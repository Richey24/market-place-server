const mongoose = require("mongoose");


const popularProductSchema = mongoose.Schema({
    type: {
        type: String,
        required: [true, "Please include type"]
    },
    topic: {
        type: String,
        required: [true, "Please include topic"]
    },
    caption: {
        type: String,
        required: [true, "Please include caption"]
    },
    image: {
        type: String,
    }
})


const PopularProduct = mongoose.model('PopularProduct', popularProductSchema);
module.exports = PopularProduct;