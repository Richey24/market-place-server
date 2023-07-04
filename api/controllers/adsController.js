const advertService = require('../../services/advert.service')


class AdvertController {

    async createAdvertType(req, res) {
        const type = await advertService.createAdvertType(req.body)

        res.status(200).json(type)
    }

    async create(req, res) {
        const advertType = await advertService.findAdvertType(req.body.advertType)

        const advert = await advertService.create({ ...req.body, advertType: advertType._id })

        res.status(200).json(advert)
    }

    async findAll(req, res) {
        if (req.query.type) {

            const adverts = await advertService.findByType(req.query.type)

            res.status(200).json(adverts)
        } else {
            const adverts = await advertService.findAll()

            res.status(200).json(adverts)
        }
    }

    async updateOne(req, res) {
        const { advertId } = req.params

        try {
            const updateAdvert = await advertService.updateOne(advertId, req.body)
            res.status(201).json({ message: "Update successfull" })
        }
        catch (err) {
            throw err
        }
    }
}

module.exports = new AdvertController()