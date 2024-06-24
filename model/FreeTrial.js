const mongoose = require("mongoose");


const freeTrialSchema = mongoose.Schema({
    period: {
        type: Number,
        default: 14
    }
})

const FreeTrial = mongoose.model("Freetrial", freeTrialSchema)
module.exports = FreeTrial