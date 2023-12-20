const { Complain } = require("../../model/Complain");


const createComplain = async (req, res) => {
    try {
        const body = req.body
        const complaint = await Complain.create(body)
        res.status(200).json(complaint)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

const getAllComplain = async (req, res) => {
    try {
        const complains = await Complain.find({})
        res.status(200).json(complains)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

module.exports = {
    createComplain,
    getAllComplain
}