const advertService = require('../../services/advert.service')
const { successResponder } = require('../../utils/http_responder')
class AdvertController {

    async createAdvertType(req, res) {
        const type = await advertService.createAdvertType(req.body)

        successResponder(res, type, "Advert Type created successfull")
    }


    async create(req, res) {
        const advertType = await advertService.findAdvertType(req.body.advertType)

        const advert = await advertService.create({ ...req.body, advertType: advertType._id })

        successResponder(res, advert, 201, "Advert created successFully")
    }

    async findAll(req, res) {
        if (req.query.type) {
            console.log({ body: req.query })

            const adverts = await advertService.findByType(req.query.type)
            successResponder(res, adverts)
        } else {
            const adverts = await advertService.findAll()

            successResponder(res, adverts)
        }
    }

    async updateOne(req, res) {
        const { advertId } = req.params

        try {
            const updateAdvert = await advertService.updateOne(advertId, req.body)

            successResponder(res, updateAdvert, 201, "Update successfull")

        }
        catch (err) {
            throw err
        }
    }
}

module.exports = new AdvertController()