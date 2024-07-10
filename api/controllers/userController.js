const User = require("../../model/User");
const Billing = require("../../model/Billing");
const Shipping = require("../../model/Shipping");
const Company = require("../../model/Company");
const Advert = require("../../model/Advert");
const Site = require("../../model/Site");
const billingService = require("../../services/billing.service");
const paymentService = require("../../services/payment.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
     sendWelcomeEmail,
     sendForgotPasswordEmail,
     sendAdminMessage,
     sendVendorMessage,
} = require("../../config/helpers");
const Odoo = require("../../config/odoo.connection");
const moment = require("moment");
const mongoose = require("mongoose");
const webpush = require("web-push");
const axios = require("axios");
const { USER_ROLE } = require("../../schemas/user.schema");

exports.register = async (req, res) => {
     try {
          console.log("POST registering user");
          await Odoo.connect();

          const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
          // Fetch timezone information using the IP address
          const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
          const timezone = response.data.timezone;

          // TODO: add tenant id to verify
          let user = await User.findOne({ email: req.body.email });
          // console.log("user", user);
          if (req.body.role === "VENDOR" && user) {
               return res.status(409).json({
                    message: "email already in use",
                    status: false,
               });
          }

          const domainExists = await User.findOne({
               "partner_ids.domain": req.body.domain,
               email: req.body.email,
          });

          if (domainExists) {
               return res.status(409).json({
                    message: "Account Already Exist for this Site",
                    status: false,
               });
          }

          let company;
          if (req.body.domain) {
               company = await Company.findOne({ subdomain: req.body.domain });
          }

          let partner_id;
          if (!req.body.role || req.body.role === "USER") {
               partner_id = await Odoo.execute_kw("res.partner", "create", [
                    {
                         name: `${req.body.firstname ?? user?.firstname} ${
                              req.body.lastname ?? user?.lastname
                         }`,
                         email: req.body.email ?? user?.email,
                         phone: req.body.phone ?? user?.phone,
                         company_id: company.company_id,
                         is_published: true,
                    },
               ]);
               console.log("Partner created successfully. Partner ID:", partner_id);
          }

          let data;
          let token;
          if (!user) {
               const newUser = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    role: req.body.role,
                    chatID: req.body.chatID ?? "",
                    tour: req.body?.tour ?? "",
                    password: req.body.password,
                    phone: req.body.phone,
                    timeZone: timezone,
                    sales_opt_in: req.body.sales_opt_in,
                    partner_ids: [{ id: partner_id, domain: req.body.domain }],
                    currentSiteType: req.body.currentSiteType,
                    ...(company && { company: company._id }),
               });
               data = await newUser.save();
               token = await newUser.generateAuthToken(req.body.domain);

               if (data && data.role === USER_ROLE.VENDOR) {
                    console.log({ vender: "ok" });
                    let vendorConnectedAccount = await paymentService.createConnectedAccount({
                         email: data.email,
                    });

                    await User.updateOne(
                         { _id: data.id },
                         {
                              $set: { stripeConnectedAccountId: vendorConnectedAccount.id },
                         },
                    );
               }
          } else {
               user = await User.findByIdAndUpdate(user?._id, {
                    $set: {
                         partner_ids: [
                              ...user?.partner_ids,
                              { id: partner_id, domain: req.body.domain },
                         ],
                    },
               });
               token = await user.generateAuthToken(req.body.domain);
          }

          // Omit password from the user object before sending the response
          let userWithoutPassword;
          if (!user)
               userWithoutPassword = {
                    _id: data._id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    role: data.role,
                    chatID: data.chatID,
                    company: data.company,
                    stripeConnectedAccountId: data?.stripeConnectedAccountId,
               };
          if (req.body.role !== "USER") {
               sendWelcomeEmail(
                    req.body?.email ?? user?.firstname,
                    req.body?.firstname ?? user?.lastname,
                    req?.body.currentSiteType ?? user?.currentSiteType,
               );
          }

          res.status(201).json({ user: userWithoutPassword ?? user, token, status: true });
     } catch (error) {
          console.log("errpr", error);
          res.status(400).json({ error, status: false });
     }
};

