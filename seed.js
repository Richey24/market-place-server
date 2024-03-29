// Import required packages
const mongoose = require("mongoose");
const User = require("./model/User");
const Service = require("./model/Service");
const { default: algoliasearch } = require("algoliasearch");
const { serviceNav, ecommerceNav } = require("./utils/navigation");
const { sendAdminMessage } = require("./config/helpers");
require("dotenv").config();
const PORT = process.env.PORT || 4000;

mongoose
     .connect(process.env.MONGO_URL, { useNewUrlParser: true })
     .then(() => {
          console.log("Database is connected");
          addNav()
     })
     .catch((err) => {
          console.log({ database_error: err });
     });


const addNav = async () => {
     try {
          // sendAdminMessage("uahomorejoice@gmail.com", "Rejoice", "testing the new email")

          console.log("worked");
     } catch (error) {
          console.log(error);
     }
}


// Invoke the seeder function