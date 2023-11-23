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
        const imgArr = [
            "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/GraphicDesign.png",
            "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/ProgrammingTech.png",
            "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/DigitalMarket.png",
            "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/videoadnanimation.png",
            "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/WritingTranslation.png",
            "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/MusicAudio.png",
            "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/Business.png",
            "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/Data.png",
            "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/Photography.png",
            "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/AI%20Service.png"
        ]
        let arr = []
        let secondArr = []
        const result = await ServiceFirstCat.find({})
        for (let i = 0; i < result.length; i++) {
            const secondCat = await ServiceSecondCat.find({ firstCat: result[i].name })
            for (let j = 0; j < secondCat.length; j++) {
                const thirdCat = await ServiceThirdCat.find({ secondCat: secondCat[j].name }).select("name");
                const subObj = {
                    subName: secondCat[j].name,
                    subCat: thirdCat
                }
                secondArr.push(subObj)
            }

            const obj = {
                name: result[i].name,
                image: imgArr[i],
                firstSub: secondArr,
            }
            arr.push(obj)
            secondArr = []
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