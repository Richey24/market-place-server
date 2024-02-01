const Board = require("../../model/Board");

exports.updateUserBoard = async (req, res) => {
    try {
        const body = req.body
        if (!body.userID) {
            return res.status(400).json({ message: "Send ID" })
        }
        const board = await Board.findOne({ userID: body.userID })
        if (board) {
            const columns = await Board.findOneAndUpdate({ userID: body.userID }, body, { new: true })
            return res.status(200).json(columns)
        }
        const columns = await Board.create(body)
        res.status(200).json(columns)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

exports.getUserBoard = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ message: "Send ID" })
        }
        const board = await Board.findOne({ userID: id })
        res.status(200).json(board)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}