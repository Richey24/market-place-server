const { Complain } = require("../../model/Complain");
const User = require("../../model/User");


const createComplain = async (req, res) => {
    try {
        const body = req.body
        if (!body.userID || !body.orderID) {
            return res.status(401).json({ message: "Send user and order ID" })
        }
        const complaint = await Complain.create(body)
        await User.findByIdAndUpdate(body.userID, { $push: { order_reported: body.orderID } })
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

const getComplainByCompanyID = async (req, res) => {
    try {
        const id = req.parans.id
        if (!id) {
            return res.status(401).json({ message: "Send company ID" })
        }
        const complains = Complain.find({ companyID: id })
        res.status(200).json(complains)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

module.exports = {
    createComplain,
    getAllComplain,
    getComplainByCompanyID
}