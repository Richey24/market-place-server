const mongoose = require("mongoose");

const calenderSchema = mongoose.Schema(
    {
        userID: {
            type: String
        },
        title: {
            type: String
        },
        start: {
            type: Date
        },
        end: {
            type: Date
        }
    },
    {
        timestamps: true,
    }
)

const Calender = mongoose.model("Calender", calenderSchema)
module.exports = Calender