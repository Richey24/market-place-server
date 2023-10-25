const mongoose = require("mongoose");


const ratingSchema = mongoose.Schema({

    productId: {
        type: String,
        unique: true,
        required: [true, "Please include first name"]
    },
    ratings: {
        type: Array
    }

})


const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;