exports.confirmEmail = async (req, res) => {
     try {
          console.log("POST registering user");
          await Odoo.connect();
          // TODO: add tenant id to verify
          let user = await User.findOne({ email: req.body.email });
          const domainExists = await User.findOne({
               "partner_ids.domain": req.body.domain,
               email: req.body.email,
          });
          // console.log("domainExists", domainExists, req.body);
          if (domainExists) {
               return res.status(409).json({
                    message: "Account Already Exist for this Site",
                    status: false,
               });
          }

          if (user && !domainExists) {
               return res.status(201).json({
                    exists: true,
                    status: true,
               });
          } else {
               return res.status(201).json({
                    exists: false,
                    status: true,
               });
          }
     } catch (error) {
          console.log("error", error);
          res.status(400).json({ error, status: false });
     }
};

exports.loginUser = async (req, res) => {
     console.log({
          body: req.body,
     });
     // try {
     console.log("logging user in");
     const email = req.body.email;
     const password = req.body.password;
     const domain = req.body.domain;
     const user = await User.findByCredentials(email, password);
     console.log("first check", user);
     if (!user) {
          return res.status(401).json({ error: "Login failed! Check authenthication credentails" });
     }
     console.log("check", user);
     const userWithoutPassword = {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          chatID: user.chatID,
          onboarded: user.onboarded,
          partner_id: user?.partner_ids?.find((partner) => partner?.domain === domain)?.id,
          subscribed: user.subscribed,
          status: user.status,
     };
     const token = await user.generateAuthToken(domain);
     res.status(201).json({ user: userWithoutPassword, token });
     // } catch (error) {
     //      res.status(400).json(error);
     // }
};
const socialLogin = async (req, res) => {
     console.log("in login");
     try {
          const email = req.body.email;
          const password = req.body.password;
          const domain = req.body.domain;
          const user = await User.findByCredentials(email, password);

          if (!user) {
               return res
                    .status(401)
                    .json({ error: "Login failed! Check authenthication credentails" });
          }

          const userWithoutPassword = {
               _id: user._id,
               firstname: user.firstname,
               lastname: user.lastname,
               email: user.email,
               role: user.role,
               chatID: user.chatID,
               onboarded: user.onboarded,
               partner_id: user?.partner_ids?.find((partner) => partner?.domain === domain)?.id,
               subscribed: user.subscribed,
               status: user.status,
          };
          const token = await user.generateAuthToken(domain);
          res.status(201).json({ user: userWithoutPassword, token });
     } catch (error) {
          res.status(400).json(error);
     }
};
exports.socialRegister = async (req, res) => {
     console.log("register");
     try {
          await Odoo.connect();
          let user = await User.findOne({ email: req.body.email });
          if (req.body.role && user) {
               console.log("switching to login");
               return socialLogin(req, res);
          }
          const domainExists = await User.findOne({
               "partner_ids.domain": req.body.domain,
               email: req.body.email,
          });

          if (domainExists) {
               return res.status(409).json({
                    message: "Account Already Exist for this Site",
                    status: false,
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
                         name: `${req.body.firstname ?? user?.firstname} ${
                              req.body.lastname ?? user?.lastname
                         }`,
                         email: req.body.email ?? user?.email,
                         phone: req.body.phone ?? user?.phone,
                         company_id: company.company_id,
                         is_published: true,
                    },
               ]);
               console.log("Partner created successfully. Partner ID:", partner_id);
          }
          let data;
          let token;

          if (!user) {
               const newUser = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    role: req.body.role,
                    chatID: req.body.chatID ?? "",
                    tour: req.body?.tour ?? "",
                    password: req.body.password,
                    phone: req.body.phone,
                    partner_ids: [{ id: partner_id, domain: req.body.domain }],
                    currentSiteType: req.body.currentSiteType,
                    ...(company && { company: company._id }),
               });
               data = await newUser.save();
               token = await newUser.generateAuthToken(req.body.domain);

               let vendorConnectedAccount = await paymentService.createConnectedAccount({
                    email: data.email,
               });

               await User.updateOne(
                    { _id: data.id },
                    {
                         $set: { stripeConnectedAccountId: vendorConnectedAccount.id },
                    },
               );
          } else {
               user = await User.findByIdAndUpdate(user?._id, {
                    $set: {
                         partner_ids: [
                              ...user?.partner_ids,
                              { id: partner_id, domain: req.body.domain },
                         ],
                    },
               });
               token = await user.generateAuthToken(req.body.domain);
          }
          let userWithoutPassword;
          if (!user)
               userWithoutPassword = {
                    _id: data._id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    role: data.role,
                    chatID: data.chatID,
                    company: data.company,
               };
          sendWelcomeEmail(
               req.body?.email ?? user?.firstname,
               req.body?.firstname ?? user?.lastname,
               req?.body.currentSiteType ?? user?.currentSiteType,
          );

          res.status(201).json({
               user: userWithoutPassword ?? user,
               token,
               status: true,
          });
     } catch (error) {
          console.log("error", error);
          res.status(400).json({ error, status: false });
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

exports.saveDropshipper = async (req, res) => {
     try {
          const { _id } = req.userData;
          const { name, apiKey, shopID } = req.body;

          if (!name || !apiKey || !shopID) {
               return res.status(400).json({ message: "All dropshipper details are required" });
          }

          const user = await User.findById(_id);
          if (!user) {
               return res.status(404).json({ message: "User not found" });
          }

          const dropshipperData = {
               name,
               apiKey,
               shopID,
               verified: true,
          };

          user.dropshippers.push(dropshipperData);
          await user.save();

          return res
               .status(200)
               .json({ message: "Dropshipper added successfully", dropshipper: dropshipperData });
     } catch (error) {
          return res.status(500).json({ message: error.message });
     }
};

exports.getDropshippers = async (req, res) => {
     try {
          const { _id } = req.userData;

          const user = await User.findById(_id);
          if (!user) {
               return res.status(404).json({ message: "User not found" });
          }

          return res.status(200).json({ dropshippers: user.dropshippers, status: true });
     } catch (error) {
          return res.status(500).json({ message: error.message });
     }
};

exports.listBilling = async (req, res) => {
     try {
          await Odoo.connect();

          const partnerAddresses = await Odoo.execute_kw("res.partner", "search_read", [
               [["parent_id", "=", 164]],
               ["name", "street", "city", "zip", "country_id", "state_id", "type", "phone"], // Fields you want to retrieve
          ]);

          return res.status(201).json({ status: true, partnerAddresses });
     } catch (err) {
          res.status(400).json({ error: err, status: false });
     }
};

exports.listShipping = async (req, res) => {
     console.log("list shipping information");
     try {
          const partnerId = +req.params?.partner_id;

          const partnerAddresses = await Odoo.execute_kw("res.partner", "search_read", [
               [["parent_id", "=", partnerId]],
               [
                    "name",
                    "street",
                    "city",
                    "zip",
                    "country_id",
                    "state_id",
                    "type",
                    "phone",
                    "email",
               ], // Fields you want to retrieve
          ]);

          return res.status(200).json({ data: partnerAddresses, status: true });
     } catch (error) {
          console.log("error", error);
          res.status(400).json({ error, status: false });
     }
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
               await Odoo.connect();

               const partnerId = +req.body?.partner_id;
               const countryName = req.body.country; // Assuming the country name is in the request
               const countryId = await Odoo.execute_kw("res.country", "search", [
                    [["name", "=", countryName]],
               ]);

               console.log("partnerId", partnerId);
               if (!countryId || countryId.length === 0) {
                    return res.status(400).json({ error: "Country not found", status: false });
               }

               // Get state_id based on the provided state name
               const stateName = req.body.state; // Assuming the state name is in the request
               const stateId = await Odoo.execute_kw("res.country.state", "search", [
                    [["name", "=", stateName]],
               ]);

               // Now, update the address with the retrieved country_id and state_id
               await Odoo.execute_kw("res.partner", "write", [
                    [partnerId],
                    {
                         child_ids: [
                              [
                                   0,
                                   0,
                                   {
                                        name: `${req.body.firstname} ${req.body.lastname}`,
                                        street: req.body.street,
                                        city: req.body.city,
                                        email: req.body.email,
                                        zip: req.body.zipcode,
                                        phone: req.body.phone,
                                        country_id: countryId[0], // Use the first match
                                        state_id: stateId?.[0] ?? false, // Use the first match
                                        type: "delivery",
                                   },
                              ],
                         ],
                    },
               ]);

               return res.status(201).json({ message: "Shipping address added", status: true });
               // return res.status(201).json({ order: ordersWithDetails[0], status: true });
          } catch (error) {
               console.log("err", error);
               res.status(400).json({ error: error.message, status: false });
          }
     });

