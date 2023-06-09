const User = require("../../model/User");
const Billing = require("../../model/Billing");
const Shipping = require("../../model/Shipping");
const bcrypt = require("bcrypt");
const { sendWelcomeEmail } = require("../../config/helpers");

exports.register = async (req, res) => {
     try {
          console.log("POST registering user");

          // TODO: add tenant id to verify
          let isUser = await User.find({ email: req.body.email });
          console.log("hiii", isUser);

          if (isUser.length >= 1) {
               return res.status(409).json({
                    message: "email already in use",
               });
          }

          const user = new User({
               firstname: req.body.firstname,
               lastname: req.body.lastname,
               email: req.body.email,
               role: req.body.role,
               password: req.body.password,
          });

          let data = await user.save();

          // Omit password from the user object before sending the response
          const userWithoutPassword = {
               _id: data._id,
               firstname: data.firstname,
               lastname: data.lastname,
               email: data.email,
               role: data.role,
          };

          const token = await user.generateAuthToken();
          sendWelcomeEmail(req.body.email, req.body.firstname);
          res.status(201).json({ user: userWithoutPassword, token });
     } catch (error) {
          res.status(400).json({ error });
     }
};

exports.loginUser = async (req, res) => {
     try {
          console.log("logging user in");
          const email = req.body.email;
          const password = req.body.password;

          const user = await User.findByCredentials(email, password);

          const userWithoutPassword = {
               _id: user._id,
               firstname: user.firstname,
               lastname: user.lastname,
               email: user.email,
               role: user.role,
               onboarded: user.onboarded,
               subscribed: user.subscribed,
          };

          console.log(user);
          if (!user) {
               return res
                    .status(401)
                    .json({ error: "Login failed! Check authenthication credentails" });
          }

          const token = await user.generateAuthToken();
          res.status(201).json({ user: userWithoutPassword, token });
     } catch (error) {
          res.status(400).json(error);
     }
};

exports.logoutUser = async (req, res) => {
     console.log("logoutuser");
     try {
          let randomNumberToAppend = toString(Math.floor(Math.random() * 1000 + 1));
          let randomIndex = Math.floor(Math.random() * 10 + 1);
          let hashedRandomNumberToAppend = await bcrypt.hash(randomNumberToAppend, 10);

          // now just concat the hashed random number to the end of the token
          req.token = req.token + hashedRandomNumberToAppend;
          return res.status(200).json("logout");
     } catch (err) {
          return res.status(500).json(err.message);
     }
};

exports.listBilling = async (req, res) => {
     console.log("list billing information");
     let user = req.userData;
     console.log(user);

     let billing = await Billing.findOne({ userId: user._id });
     return res.status(200).json(billing);
};

exports.listShipping = async (req, res) => {
     console.log("list billing information");
     let user = req.userData;
     console.log(user);

     let shipping = await Shipping.find({ userId: user._id });
     return res.status(200).json(shipping);
};

(exports.addBillingAddress = async (req, res) => {
     console.log("adding biilling");

     const bill = new Billing({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          country: req.body.country,
          state: req.body.state,
          city: req.body.city,
          street: req.body.street,
          phone: req.body.phone,
          zipcode: req.body.zipcode,
          email: req.body.email,
          userId: req.userData._id,
     });

     let data = await bill.save();
     return res.status(201).json({ data });
}),
     (exports.addShippingAddress = async (req, res) => {
          console.log("adding shipping");

          const shipping = new Shipping({
               firstname: req.body.firstname,
               lastname: req.body.lastname,
               country: req.body.country,
               state: req.body.state,
               city: req.body.city,
               street: req.body.street,
               phone: req.body.phone,
               zipcode: req.body.zipcode,
               company: reg.body.company,
               email: req.body.email,
               userId: req.userData._id,
          });

          let data = await shipping.save();
          return res.status(201).json({ data });
     });

(exports.editBillingAddress = async (req, res) => {
     console.log("Edit Billing address");

     await Billing.findByIdAndUpdate(
          req.params.id,
          {
               firstname: req.body.firstname,
               lastname: req.body.lastname,
               country: req.body.country,
               state: req.body.state,
               city: req.body.city,
               company: req.body.company,
               street: req.body.street,
               phone: req.body.phone,
               zipcode: req.body.zipcode,
               email: req.body.email,
               userId: req.userData._id,
          },
          (err, data) => {
               if (err) {
                    return res.status(201).json({ message: "Something went wrong" });
               } else {
                    return res.status(201).json({ message: "Billing Updated", status: true });
               }
          },
     );
}),
     (exports.editShippingAddress = async (req, res) => {
          console.log("Edit Shipping address");

          await Shipping.findByIdAndUpdate(
               req.params.id,
               {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    country: req.body.country,
                    state: req.body.state,
                    city: req.body.city,
                    company: req.body.company,
                    street: req.body.street,
                    phone: req.body.phone,
                    zipcode: req.body.zipcode,
                    email: req.body.email,
                    userId: req.userData._id,
               },
               (err, data) => {
                    if (err) {
                         return res.status(201).json({ message: "Something went wrong" });
                    } else {
                         return res.status(201).json({ message: "Shipping Updated", status: true });
                    }
               },
          );
     });

exports.getUserDetails = async (req, res) => {
     // console.log(req.userData);
     try {
          const user = await User.findById(req.userData._id).populate({
               path: "company",
               options: { virtuals: true },
          });

          if (!user) {
               return res.status(404).json({ message: "User not found.", status: false });
          }

          res.status(200).json({ user, company: null });
     } catch (error) {
          console.error("Error fetching user:", error);
          res.status(500).json({ message: "Internal server error." });
     }
};
