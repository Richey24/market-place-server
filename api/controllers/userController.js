const User = require("../../model/User");
const Billing = require("../../model/Billing");
const Shipping = require("../../model/Shipping");
const Company = require("../../model/Company");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail, sendForgotPasswordEmail } = require("../../config/helpers");
const Odoo = require("../../config/odoo.connection");

exports.register = async (req, res) => {
     try {
          console.log("POST registering user");
          await Odoo.connect();
          // TODO: add tenant id to verify
          let user = await User.findOne({ email: req.body.email });

          if (user) {
               return res.status(409).json({
                    message: "email already in use",
               });
          }
          let company;
          if (req.body.domain) {
               company = await Company.findOne({ subdomain: req.body.domain });
          }

          let partner_id;
          if (!req.body.role) {
               partner_id = await Odoo.execute_kw("res.partner", "create", [
                    {
                         name: `${req.body.firstname} ${req.body.lastname}`,
                         email: req.body.email,
                         phone: req.body.phone,
                         company_id: company.company_id,
                         is_published: true,
                    },
               ]);
               console.log("Partner created successfully. Partner ID:", partner_id);
          }

          const newUser = new User({
               firstname: req.body.firstname,
               lastname: req.body.lastname,
               email: req.body.email,
               role: req.body.role,
               password: req.body.password,
               phone: req.body.phone,
               partner_id: partner_id,
               ...(company && { company: company._id }),
          });

          let data = await newUser.save();
          console.log(data);

          // Omit password from the user object before sending the response
          const userWithoutPassword = {
               _id: data._id,
               firstname: data.firstname,
               lastname: data.lastname,
               email: data.email,
               role: data.role,
               company: data.company,
          };

          const token = await newUser.generateAuthToken();
          sendWelcomeEmail(req.body.email, req.body.firstname);
          res.status(201).json({ user: userWithoutPassword, token, status: true });
     } catch (error) {
          console.log("errpr", error);
          res.status(400).json({ error, status: true });
     }
};

exports.loginUser = async (req, res) => {
     console.log({
          body: req.body,
     });
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
     try {
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
               userId: req?.userData?._id ?? req?.body?.userId,
          });

          let data = await bill.save();
          return res.status(201).json({ data, status: true });
     } catch (error) {
          console.log("error", error);
          res.status(400).json({ error, status: false });
     }
}),
     (exports.addShippingAddress = async (req, res) => {
          console.log("adding shipping");
          try {
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
               return res.status(201).json({ data, status: true });
          } catch (error) {
               res.status(400).json({ error, status: false });
          }
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

exports.updateUserDetails = async (req, res) => {
     try {
          const updatedUserData = {
               firstname: req.body.firstname,
               lastname: req.body.lastname,
               email: req.body.email,
               phone: req.body.phone,
          };

          // Assuming you have a User model and a method like `updateUserById` to update a user by ID
          const updatedUser = await User.findByIdAndUpdate(req.userData._id, updatedUserData, {
               new: true,
          });

          const company = await Company.findByIdAndUpdate(
               updatedUser?.company,
               {
                    phone: req.body.phone,
                    ...(req.body.companyName && { company_name: req.body.companyName }),
               },
               {
                    new: true,
               },
          );

          // Omit password from the updated user object before sending the response
          const userWithoutPassword = {
               _id: updatedUser._id,
               firstname: updatedUser.firstname,
               lastname: updatedUser.lastname,
               email: updatedUser.email,
               role: updatedUser.role,
               company: updatedUser.company,
          };

          res.status(200).json({ user: userWithoutPassword, company, status: true });
     } catch (error) {
          console.log("Error updating user details:", error);
          res.status(400).json({ error, status: false });
     }
};

exports.updatePassword = async (req, res) => {
     // try {

     const user = await User.findById(req.userData._id)
     if (req.body.oldPassword && !req.body.reset) {
          const isPasswordMatch = await bcrypt.compare(req.body.oldPassword, user.password);
          if (!isPasswordMatch) {
               return res.status(401).json({ message: "wrong old password" });
          }
     }

     const password = await bcrypt.hash(req.body.password, 8);
     const updatedUserData = {
          password: password,
     };
     // Assuming you have a User model and a method like `updateUserById` to update a user by ID
     const updatedUser = await User.findByIdAndUpdate(req.userData._id, updatedUserData, {
          new: true,
     });

     // Omit password from the updated user object before sending the response
     const userWithoutPassword = {
          _id: updatedUser._id,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          email: updatedUser.email,
          role: updatedUser.role,
          company: updatedUser.company,
     };

     res.status(200).json({ user: userWithoutPassword, status: true });
     // } catch (error) {
     //      console.log("Error updating user details:", error);
     //      res.status(500).json({ error, status: false });
     // }
};

exports.forgotPassword = async (req, res) => {
     // try {
     const email = req.body.email
     const url = req.body.url
     const check = await User.findOne({ email: email })
     if (!check) {
          return res.status(201).json({ message: "No user found with email", status: false });
     }
     const token = jwt.sign(
          {
               _id: check._id,
          },
          "secret",
     );
     sendForgotPasswordEmail(email, check.name, token, url)
     res.status(200).json({ message: "Reset Password Emaill Sent", status: true });
     // } catch (error) {
     //      res.status(500).json({ error, status: false });
     // }
}

exports.getUserDetails = async (req, res) => {
     console.log(req.userData);
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

exports.getCustomersByCompanyId = async (req, res) => {
     try {
          const { companyId } = req.params;

          // Assuming role is stored as a field in the User model
          const customers = await User.find({ company: companyId, role: "USER" });

          if (!customers || customers.length === 0) {
               return res.status(200).json({
                    customers: [],
                    status: false,
               });
          }

          res.status(200).json({ customers, status: true });
     } catch (error) {
          console.error("Error fetching users:", error);
          res.status(500).json({ message: "Internal server error.", status: true });
     }
};