exports.updateShippingAddress = async (req, res) => {
     console.log("Updating shipping address");
     try {
          const partnerId = +req.body.partner_id;

          const existingAddressId = +req.body.addressId;

          // Update the shipping address details
          const updatedAddress = {
               name: `${req.body.firstname} ${req.body.lastname}`,
               street: req.body.street,
               city: req.body.city,
               email: req.body.email,
               zip: req.body.zipcode,
               phone: req.body.phone,
               // Update other address details as needed
          };

          // Assuming you have the Odoo API to update the address
          await Odoo.execute_kw("res.partner", "write", [
               [partnerId],
               {
                    child_ids: [
                         [1, existingAddressId, updatedAddress], // Use 1 to update an existing record
                    ],
               },
          ]);

          return res.status(200).json({ message: "Shipping address updated", status: true });
     } catch (error) {
          console.error("Error:", error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.deleteShippingAddress = async (req, res) => {
     console.log("Deleting shipping address");
     try {
          // Assuming you have established a connection to your Odoo instance (e.g., await Odoo.connect();)

          const partnerId = +req.params.partner_id;

          // Fetch the address ID you want to delete (e.g., from request parameters)
          const addressIdToDelete = +req.params.addressId; // Assuming you pass the address ID in the URL parameters

          // Assuming you have the Odoo API to delete the address
          await Odoo.execute_kw("res.partner", "write", [
               [partnerId],
               {
                    child_ids: [
                         [2, addressIdToDelete, false], // Use 2 to delete an existing record
                    ],
               },
          ]);

          return res.status(204).json({ status: true }); //No content is sent upon successful deletion
     } catch (error) {
          console.error("Error:", error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.editBillingAddress = async (req, res) => {
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
};

exports.updateUserDetails = async (req, res) => {
     try {
          const updatedUserData = {
               firstname: req.body?.firstname,
               lastname: req.body.lastname,
               email: req.body.email,
               phone: req.body?.phone,
               image: req.body?.image,
               sales_opt_in: req.body?.sales_opt_in,
               salesEmailReport: req.body?.salesEmailReport,
               timeZone: req.body?.timeZone,
               show_phone: req.body?.show_phone,
          };

          // Assuming you have a User model and a method like `updateUserById` to update a user by ID
          const updatedUser = await User.findByIdAndUpdate(
               req?.userData?._id ?? req.body.userId,
               updatedUserData,
               {
                    new: true,
               },
          );

          let company;
          if (updatedUser?.company)
               company = await Company.findByIdAndUpdate(
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
               sales_opt_in: updatedUser.sales_opt_in,
               salesEmailReport: updatedUser.salesEmailReport,
          };

          res.status(200).json({ user: userWithoutPassword, company, status: true });
     } catch (error) {
          console.log("Error updating user details:", error);
          res.status(400).json({ error, status: false });
     }
};

exports.resetPassword = async (req, res) => {
     try {
          const { token, newPassword } = req.body;
          const decoded = jwt.verify(token, "secret");
          const user = await User.findById(decoded._id);

          if (!user) {
               return res.status(404).json({ message: "User not found" });
          }

          user.password = newPassword;
          await user.save();

          res.status(200).json({ message: "Password updated successfully", status: true });
     } catch (error) {
          console.error("Error updating password:", error);
          res.status(500).json({ error, status: false });
     }
};

exports.updatePassword = async (req, res) => {
     try {
          const user = await User.findById(req.userData._id);
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
     } catch (error) {
          console.log("Error updating user details:", error);
          res.status(500).json({ error, status: false });
     }
};

exports.updatePasswordCustomer = async (req, res) => {
     try {
          const user = await User.findById(req.body.userId);
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
          const updatedUser = await User.findByIdAndUpdate(req.body.userId, updatedUserData, {
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
     } catch (error) {
          console.log("Error updating user details:", error);
          res.status(500).json({ error, status: false });
     }
};

exports.forgotPassword = async (req, res) => {
     try {
          const email = req.body.email;
          const url = req.body.url;
          const check = await User.findOne({ email: email });
          if (!check) {
               return res.status(201).json({ message: "No user found with email", status: false });
          }
          const token = jwt.sign(
               {
                    _id: check._id,
               },
               "secret",
          );
          sendForgotPasswordEmail(email, check.firstname, token, url);
          res.status(200).json({ message: "Reset Password Emaill Sent", status: true });
     } catch (error) {
          res.status(500).json({ error, status: false });
     }
};

exports.getUserDetails = async (req, res) => {
     try {
          const user = await User.findById(req?.userData?._id ?? req.params.id).populate({
               path: "company",
               populate: {
                    path: "selectedCarriers",
               },
               options: { virtuals: true },
          });

          if (!user) {
               return res.status(404).json({ message: "User not found.", status: false });
          }

          res.status(200).json({ user, company: null, status: true });
     } catch (error) {
          console.error("Error fetching user:", error);
          res.status(500).json({ message: "Internal server error.", status: false });
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

exports.deleteAccount = async (req, res) => {
     try {
          const userId = req.userData._id;
          const companyId = req.userData.company._id;
          const siteId = req.userData.company.site;

          // Step 1: Find the user
          const user = await User.findById(userId);

          if (!user) {
               return res.status(404).json({ message: "User not found", status: false });
          }

          // Step 2: Delete associated advertisements (adverts) by their _id values
          if (siteId) {
               await Advert.deleteMany({ _id: { $in: siteId } });
          }

          // Step 3: Find and delete the user's associated site if it exists
          if (siteId) {
               await Site.findByIdAndRemove(siteId);
          }

          // Step 4: Find and delete the user's associated company if it exists
          if (companyId) {
               await Company.findByIdAndRemove(companyId);
          }

          // Step 5: Delete the user account
          await User.findByIdAndRemove(userId);

          res.status(200).json({
               message: "Account, associated site, company, advertisements, and data deleted successfully",
               status: true,
          });
     } catch (error) {
          console.error("Error deleting account:", error);
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.updateTour = async (req, res) => {
     try {
          const userId = req.userData._id;
          const tour = req.body.tour;

          const user = await User.findByIdAndUpdate(
               userId,
               {
                    $set: {
                         tour,
                    },
               },
               { new: true },
          ).populate({
               path: "company",
               options: { virtuals: true },
          });

          res.status(200).json({
               status: true,
               user: user,
          });
     } catch (error) {
          console.error("Error deleting account:", error);
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.banUser = async (req, res) => {
     try {
          const { userId, reason } = req.body;

          const existingBannedUser = await User.findOne({ _id: userId, status: "banned" });

          if (existingBannedUser) {
               throw new Error("User is already banned");
          }

          const bannedUser = await User.findByIdAndUpdate(
               userId,
               { status: "banned", banReason: reason },
               { new: true },
          );

          if (!bannedUser) {
               return res.status(404).json({ message: "User not found", status: false });
          }

          res.status(200).json({ message: "User banned successfully", status: true });
     } catch (error) {
          console.error("Error banning user:", error);
          res.status(400).json({ message: error.message, status: false });
     }
};

exports.unbanUser = async (req, res) => {
     try {
          const { userId } = req.body;

          const unbannedUser = await User.findByIdAndUpdate(
               userId,
               { status: "active", banReason: null }, // Reset the banReason when unbanning
               { new: true },
          );

          if (!unbannedUser) {
               return res.status(404).json({ message: "User not found", status: false });
          }

          res.status(200).json({ message: "User unbanned successfully", status: true });
     } catch (error) {
          console.log("Error unbanning user:", error);
          res.status(500).json({ error, status: false });
     }
};

exports.suspendUser = async (req, res) => {
     try {
          const { suspensionDuration, suspensionUnit, userId, suspensionReason } = req.body;
          const userIdToSuspend = userId;

          const isUserSuspended = await User.exists({
               _id: userIdToSuspend,
               status: "suspended",
          });

          if (isUserSuspended) {
               return res.status(400).json({ message: "User is already suspended", status: false });
          }

          const userToSuspend = await User.findById(userIdToSuspend);

          if (!userToSuspend) {
               return res.status(404).json({ message: "User not found", status: false });
          }

          if (userToSuspend.role === "admin") {
               return res
                    .status(403)
                    .json({ message: "Admin users cannot be suspended", status: false });
          }

          const suspensionEndDate = moment().add(suspensionDuration, suspensionUnit);

          const suspendedUser = await User.findByIdAndUpdate(
               userIdToSuspend,
               {
                    status: "suspended",
                    suspensionEndDate: suspensionEndDate.toDate(),
                    suspensionCount: userToSuspend.suspensionCount + 1,
                    $push: { suspensionReasons: suspensionReason },
               },
               { new: true },
          );

          res.status(200).json({
               message: `User suspended successfully until ${suspensionEndDate.format(
                    "YYYY-MM-DD",
               )}`,
               status: true,
          });
     } catch (error) {
          console.log("Error suspending user:", error);
          res.status(500).json({ error, status: false });
     }
};

exports.liftSuspension = async (req, res) => {
     try {
          const { userId } = req.body;
          const userToLift = await User.findById(userId);

          if (!userToLift) {
               return res.status(404).json({ success: false, message: "User not found" });
          }

          if (userToLift.status !== "suspended") {
               return res.status(400).json({
                    success: false,
                    message: "User is not suspended, so suspension cannot be lifted",
               });
          }

          const suspensionReasons = userToLift.suspensionReasons;

          const liftedUser = await User.findByIdAndUpdate(
               userId,
               {
                    status: "active",
                    suspensionEndDate: null,
                    suspensionReasons: suspensionReasons, // The reasons remain
               },
               { new: true },
          );

          res.status(200).json({
               success: true,
               message: "Suspension lifted successfully",
               data: liftedUser,
          });
     } catch (error) {
          console.error("Error lifting suspension:", error);
          res.status(500).json({ success: false, error: error.message });
     }
};

exports.getAllUsers = async (req, res) => {
     try {
          const userType = req.query?.type;
          const users = await User.find(userType ? { role: USER_ROLE[userType] } : {});
          res.status(200).json({
               status: true,
               users: users,
          });
     } catch (error) {
          console.error("Error fetching users:", error);
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.getAllVendors = async (req, res) => {
     try {
          const users = await User.find({ role: "VENDOR" });
          res.status(200).json({
               status: true,
               users: users,
          });
     } catch (error) {
          console.error("Error fetching users:", error);
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.sendAdminMail = async (req, res) => {
     try {
          const { email, name, message } = req.body;
          sendAdminMessage(email, name, message);
          res.status(200).json({ message: "Mail sent successfully" });
     } catch (error) {
          console.error("Error fetching users:", error);
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.sendVendorMail = async (req, res) => {
     try {
          const { email, name, message, orderID } = req.body;
          sendVendorMessage(email, name, message, orderID);
          res.status(200).json({ message: "Mail sent successfully" });
     } catch (error) {
          console.error("Error fetching users:", error);
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.getUserByPartnerID = async (req, res) => {
     try {
          const partner_id = req.params.id;
          const user = await User.findOne({ partner_id: partner_id });
          res.status(200).json(user);
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.getUserByCompanyID = async (req, res) => {
     try {
          const company_id = req.params.id;
          console.log(company_id);
          const company = await Company.findOne({ company_id: company_id });
          const user = await User.findById(company.user_id);
          user.company = company;
          res.status(200).json(user);
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.sendNotification = async (req, res) => {
     const pushNotification = req.body.pushNotification;
     const info = req.body.info;
     await webpush.sendNotification(pushNotification, JSON.stringify(info));
     res.status(200).json({ message: "sent" });
};

exports.getAllFreelancUsers = async (req, res) => {
     try {
          const users = await user.find({ role: USER_ROLE.FREELANCER });
          res.status(200).json(users);
          return successResponder(res, users);
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};
