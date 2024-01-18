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
        const id = req.params.id
        if (!id) {
            return res.status(401).json({ message: "Send company ID" })
        }
        const complains = await Complain.find({ companyID: id, forVendor: true })
        res.status(200).json(complains)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

const getAdminComplain = async (req, res) => {
    try {
        const complains = await Complain.find({ forAdmin: true })
        res.status(200).json(complains)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

const updateAdminStatus = async (req, res) => {
    try {
        const status = req.body.status
        const id = req.params.id
        await Complain.findByIdAndUpdate(id, { adminStatus: status, $push: { adminTrail: status } })
        res.status(200).json({ message: "successful" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

const updateVendorStatus = async (req, res) => {
    try {
        const status = req.body.status
        const id = req.params.id
        await Complain.findByIdAndUpdate(id, { vendorStatus: status, $push: { vendorTrail: status } })
        res.status(200).json({ message: "successful" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

module.exports = {
    createComplain,
    getAllComplain,
    getComplainByCompanyID,
    getAdminComplain,
    updateAdminStatus,
    updateVendorStatus
}