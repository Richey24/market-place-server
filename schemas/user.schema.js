const { Joi } = require("celebrate");

const USER_ROLE = Object.freeze({
     USER: "USER",
     VENDOR: "VENDOR",
     ADMIN: "ADMIN",
});


module.exports = {
     USER_ROLE
};
