const { Joi } = require("celebrate");

const USER_ROLE = Object.freeze({
     USER: "USER",
     // FOR FREELANCE CUSTOMERS
     CUSTOMER: "CUSTOMER",
     VENDOR: "VENDOR",
     ADMIN: "ADMIN",
     DEVELOPER: "DEVELOPER",
});

module.exports = {
     USER_ROLE,
};
