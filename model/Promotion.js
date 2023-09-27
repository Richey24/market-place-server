const mongoose = require("mongoose");

const promotionSchema = mongoose.Schema({
    company_id: {
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
        default: Date.now()
    },
})

const Promotion = mongoose.model("Promotion", promotionSchema)
module.exports = Promotion