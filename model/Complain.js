const mongoose = require('mongoose');

const complainSchema = mongoose.Schema(
    {
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
            default: "Pending Review"
        },
        vendorStatus: {
            type: String,
            default: "Pending Review"
        },
        adminTrail: {
            type: Array,
            default: []
        },
        vendorTrail: {
            type: Array,
            default: []
        },
        createdDate: {
            type: Date,
            default: Date.now()
        }
    },
    {
        timestamps: true,
    }
)

const Complain = mongoose.model('complain', complainSchema)

module.exports = { Complain }