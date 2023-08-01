const advertService = require("../../services/advert.service");
const { successResponder, errorResponder } = require("../../utils/http_responder");
class AdvertController {
     async createAdvertType(req, res) {
          const type = await advertService.createAdvertType(req.body);

          return successResponder(res, type, "Advert Type created successfull");
     }

     async create(req, res) {
          const advertType = await advertService.findAdvertType(req.body.advertType);

          const advert = await advertService.create({ ...req.body, advertType: advertType._id });

          return successResponder(res, advert, 201, "Advert created successFully");
     }

     async findAllAdsService(req, res) {
          const adService = await advertService.findAllType();

          return successResponder(res, adService);
     }

     async findAdsByCompany(req, res) {
          try {
               const adverts = await advertService.findByCompany(req.query.company_id);
               return successResponder(res, adverts);
          } catch (error) {
               return errorResponder(res, error?.code, error?.message);
          }
     }

     async findAdById(req, res) {
          try {
               const adverts = await advertService.findById(req.query.id);

               return successResponder(res, adverts);
          } catch (error) {
               return errorResponder(res, error?.code, error?.message);
          }
     }

     async findAll(req, res) {
          if (req.query.type) {
               const adverts = await advertService.findByType(req.query.type);

               return successResponder(res, adverts);
          } else {
               const adverts = await advertService.findAll();

               return successResponder(res, adverts);
          }
     }

     async updateOne(req, res) {
          const { advertId } = req.params;

          try {
               const updateAdvert = await advertService.updateOne(advertId, req.body);

               return successResponder(res, updateAdvert, 201, "Update successfull");
          } catch (error) {
               return errorResponder(res, error?.code, error?.message);
          }
     }
}

module.exports = new AdvertController();
