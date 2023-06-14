const { Joi } = require('celebrate');

const createCategoryDTO = Joi.object({
    name: Joi.string().required(),
});
module.exports = { createCategoryDTO }
