const { default: algoliasearch } = require("algoliasearch");
const Event = require("../../model/Event");


exports.createEvent = async (req, res) => {
    try {
        const body = req.body
        if (!body.name || !body.email) {
            return res.status(400).json({ message: "Send all required parameter" })
        }
        const event = await Event.create(body)
        const client = algoliasearch("CM2FP8NI0T", "daeb45e2c3fb98833358aba5e0c962c6");
        const index = client.initIndex("ishop-event");
        index.search(body.name).then(async ({ hits }) => {
            if (hits.length < 1) {
                await index.saveObject({ name: body.name, description: body.description }, {
                    autoGenerateObjectIDIfNotExist: true,
                });
            }
        });
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

exports.searchEvent = async (req, res) => {
    try {
        const body = req.body;
        const keys = Object.keys(body);
        const obj = {};
        keys.forEach((key) => {
            obj[key] = { $regex: body[key], $options: "i" };
        });
        const events = await Event.find(obj)
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