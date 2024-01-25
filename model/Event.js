const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: String
    },
    description: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    noOfTicket: {
        type: String
    },
    date: {
        type: Date
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    street: {
        type: String
    },
    images: {
        type: Array
    }
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event