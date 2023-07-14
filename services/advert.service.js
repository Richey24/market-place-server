const advertModel = require("../model/Advert");
const advertTypeModel = require("../model/AdvertType");
const { NotFoundError } = require("../utils/error");
class CompanyService {
     async createAdvertType(payload) {
          return await advertTypeModel.create(payload);
     }

     async findAdvertType(advertType) {
          return await advertTypeModel.findOne({ name: advertType });
     }

     async findAllType() {
          return await advertTypeModel.find();
     }

     /**
      * Create a new advert.
      * @param {Object} payload - The payload containing advert data.
      * @returns {Promise<AdvertDocument>} The created advert object.
      */
     async create(payload) {
          return await advertModel.create(payload);
     }

     /**
      * Find all adverts.
      * @returns {Promise<AdvertDocument[]>} The found adverts.
      */
     async findAll() {
          return await advertModel.find();
     }

     /**
      * Find all adverts.
      * @param {string} advertType
      * @returns {Promise<AdvertDocument[]>} The found adverts.
      */
     async findByType(advertType) {
          const type = await advertTypeModel.findOne({ name: advertType });
          if (!type) {
               return [];
          }
          return await advertModel.find({ advertType: type._id }).populate("advertType");
     }

     /**
      * Update an advert by its ID.
      * @param {string} _id - The ID of the advert to update.
      * @param {Object} payload - The payload containing the updated advert data.
      * @returns {Promise<Object>} The updated advert object.
      */
     async updateOne(_id, payload) {
          const advert = await advertModel.findOneAndUpdate({ _id }, payload);

          if (!advert) {
               throw new NotFoundError("There is no advert with this id");
          }

          return advert;
     }
}

module.exports = new CompanyService();
