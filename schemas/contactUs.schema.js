const { Joi } = require('celebrate');

const sendMessageSchema = {
     body: Joi.object({
          domain: Joi.string().required(),
          content: Joi.string().required(),
          subject: Joi.string().required(),
          fullName: Joi.string().required(),
          email: Joi.string().required()
     })
}

module.exports = { sendMessageSchema }
