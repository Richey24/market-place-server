const { DownloadStat } = require("../../model/Stat");


const createDownloadStat = async (req, res) => {
    try {
        await DownloadStat.create(req.body)
        res.status(201).json({ message: "Created" })
    } catch (error) {
        res.status(500).json({ error, status: false });
    }
}

const getAllDownloadStat = async (req, res) => {
    try {
        const stat = await DownloadStat.find({})
        res.status(200).json(stat)
    } catch (error) {
        res.status(500).json({ error, status: false });
    }
}

module.exports = { createDownloadStat, getAllDownloadStat }