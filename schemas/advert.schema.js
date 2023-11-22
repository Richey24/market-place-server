const { Joi } = require("celebrate");

const ADVERT_STATUS = Object.freeze({
     ACTIVE: "ACTIVE",
     DISABLED: "DISABLED",
});

const ADVERT_TYPE = Object.freeze({
     SERVICE: "SERVICE",
     PRODUCT: "PRODUCT",
});

const newAdvertTypeSchema = {
     body: Joi.object({
          name: Joi.string()
               .valid(...Object.values(ADVERT_TYPE))
               .required(),
          maxAdsLimit: Joi.number(),
     }),
};

const createAdvertSchema = {
     body: Joi.object({
          title: Joi.string().required(),
          advertType: Joi.string().required(),
          imageUrl: Joi.string().required(),
          productId: Joi.number(),
          categoryId: Joi.string(),
          company_id: Joi.string().required(),
          status: Joi.string(),
          target: Joi.string().valid("landing", "product").required(),
     }),
};

const getAdvertSchema = {
     params: Joi.object({
          advertId: Joi.string().required(),
     }),
};

module.exports = {
     ADVERT_STATUS,
     ADVERT_TYPE,
     createAdvertSchema,
     getAdvertSchema,
     newAdvertTypeSchema,
};
