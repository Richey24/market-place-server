const mongoose = require('mongoose');

const complainSchema = mongoose.Schema({
    orderID: {
        type: String,
    },
    userID: {
        type: String,
    },
    companyID: {
        type: String,
    },
    topic: {
        type: String,
    },
    description: {
        type: String,
    },
    siteUrl: {
        type: String,
    },
    forAdmin: {
        type: String,
    },
    forVendor: {
        type: String,
    },
    adminStatus: {
        type: String,
    },
    vendorStatus: {
        type: String,
    },
})

const Complain = mongoose.model('complain', complainSchema)

module.exports = { Complain }