const mongoose = require("mongoose");


const serviceSchema = mongoose.Schema({
    userId: {
        type: String,
        required: [true, "Please include userid"]
    },
    serviceUrl: {
        type: String,
    },
    serviceEmail: {
        type: String,
    },
    serviceTitle: {
        type: String,
    },
    serviceType: {
        type: String,
    },
    tags: {
        type: Array,
    },
    price: {
        type: String,
    },
    description: {
        type: String,
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    dateUpdated: {
        type: Date,
        default: Date.now()
    },
    visibility: {
        type: String,
    },
    serviceDuration: {
        type: String,
    },
    image: {
        type: String,
    },
    rating: {
        type: String,
    },
    numberOfPurchase: {
        type: Number,
        default: 0
    },
    variants: {
        type: Array
    }
})


const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;