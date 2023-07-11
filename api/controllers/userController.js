const User = require("../../model/User");
const Billing = require("../../model/Billing");
const Shipping = require("../../model/Shipping");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

const sendEmail = (email, name) => {
     const startDate = new Date();
     const endDate = new Date();
     endDate.setDate(endDate.getDate() + 14);
     const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
     const formattedDate = (dt) => dt.toLocaleDateString("en-US", options);

     const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
               user: "olaiyabasit@gmail.com",
               pass: "uwfpiycurkdkvcso",
          },
     });
     const mailOptions = {
          from: "isrealIb@noreply.com",
          to: email,
          subject: "Welcome to Our IsrealB Marketplace - Your Free Trial Period!",
          html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              /* CSS styles for the email template */
              @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
      
              body {
                font-family: 'Montserrat', Arial, sans-serif;
                line-height: 1.6;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
                border-radius: 5px;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .message {
                margin-bottom: 20px;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
              }
              .highlight {
                font-weight: bold;
              }
              .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
              }
              .logo {
                display: block;
                margin: 0 auto;
                max-width: 200px;
              }
              .cta-button {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
              }
              .cta-button:hover {
                background-color: #0056b3;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img class="logo" src="https://example.com/logo.png" alt="Company Logo">
                <h1 style="color: #333333;">Welcome as a New Vendor!</h1>
              </div>
              <div class="message">
                <p>Dear ${name},</p>
                <p>We are thrilled to welcome you as a new vendor on our vibrant and dynamic ecommerce marketplace.</p>
                <p>We understand that getting started in a new marketplace can be both thrilling and challenging, and we want to support you every step of the way. That is why we are delighted to offer you a free two-week trial period to set up and review your ecommerce store.</p>
                <p>During this trial period, you will have ample time to familiarize yourself with our platform, showcase your products, and ensure that your store is a true reflection of your brand.</p>
                <p>Here are some key details regarding your free trial period:</p>
                <ul>
                  <li><span class="highlight">Trial Start Date:</span> ${formattedDate(
                       startDate,
                  )}</li>
                  <li><span class="highlight">Trial End Date:</span> ${formattedDate(endDate)}</li>
                </ul>
              </div>
              <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
              <div class="message">
                <p><span class="highlight">Benefits of the Trial Period:</span></p>
                <ul>
                  <li>Opportunity to create and customize your ecommerce store.</li>
                  <li>Full access to our suite of tools and features.</li>
                  <li>Upload and organize your products, descriptions, and images.</li>
                  <li>Familiarize yourself with our user-friendly interface.</li>
                  <li>Explore our robust marketing, promotional, and video training resources.</li>
                  <li>Evaluate the effectiveness of our platform for your business.</li>
                </ul>
              </div>
              <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
              <div class="message">
                <p>We realize that we, as people of color, are stronger together, and when we stand together, our possibilities are limitless.</p>
              </div>
              <div class="message">
                <p>Welcome aboard! If you have any questions or need further assistance, please do not hesitate to reach out to us. We are always here to help.</p>
                <a class="cta-button" href="https://example.com">Get Started</a>
              </div>
              <div class="footer">
                <p style="color: #777777;">This email was sent by Dreamtech Labs, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
              </div>
            </div>
          </body>
          </html>
        `,
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

const sendTrialEndReminderEmail = (email, name) => {
     const endDate = new Date();
     endDate.setDate(endDate.getDate() + 14);
     const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
     const formattedDate = (dt) => dt.toLocaleDateString("en-US", options);

     const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
               user: "olaiyabasit@gmail.com",
               pass: "uwfpiycurkdkvcso",
          },
     });
     const mailOptions = {
          from: "isrealIb@noreply.com",
          to: email,
          subject: "Reminder: Your Trial Period Ends Soon",
          html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              /* CSS styles for the email template */
              @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
          
              body {
                font-family: 'Montserrat', Arial, sans-serif;
                line-height: 1.6;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
                border-radius: 5px;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .message {
                margin-bottom: 20px;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
              }
              .highlight {
                font-weight: bold;
              }
              .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
              }
              .logo {
                display: block;
                margin: 0 auto;
                max-width: 200px;
              }
              .cta-button {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
              }
              .cta-button:hover {
                background-color: #0056b3;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img class="logo" src="https://example.com/logo.png" alt="Company Logo">
                <h1 style="color: #333333;">Trial End Reminder</h1>
              </div>
              <div class="message">
                <p>Dear ${name},</p>
                <p>We wanted to remind you that your trial period on our vibrant and dynamic ecommerce marketplace is ending soon.</p>
                <p>Your trial period will expire on [Insert end date].</p>
                <p>Please make sure to review your store, products, and settings before the trial ends.</p>
                <p>If you have any questions or need any assistance, our support team is ready to help.</p>
                <p>Thank you for trying out our platform. We hope you've had a positive experience so far and consider continuing with our service.</p>
              </div>
              <div class="footer">
                <p style="color: #777777;">This email was sent by Dreamtech Labs, LLC. If you have any questions, please <a href="mailto:info@example.com" style="color: #777777; text-decoration: underline;">contact us</a>.</p>
              </div>
            </div>
          </body>
          </html>          
        `,
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

const reminderJob = cron.schedule("0 9 * * *", () => {
     const currentDate = new Date();
     const endDate = new Date();
     endDate.setDate(endDate.getDate() + 14);
     const reminderDate = new Date(endDate);
     reminderDate.setDate(reminderDate.getDate() - 3);
     if (currentDate.toDateString() === reminderDate.toDateString()) {
          // Code to send the trial end reminder email
          sendTrialEndReminderEmail();
     }
});

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
     reminderJob.start();
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
          subscribed: user.subscribed,
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
