const companyModel = require("../model/Company");

class CompanyService {
     async create(payload) {
          return await companyModel.create(payload);
     }

     async findById(id) {
          return await companyModel.findById(id);
     }
     async findOne(filterQuery, queryOption) {
          return await companyModel.findOne(filterQuery, {}, queryOption);
     }
     async find(filterQuery) {
          return await companyModel.findOne(filterQuery);
     }
     async updateOne(_id, payload) {
          return await companyModel.updateOne({ where: { _id } }, { ...payload });
     }
     async updateCategories(_id, category) {
          return await companyModel.updateOne({ _id }, { $push: { categories: category } });
     }
     async updateManyCategories(_id, newCategories) {
          return await companyModel.updateOne(
               { _id },
               { $push: { categories: { $each: newCategories } } },
          );
     }
}

module.exports = new CompanyService();
