const FreeTrial = require("../../model/FreeTrial");

const changeFreeTrial = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "send id" })
        }
        const result = await FreeTrial.findByIdAndUpdate(req.params.id, { period: req.body.period }, { new: true })
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ message: "An error occurred" });
    }
}

const getFreetrial = async (req, res) => {
    try {
        const result = await FreeTrial.find({})
        res.status(200).json(result[0])
    } catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
}



module.exports = {
    changeFreeTrial,
    getFreetrial
}