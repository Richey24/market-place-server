const Event = require("../../model/Event");


exports.createEvent = async (req, res) => {
    try {
        const body = req.body
        if (!body.name || !body.email) {
            return res.status(400).json({ message: "Send all required parameter" })
        }
        const event = await Event.create(body)
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

exports.updateEvent = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        if (!id) {
            return res.status(400).json({ message: "Send id" })
        }
        const event = await Event.findByIdAndUpdate(id, body, { new: true })
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

exports.getOneEvent = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ message: "Send id" })
        }
        const event = await Event.findById(id)
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

exports.getAllEvent = async (req, res) => {
    try {
        const events = await Event.find({})
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ message: "Send id" })
        }
        await Event.findByIdAndDelete(id)
        res.status(200).json({ message: "deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
}