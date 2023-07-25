const { Joi } = require("celebrate");

const USER_ROLE = Object.freeze({
     USER: "USER",
     ADMIN: "ADMIN",
});

const ADVERT_TYPE = Object.freeze({
     BANNER: "BANNER",
     PRODUCT: "PRODUCT",
     PIN: "PIN",
});


module.exports = {
     USER_ROLE
};
