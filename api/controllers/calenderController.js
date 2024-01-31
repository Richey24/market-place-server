const Calender = require("../../model/Calender");


exports.createCalender = async (req, res) => {
    try {
        const { title, start, end, userID } = req.body
        if (!title || !start || !end || !userID) {
            return res.status(400).json({ message: "Send all required parameter" })
        }
        const result = await Calender.create(req.body)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

exports.updateCalender = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ message: "Send ID" })
        }
        await Calender.findByIdAndUpdate(id, req.body)
        res.status(200).json({ message: "Updated Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

exports.getCalenderByUserID = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id);
        if (!id) {
            return res.status(400).json({ message: "Send ID" })
        }
        const results = await Calender.find({})
        res.status(200).json(results)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

exports.getCalenderByID = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ message: "Send ID" })
        }
        const result = await Calender.findById(id)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

exports.deleteCalender = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ message: "Send ID" })
        }
        await Calender.findByIdAndDelete(id)
        res.status(200).json({ message: "Deleted Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}