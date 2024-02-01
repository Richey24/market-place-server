const mongoose = require("mongoose");

const boardSchema = mongoose.Schema(
    {
        userID: {
            type: String
        },
        columns: {
            type: Array
        }
    }
)

const Board = mongoose.model("board", boardSchema)
module.exports = Board