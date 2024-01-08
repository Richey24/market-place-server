const mongoose = require('mongoose');

const stripeSession = new mongoose.Schema({
    sessionID: {
        type: String
    },
    email: {
        type: String
    },
    plan: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    userID: {
        type: String
    }
})

const StripeSession = mongoose.model("StripeSession", stripeSession)

module.exports = StripeSession