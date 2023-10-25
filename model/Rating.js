const mongoose = require("mongoose");


const ratingSchema = mongoose.Schema({

    productId: {
        type: String,
        unique: true,
        required: [true, "Please include first name"]
    },
    date: {
        type: Date,
        default: Date.now()
    },
    ratings: {
        type: Array
    }

})


const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;