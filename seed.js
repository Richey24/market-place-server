// Import required packages
const mongoose = require("mongoose");
const User = require("./model/User");
const Service = require("./model/Service");
const { default: algoliasearch } = require("algoliasearch");
const { serviceNav, ecommerceNav } = require("./utils/navigation");
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

const addNav = async () => {
     try {
          const theUser = await User.findById("64dedb96979548a15e093d34")
          console.log(theUser);
          const users = await User.find({})
          users.forEach(async (user) => {
               if (user.role === "VENDOR") {
                    if (user.currentSiteType === "service") {
                         await User.findByIdAndUpdate(user._id, { navigation: serviceNav }, { new: true })
                    } else {
                         // console.log(user.navigation);
                         const test = await User.findByIdAndUpdate(user._id, { navigation: ecommerceNav }, { new: true })
                         // console.log(test.navigation);
                    }
               }
          })

          // const user = await User.findById("6571f08ed5ab5ed71393a6ab")
          // console.log(user);
          console.log("worked");
     } catch (error) {
          console.log(error);
     }
}


// Invoke the seeder function