const { Joi } = require('celebrate');

const getCategory = {
    params: Joi.object({
        companyId: Joi.string().required(),
    })
}

const createCategorySchema = {
    body: Joi.object({
        name: Joi.string().required(),
    })
}

const createSubCategorySchema = {
    body: Joi.object({
        categoryId: Joi.number().required(),
        name: Joi.string().required(),
    })
}

module.exports = { createCategorySchema, createSubCategorySchema, getCategory }
