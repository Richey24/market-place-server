const { Joi } = require("celebrate");

const USER_ROLE = Object.freeze({
     USER: "USER",
     // FOR FREELANCE CUSTOMERS
     CUSTOMER: "CUSTOMER",
     VENDOR: "VENDOR",
     ADMIN: "ADMIN",
});

module.exports = {
     USER_ROLE,
};
