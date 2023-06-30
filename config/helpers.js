const nodemailer = require("nodemailer");
const Company = require("../model/Company");
const cron = require("node-cron");

const sendEmail = (email, name) => {
     const startDate = new Date();
     const endDate = new Date();
     endDate.setDate(endDate.getDate() + 14);
     const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
     const formattedDate = (dt) => dt.toLocaleDateString("en-US", options);

     const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });
     const mailOptions = {
          from: "info@israelbiblecamp.com",
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
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.PASSWORD,
          },
     });
     const mailOptions = {
          from: "info@israelbiblecamp.com",
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
                <p>If you need more time to explore our platform, we are happy to offer you a one-week extension for your trial period. To extend your trial, simply click the button below:</p>
                <a href="[Insert extension link]" class="cta-button">Extend Trial</a>
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

const formatDate = (date) => {
     const year = date.getFullYear();
     const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
     const day = String(date.getDate()).padStart(2, "0");
     const formattedDate = `${year}-${month}-${day}`;
     return formattedDate;
};

const reminderJob = cron.schedule("0 9 * * *", () => {
     const currentDate = formatDate(new Date());

     Company.find({ trial_end_date: currentDate }, (err, companies) => {
          if (err) {
               console.error(err);
               return;
          }

          companies.forEach(async (company) => {
               try {
                    const user = await User.findById(company.user_id);
                    if (user) {
                         sendTrialEndReminderEmail(user.email, user.firstname);
                    }
               } catch (error) {
                    console.error(error);
               }
          });
     });
});

module.exports = { sendEmail, sendTrialEndReminderEmail, formatDate, reminderJob };
