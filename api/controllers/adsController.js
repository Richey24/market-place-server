const advertService = require("../../services/advert.service");
const companyModel = require("../../model/Company");
const { successResponder, errorResponder } = require("../../utils/http_responder");
class AdvertController {
     async createAdvertType(req, res) {
          const type = await advertService.createAdvertType(req.body);

          return successResponder(res, type, 201, "Advert Type created successfull");
     }

     async create(req, res) {
          try {
               const advertType = await advertService.findAdvertType(req.body.advertType);

               let targetUrl;

               if (req.body.target === "landing") {
                    // Fetch company_name from the database based on company_id
                    const company = await companyModel.findById(req.body.company_id);
                    const company_name = company ? company.company_name : "unknown";

                    // Construct targetUrl for landing
                    targetUrl = `https://${company_name}.ishop.black`;
               } else if (req.body.target === "product") {
                    // Fetch company_name from the database based on company_id
                    const company = await companyModel.findById(req.body.company_id);
                    const company_name = company ? company.company_name : "unknown";

                    // Construct targetUrl for product
                    targetUrl = `https://${company_name}/ishop.black/${req.body.productId}`;
               }

               // Update the payload with the correct targetUrl
               const payload = {
                    ...req.body,
                    advertType: advertType._id,
                    targetUrl,
               };

               const createdAdvert = await advertService.createAdvert(payload);

               return successResponder(res, createdAdvert, 201, "Advert created successfully");
          } catch (error) {
               // Handle any errors that may occur during the creation process
               return errorResponder(res, error.message, 500); // Adjust the status code as needed
          }
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
