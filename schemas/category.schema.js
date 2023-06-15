const { Joi } = require('celebrate');

const createCategorySchema = {
    body: Joi.object({
        name: Joi.string().required(),
    })
}

module.exports = { createCategorySchema }
