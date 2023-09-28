const mongoose = require("mongoose");

const promotionSchema = mongoose.Schema({
    company_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        default: true
    },
    active: {
        type: String,
        required: true,
    },
    promoCode: {
        type: String,
        required: true,
        unique: true
    },
    discountType: {
        type: String,
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
    },
    target: {
        type: String,
        required: true,
    },
    target_id: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
})

const Promotion = mongoose.model("Promotion", promotionSchema)
module.exports = Promotion