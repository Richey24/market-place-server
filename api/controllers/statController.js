const { DownloadStat } = require("../../model/Stat");
const Odoo = require("../../config/odoo.connection");
const Rating = require("../../model/Rating");
const { Complain } = require("../../model/Complain");


const createDownloadStat = async (req, res) => {
    try {
        req.body.ipAddress = req.ip
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

const getTopRatedProduct = async (req, res) => {
    try {
        const { startDate, endDate, companyID } = req.body
        if (!startDate || !endDate || !companyID) {
            return res.status(400).json({ message: "Send start and end date and company id" })
        }
        await Odoo.connect();
        const productData = await Odoo.execute_kw("product.template", "search_read", [
            [
                ["create_date", ">", new Date(startDate)],
                ["create_date", "<", new Date(endDate)],
                ["x_rating", ">", "0"],
                ["company_id", "=", companyID]
            ],
            [
                "id",
                "create_date",
                "name",
                "display_name",
                "list_price",
                "standard_price",
                "x_rating",
                "categ_id",
            ],
        ]);
        const topRated = productData.sort((a, b) => b.x_rating - a.x_rating).slice(0, 20)
        const mapArr = await Promise.all(topRated.map(async (product) => {
            const arr = []
            const rateResult = await Rating.findOne({ productId: product.id });
            if (rateResult) {
                const fiveStar = rateResult.ratings.filter((pro) => pro.rating == 5)
                arr.push({ rating: 5, count: fiveStar.length })
                const fourStar = rateResult.ratings.filter((pro) => pro.rating == 4)
                arr.push({ rating: 4, count: fourStar.length })
                const threeStar = rateResult.ratings.filter((pro) => pro.rating == 3)
                arr.push({ rating: 3, count: threeStar.length })
                const twoStar = rateResult.ratings.filter((pro) => pro.rating == 2)
                arr.push({ rating: 2, count: twoStar.length })
                const oneStar = rateResult.ratings.filter((pro) => pro.rating == 1)
                arr.push({ rating: 1, count: oneStar.length })
            }
            const obj = {
                id: product.id,
                create_date: product.create_date,
                name: product.name,
                display_name: product.display_name,
                list_price: product.list_price,
                standard_price: product.standard_price,
                x_rating: product.x_rating,
                categ_id: product.categ_id,
                image_1920: product.image_1920,
                ratings: arr
            }
            return obj
        }))
        res.status(200).json(mapArr)
    } catch (error) {
        res.status(500).json({ error, status: false });
    }
}
const getAllTopRatedProduct = async (req, res) => {
    try {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Send start and end date and company id" })
        }
        await Odoo.connect();
        const productData = await Odoo.execute_kw("product.template", "search_read", [
            [
                ["create_date", ">", new Date(startDate)],
                ["create_date", "<", new Date(endDate)],
                ["x_rating", ">", "0"],
            ],
            [
                "id",
                "create_date",
                "name",
                "display_name",
                "list_price",
                "standard_price",
                "x_rating",
                "categ_id",
            ],
        ]);
        const topRated = productData.sort((a, b) => b.x_rating - a.x_rating).slice(0, 20)
        const mapArr = await Promise.all(topRated.map(async (product) => {
            const arr = []
            const rateResult = await Rating.findOne({ productId: product.id });
            if (rateResult) {
                const fiveStar = rateResult.ratings.filter((pro) => pro.rating == 5)
                arr.push({ rating: 5, count: fiveStar.length })
                const fourStar = rateResult.ratings.filter((pro) => pro.rating == 4)
                arr.push({ rating: 4, count: fourStar.length })
                const threeStar = rateResult.ratings.filter((pro) => pro.rating == 3)
                arr.push({ rating: 3, count: threeStar.length })
                const twoStar = rateResult.ratings.filter((pro) => pro.rating == 2)
                arr.push({ rating: 2, count: twoStar.length })
                const oneStar = rateResult.ratings.filter((pro) => pro.rating == 1)
                arr.push({ rating: 1, count: oneStar.length })
            }
            const obj = {
                id: product.id,
                create_date: product.create_date,
                name: product.name,
                display_name: product.display_name,
                list_price: product.list_price,
                standard_price: product.standard_price,
                x_rating: product.x_rating,
                categ_id: product.categ_id,
                image_1920: product.image_1920,
                ratings: arr
            }
            return obj
        }))
        res.status(200).json(mapArr)
    } catch (error) {
        res.status(500).json({ error, status: false });
    }
}

const getCompanyComplainStat = async (req, res) => {
    try {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Send start and end date and company id" })
        }
        const complains = await Complain.find({
            createdDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        })
        const companies = complains.map((complain) => {
            return complain.siteUrl
        })
        const uniqueSite = new Set(companies)
        const result = []
        uniqueSite.forEach((site) => {
            const siteComplains = complains.filter((complain) => complain.siteUrl === site)
            result.push({
                site: site,
                complains: siteComplains.length
            })
        })
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error, status: false });
    }
}

module.exports = { createDownloadStat, getAllDownloadStat, getTopRatedProduct, getAllTopRatedProduct, getCompanyComplainStat }