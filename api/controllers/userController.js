const User = require("../../model/User");
const Billing = require("../../model/Billing");
const Shipping = require("../../model/Shipping");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const sendEmail = (email, name) => {
     const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
               user: "olaiyabasit@gmail.com",
               pass: "uwfpiycurkdkvcso",
          },
     });
     const mailOptions = {
          from: "hello@example.com",
          to: email,
          subject: "Welcome to Our Ecommerce Marketplace - Your Free Trial Period!",
          text: `Dear ${name},
          We are thrilled to welcome you as a new vendor on our vibrant and dynamic ecommerce marketplace.
          We understand that getting started in a new marketplace can be both thrilling and challenging, and we want to support you every step of the way. That is why we are delighted to offer you a free two-week trial period to set up and review your ecommerce store.
          During this trial period, you will have ample time to familiarize yourself with our platform, showcase your products, and ensure that your store is a true reflection of your brand.
          Here are some key details regarding your free trial period:
          Trial Start Date: [Insert start date]
          Trial End Date: [Insert end date]
          -------------------------------------------------------------------------------------------------------------------
          Benefits of the Trial Period:
          Opportunity to create and customize your ecommerce store.
          Full access to our suite of tools and features.
          Upload and organize your products, descriptions, and images.
          Familiarize yourself with our user-friendly interface.
          Explore our robust marketing, promotional, and video training resources.
          Evaluate the effectiveness of our platform for your business.
          We realize that we as people of color are stronger together, and when we stand together our possibilities are limitless.
          Welcome aboard! If you have any questions or need further assistance, please do not hesitate to reach out to us. We are always here to help.
          Best regards,
          i.b. Israel
          CEO / President
          Dreamtech Labs, LLC
          858.384-6488`,
     };
     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error);
          } else {
               console.log("Email sent: " + info.response);
               // do something useful
          }
     });
};

exports.register = async (req, res) => {
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
     sendEmail(req.body.email, req.body.firstname);
     res.status(201).json({ user: userWithoutPassword, token });
};

exports.loginUser = async (req, res) => {
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
     };

     console.log(user);
     if (!user) {
          return res.status(401).json({ error: "Login failed! Check authenthication credentails" });
     }

     const token = await user.generateAuthToken();
     res.status(201).json({ user: userWithoutPassword, token });
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
