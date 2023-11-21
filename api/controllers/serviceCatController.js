const { ServiceFirstCat, ServiceSecondCat, ServiceThirdCat } = require("../../model/ServiceCategory");

const addFirstCat = async (req, res) => {
    try {
        const result = await ServiceFirstCat.create(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({ error, status: false });
    }
}
const addSecondCat = async (req, res) => {
    try {
        const result = await ServiceSecondCat.create(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({ error, status: false });
    }
}
const addThirdCat = async (req, res) => {
    try {
        const result = await ServiceThirdCat.create(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({ error, status: false });
    }
}

const getCat = async (req, res) => {
    try {
        let arr = []
        let secondArr = []
        const result = await ServiceFirstCat.find({})
        for (let i = 0; i < result.length; i++) {
            const secondCat = await ServiceSecondCat.find({ firstCat: result[i].name })
            for (let j = 0; j < secondCat.length; j++) {
                const thirdCat = await ServiceThirdCat.find({ secondCat: secondCat[j].name });
                const subObj = {
                    subName: secondCat[j].name,
                    subCat: thirdCat
                }
                secondArr.push(subObj)
            }

            const obj = {
                name: result[i].name,
                firstSub: secondArr
            }
            arr.push(obj)
        }
        res.status(201).json(arr)
    } catch (error) {
        res.status(500).json({ error, status: false });
    }
}

module.exports = {
    addFirstCat,
    addSecondCat,
    addThirdCat,
    getCat
}