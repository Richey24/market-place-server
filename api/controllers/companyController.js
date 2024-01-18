const Company = require("../../model/Company")

const updateCompany = async (req, res) => {
    try {
        const id = req.params.id
        const data = req.body
        if (!id) {
            return res.status(400).json({ message: "Send Company ID" })
        }
        await Company.findOneAndUpdate({ company_id: id }, data)
        res.status(200).json({ message: "success" })
    } catch (error) {
        return res.status(500).json({ error })
    }
}

module.exports = {
    updateCompany
}