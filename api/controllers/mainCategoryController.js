const Category = require("../../model/Category");

exports.createMainCategory = async (req, res) => {
    try {
        const body = req.body
        if (!body.type || !body.category) {
            return res.status(400).json({ message: "Send all required parameters", status: false });
        }
        const cat = await Category.create(body)
        res.status(201).json(cat)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", status: false });
    }
}

exports.getAllCategory = async (req, res) => {
    try {
        const cat = await Category.find({})
        res.status(200).json(cat)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", status: false });
    }
}