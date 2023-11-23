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
    itemTitle: {
        type: String,
    },
    serviceType: {
        type: String,
    },
    tags: {
        type: String,
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
    active: {
        type: Boolean,
        default: true
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
})


const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;