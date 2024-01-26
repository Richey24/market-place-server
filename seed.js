// Import required packages
const mongoose = require("mongoose");
const User = require("./model/User");
const Service = require("./model/Service");
const { default: algoliasearch } = require("algoliasearch");
require("dotenv").config();
const PORT = process.env.PORT || 4000;

mongoose
     .connect(process.env.MONGO_URL, { useNewUrlParser: true })
     .then(() => {
          console.log("Database is connected");
          addTime()
     })
     .catch((err) => {
          console.log({ database_error: err });
     });

// async function seedDatabase() {
//      // Connect to the MongoDB server
//      // try {
//      // Insert the sample data into the User collection
//      const users = await User.find({});
//      users.forEach(async (user) => {
//           console.log(String(user._id));
//           const res = await User.findByIdAndUpdate(
//                String(user._id),
//                { status: "active" },
//                { new: true },
//           )
//           console.log("sad");
//           console.log(res);
//      })
//      console.log("updated successfully.");
//      // } catch (err) {
//      //      console.error("Error:", err);
//      // } finally {
//      //      // Close the database connection
//      //      mongoose.connection.close();
//      //      console.log("Database connection closed.");
//      // }
// }

const addTime = async () => {
     try {
          const services = await Service.find({})
          const client = algoliasearch("CM2FP8NI0T", "daeb45e2c3fb98833358aba5e0c962c6");
          const index = client.initIndex("service-title");
          services.forEach((service) => {
               index.search(service.title)
                    .then(async ({ hits }) => {
                         if (hits.length < 1) {
                              await index.saveObject({ title: service.title }, {
                                   autoGenerateObjectIDIfNotExist: true,
                              });
                         }
                    })
                    .catch((error) => {
                         console.log(error);
                    })
          })
          console.log("worked");
     } catch (error) {
          console.log(error);
     }
}


// Invoke the seeder function