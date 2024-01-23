const mongoose = require('mongoose');


const freelancerPaymentInfo = mongoose.Schema({
    email: {
        type: String
    },
    userID: {
        type: String
    },
    paymentMethod: {
        type: String
    },
    paymentTag: {
        type: String
    }
})

const FreelancePaymentInfo = mongoose.model('FreelancePaymentInfo', freelancerPaymentInfo)
module.exports = FreelancePaymentInfo