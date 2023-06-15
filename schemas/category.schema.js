const { Joi } = require('celebrate');

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

module.exports = { createCategorySchema, createSubCategorySchema }
