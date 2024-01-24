const FreelancePaymentInfo = require("../../model/FreelancePaymentInfo");


exports.createPaymentInfo = async (req, res) => {
    try {
        const { email, userID, paymentMethod, paymentTag } = req.body
        if (!email || !userID || !paymentMethod || !paymentTag) {
            return res.status(400).json({ message: "Send All required params" });
        }
        const paymentInfo = await FreelancePaymentInfo.find({ userID: userID })
        paymentInfo.forEach((info) => {
            if (info.paymentMethod === paymentMethod) {
                return res.status(400).json({ message: "This payment method has already been created for this user" });
            }
        })
        const info = await FreelancePaymentInfo.create(req.body)
        return res.status(200).json(info);
    } catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
}

exports.updatePaymentInfo = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: "Send ID" });
        }
        await FreelancePaymentInfo.findByIdAndUpdate(id, req.body)
        return res.status(200).json({ message: "updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
}

exports.findAllPaymentInfoByUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: "Send ID" });
        }
        const userPaymentInfo = await FreelancePaymentInfo.find({ userID: id })
        res.status(200).json(userPaymentInfo)
    } catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
}

exports.findOnePaymentInfo = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: "Send ID" });
        }
        const paymentInfo = await FreelancePaymentInfo.findById(id)
        res.status(200).json(paymentInfo)
    } catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
}

exports.deletePaymentInfo = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: "Send ID" });
        }
        await FreelancePaymentInfo.findByIdAndDelete(id)
        return res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
}

exports.findAllPaymentInfo = async (req, res) => {
    try {
        const allPaymentInfo = await FreelancePaymentInfo.find({})
        res.status(200).json(allPaymentInfo)
    } catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
}