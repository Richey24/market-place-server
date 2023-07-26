const userModel = require('../model/User');

class UserService {

    async create(payload) {
        return await userModel.create(payload)
    }


    async findById(id, options) {
        return await userModel.findById(id).populate({
            path: "company",
            options: options,
        })
    }

    async updateOne(id, payload) {
        return await userModel.updateOne({ where: { id } }, { ...payload })
    }

}

module.exports = new UserService()