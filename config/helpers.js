const nodemailer = require("nodemailer");
const Company = require("../model/Company");
const cron = require("node-cron");
const User = require("../model/User");

const sendOnboardingEmail = (email, name) => {
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

const sendWelcomeEmail = (email, name) => {
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
          subject: "Welcome to Our IMarketplace",
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
             <p>We understand that getting started in a new marketplace can be both thrilling and challenging, and we want to support you every step of the way.</p>
             <p>Here are some key benefits of joining our platform:</p>
             <ul>
               <li>Opportunity to create and customize your ecommerce store.</li>
               <li>Full access to our suite of tools and features.</li>
               <li>Upload and organize your products, descriptions, and images.</li>
               <li>Familiarize yourself with our user-friendly interface.</li>
               <li>Explore our robust marketing, promotional, and video training resources.</li>
               <li>Evaluate the effectiveness of our platform for your business.</li>
             </ul>
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

const sendTrialEndReminderEmail = (email, name, company_id) => {
     const endDate = new Date();
     endDate.setDate(endDate.getDate() + 14);
     const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
     const formattedDate = (dt) => dt.toLocaleDateString("en-US", options);
     const extensionLink = `https://market-server.azurewebsites.net/api/trial?company_id=${company_id}`;

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
                <a href="${extensionLink}" class="cta-button">Extend Trial</a>
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

const sendSuspensionEmail = (email, name, reason) => {
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
          subject: "Account Suspension Notice",
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
          background-color: #ff3333; /* Red color for emphasis on suspension */
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
        .cta-button:hover {
          background-color: #cc0000; /* Darker red on hover */
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img class="logo" src="https://example.com/logo.png" alt="Company Logo">
          <h1 style="color: #333333;">Account Suspension Notice</h1>
        </div>
        <div class="message">
          <p>Dear ${name},</p>
          <p>We regret to inform you that your account with IMarketplace has been temporarily suspended due to ${reason}.</p>
          <p>Please review our terms of service to understand the specific violation that led to this action. If you believe this suspension is in error or if you have any questions, please contact our support team immediately.</p>
        </div>
        <div class="message">
          <p>We take these matters seriously and aim to maintain a secure and fair marketplace for all users. Your cooperation in resolving this issue is appreciated.</p>
          <a class="cta-button" href="https://example.com/contact">Contact Support</a>
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

const sendUnsuspensionEmail = (email, name) => {
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
          subject: "Account Unsuspension Notice",
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
          background-color: #4caf50; /* Green color for emphasis on unsuspension */
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
        .cta-button:hover {
          background-color: #45a049; /* Darker green on hover */
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img class="logo" src="https://example.com/logo.png" alt="Company Logo">
          <h1 style="color: #333333;">Account Unsuspension Notice</h1>
        </div>
        <div class="message">
          <p>Dear ${name},</p>
          <p>We are pleased to inform you that your account with IMarketplace has been unsuspended.</p>
          <p>Thank you for addressing the concerns that led to the suspension. We appreciate your cooperation in maintaining a secure and fair marketplace for all users.</p>
        </div>
        <div class="message">
          <p>Your account is now fully restored, and you can resume using our platform as usual. If you have any further questions or concerns, please feel free to contact our support team.</p>
          <a class="cta-button" href="https://example.com">Continue</a>
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

const sendBanEmail = (email, name, banReason) => {
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
          subject: "Account Ban Notice",
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
          background-color: #ff3333; /* Red color for emphasis on ban */
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
        .cta-button:hover {
          background-color: #cc0000; /* Darker red on hover */
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img class="logo" src="https://example.com/logo.png" alt="Company Logo">
          <h1 style="color: #333333;">Account Ban Notice</h1>
        </div>
        <div class="message">
          <p>Dear ${name},</p>
          <p>We regret to inform you that your account with IMarketplace has been banned due to ${banReason}.</p>
          <p>If you believe this ban is in error or if you have any questions, please contact our support team immediately.</p>
        </div>
        <div class="message">
          <p>We take these matters seriously and aim to maintain a secure and fair marketplace for all users.</p>
          <a class="cta-button" href="https://example.com/contact">Contact Support</a>
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

const sendUnbanEmail = (email, name) => {
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
          subject: "Account Unban Notice",
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
          background-color: #4caf50; /* Green color for emphasis on unban */
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
        .cta-button:hover {
          background-color: #45a049; /* Darker green on hover */
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img class="logo" src="https://example.com/logo.png" alt="Company Logo">
          <h1 style="color: #333333;">Account Unban Notice</h1>
        </div>
        <div class="message">
          <p>Dear ${name},</p>
          <p>We are pleased to inform you that your account with IMarketplace has been unbanned.</p>
          <p>Thank you for your cooperation. Your account is now fully restored, and you can resume using our platform as usual.</p>
        </div>
        <div class="message">
          <p>If you have any further questions or concerns, please feel free to contact our support team.</p>
          <a class="cta-button" href="https://example.com">Continue</a>
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

const sendTrialExtensionEmail = (email, name, trialEndDate) => {
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
          subject: "Your Free Trial Period Has Been Extended!",
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
               <h1 style="color: #333333;">Your Free Trial Period Has Been Extended!</h1>
             </div>
             <div class="message">
               <p>Dear ${name},</p>
               <p>We hope you're enjoying your trial period on our vibrant and dynamic ecommerce marketplace.</p>
               <p>We're excited to inform you that your trial period has been extended by 7 days. You now have additional time to explore our platform, showcase your products, and familiarize yourself with all the features and tools we offer.</p>
               <p>Please note the updated trial end date:</p>
               <ul>
                 <li><span class="highlight">Trial End Date:</span> ${formattedDate(
                      trialEndDate,
                 )}</li>
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
               <p>Keep making the most of your extended trial period! If you have any questions or need further assistance, please don't hesitate to reach out to us. We're here to support you.</p>
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

const sendSubscriptionEmail = (email, name) => {
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
          subject: "Thank You for Subscribing to Our Service",
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
          <h1 style="color: #333333;">Thank You for Subscribing to Our Service!</h1>
        </div>
        <div class="message">
          <p>Dear ${name},</p>
          <p>Thank you for subscribing to our service! We're thrilled to have you on board.</p>
          <p>By subscribing, you'll gain access to a range of benefits and features that will enhance your experience with our service. We're committed to providing you with top-notch support and ensuring your satisfaction.</p>
          <p>If you have any questions, feedback, or need assistance, please feel free to reach out to us. Our dedicated support team is ready to assist you.</p>
        </div>
        <div class="message">
          <p>Here's what you can expect as a subscriber:</p>
          <ul>
            <li>Access to exclusive features and functionality.</li>
            <li>Regular updates and improvements to enhance your experience.</li>
            <li>Priority customer support for any service-related inquiries.</li>
            <li>Opportunity to provide feedback and influence future enhancements.</li>
          </ul>
        </div>
        <div class="footer">
          <p style="color: #777777;">This email was sent by Dreamtech Labs, LLC. If you have any concerns or wish to unsubscribe from our service, please <a href="#" style="color: #777777; text-decoration: underline;">contact us</a>.</p>
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

const sendSubscriptionExpiredEmail = (email, name) => {
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
          subject: "Subscription Expired or Canceled",
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
          <h1 style="color: #333333;">Your Subscription Has Expired or Been Canceled</h1>
        </div>
        <div class="message">
          <p>Dear ${name},</p>
          <p>We're writing to inform you that your subscription has expired or been canceled.</p>
          <p>We want to take this opportunity to thank you for being a valued subscriber and for your support during the subscription period. We hope our service has met your expectations and provided you with value.</p>
          <p>If you have any questions, need assistance, or would like to reactivate your subscription, please feel free to contact our support team. We'll be happy to assist you.</p>
        </div>
        <div class="message">
          <p>We appreciate your time with us and hope to have the opportunity to serve you again in the future.</p>
          <p>Thank you and best regards,</p>
          <p>The IsraelB Marketplace Team</p>
        </div>
        <div class="footer">
          <p style="color: #777777;">This email was sent by Dreamtech Labs, LLC. If you have any concerns, please <a href="#" style="color: #777777; text-decoration="underline;">contact us</a>.</p>
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

const sendCouponEmail = (email, name) => {
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
          subject: "FREE Ads Code: Supercharge Your Sales Today!",
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
            <p>We have fantastic news for you as a valued tenant on our ecommerce marketplace! You now have access to a FREE Ads code that will turbocharge your sales and attract more customers to your store's landing page.</p>
            <p>With our Ads code, you can:</p>
            <ul>
              <li>Boost Visibility: Display your products prominently on our high-traffic landing page, reaching a wider audience of potential customers.</li>
              <li>Drive Targeted Traffic: Attract visitors who are genuinely interested in your products, resulting in higher conversion rates and increased sales.</li>
              <li>Amplify Your Brand: Create an immersive brand experience, highlight special offers, and leave a lasting impression on your customers.</li>
            </ul>
          </div>
          <div class="message">
            <p>It's easy to get started:</p>
            <ol>
              <li>Log in to your store's admin panel on our marketplace.</li>
              <li>Go to the "Ads" section in your dashboard.</li>
              <li>Follow the instructions to generate your unique Ads code.</li>
              <li>Copy and paste the code onto your store's landing page.</li>
            </ol>
            <p>Watch your sales grow as the Ads code works its magic!</p>
            <p>If you need any assistance, our dedicated support team is here to help. Contact us at [support email/phone number].</p>
            <p>Don't miss out on this incredible opportunity to boost your online presence and generate more revenue. The FREE Ads code is our way of showing appreciation for your commitment to our marketplace.</p>
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

const sendForgotPasswordEmail = (email, name, token, url) => {
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
          subject: "Reset Password",
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
            <h1 style="color: #333333;">Reset Password Request</h1>
          </div>
          <div class="message">
            <p>Dear ${name},</p>
            <p>You requested to reset the password to your account.</p>
            <p>Click on the button below to reset your password</p>
          </div>
          <div class="message">
            <a class="cta-button" href="${url}/reset-password/${token}">Reset Password</a>
            <p>Ignore this email if this was not requested by you.</p>
            <p>If you need any assistance, our dedicated support team is here to help. Contact us at [support email/phone number].</p>
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

const sendSubscriptionReminderEmail = (email, name, trialEndDate) => {
     const endDate = new Date(trialEndDate);
     endDate.setDate(endDate.getDate() - 2); // Calculate the date 2 days before trial end
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
          subject: "Reminder: Subscription Required to Keep Your Account Active",
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
            <h1 style="color: #333333;">Subscription Reminder</h1>
          </div>
          <div class="message">
            <p>Dear ${name},</p>
            <p>We hope you've been enjoying your trial period on our vibrant and dynamic ecommerce marketplace.</p>
            <p>This is a friendly reminder that your trial period is ending in 2 days, and your account will be disabled unless you subscribe.</p>
            <p>Please note the trial end date:</p>
            <ul>
              <li><span class="highlight">Trial End Date:</span> ${formattedDate(trialEndDate)}</li>
            </ul>
          </div>
          <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
          <div class="message">
            <p><span class="highlight">Benefits of Subscription:</span></p>
            <ul>
              <li>Continue to create and customize your ecommerce store.</li>
              <li>Access our full suite of tools and features.</li>
              <li>Upload and organize your products, descriptions, and images.</li>
              <li>Familiarize yourself with our user-friendly interface.</li>
              <li>Explore our robust marketing, promotional, and video training resources.</li>
              <li>Evaluate the effectiveness of our platform for your business.</li>
            </ul>
          </div>
          <div class="message">
            <p>We value your presence on our platform and would love to see you continue as a subscriber. Don't miss out on the opportunities our platform offers!</p>
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

const sendAccountDisablingReminderEmail = (email, name, trialEndDate) => {
     const endDate = new Date(trialEndDate);
     endDate.setDate(endDate.getDate() + 1); // Calculate the date for the day their account will be disabled
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
          subject: "Important: Your Account Will Be Disabled Tomorrow",
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
            border-radius: 5px.
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
          <div class "header">
            <img class="logo" src="https://example.com/logo.png" alt="Company Logo">
            <h1 style="color: #333333;">Account Disabling Reminder</h1>
          </div>
          <div class="message">
            <p>Dear ${name},</p>
            <p>This is an important reminder that your trial period is ending tomorrow, and your account will be disabled unless you subscribe.</p>
            <p>Please note the trial end date:</p>
            <ul>
              <li><span class="highlight">Trial End Date:</span> ${formattedDate(trialEndDate)}</li>
            </ul>
          </div>
          <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
          <div class="message">
            <p>We value your presence on our platform and would love to see you continue as a subscriber. Don't miss out on the opportunities our platform offers!</p>
            <a class="cta-button" href="https://example.com/subscribe">Subscribe Now</a>
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

const sendRatingMail = (email, name, url, product) => {
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
          subject: `Your Order ${product._id} - Please rate the products you purchased!`,
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
            padding: 10px;
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
          .reviewBtn {
            font-weight: bold;
            color: white;
            border-radius: 8px;
            padding: 10px 20px;
            background-color: white;
            border: 1px solid blue;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img class="logo" src="https://example.com/logo.png" alt="Company Logo">
          </div>
          <div class="message">
            <p>Dear ${name},</p>
            <p>Thank you for your purchase on ${url}.</p>
            <p>Please help us improve our service and give all ${url} customers a better understanding about the product(s) you ordered by rating them from very poor to very good</p>
          </div>
          <div class="message">
            <div>
            <img class="logo" src="${product.image_1920}" alt="product">
            <div>
              <p>${product.name}</p>
              <a class="cta-button" href="https://${url}/dashboard/pending-review/${product._id}">Rate this product</a>
            </div>
            </div>
            <p>If the link to rate the product is not working, no worries. You can still share your feedback by following these steps:</p>
            <span>On your computer:</span>
            <ul>
              <li>Log in to your ${url} account.</li>
              <li>From your dashboard go to the "Pending Reviews" section.</li>
              <li>Click on Rate this product button</li>
            </ul>
          </div>
          <div class="footer">
          <p>
          If you're not happy with your purchase, you can return it to us with ease. ${url} offers a simple return and quick refund process. Click here to <a href="https://${url}/faq">learn more</a>.  
            </p>
            <p>
            You can return an item within 7 days of delivery if it is not as expected (wrong, defective, or damaged). In most cases, you can also return an item if you change your mind. To request a return, go to the <a href="https://${url}/dashboard/order">Order page</a>.
            </p>
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

const formatDate = (date) => {
     const year = date.getFullYear();
     const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
     const day = String(date.getDate()).padStart(2, "0");
     const formattedDate = `${year}-${month}-${day}`;
     return formattedDate;
};

const deleteUserData = async (userId, companyId, siteId) => {
     try {
          // Step 1: Find the user
          const user = await User.findById(userId);

          if (!user) {
               return { success: false, message: "User not found" };
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

          return {
               success: true,
               message: "Account, associated site, company, advertisements, and data deleted successfully",
          };
     } catch (error) {
          console.error("Error deleting account:", error);
          return { success: false, message: "Internal server error" };
     }
};

const sentReminders = new Set();

const reminderJob = () => {
     cron.schedule("0 9 * * *", () => {
          const currentDate = formatDate(new Date());

          Company.find({ trial_end_date: currentDate }, async (err, companies) => {
               if (err) {
                    console.error(err);
                    return;
               }

               for (const company of companies) {
                    const userId = company.user_id;

                    // Check if a reminder has already been sent for this user
                    if (!sentReminders.has(userId)) {
                         try {
                              const user = await User.findById(userId);
                              if (user) {
                                   sendTrialEndReminderEmail(
                                        user.email,
                                        user.firstname,
                                        company._id,
                                   );
                                   sentReminders.add(userId); // Mark the reminder as sent
                              }
                         } catch (error) {
                              console.error(error);
                         }
                    }
               }
          });
     });
};

const scheduleUserDisablingCronJob = async () => {
     // Calculate the date for 12:00 AM the next day
     const nextDay = calculateNextDay();

     // Calculate the date for 3 weeks after the trial end date
     const threeWeeksLater = calculateThreeWeeksLater();

     // Find users whose trial has ended and are not subscribed
     const usersWithExpiredTrials = await User.find({
          trial_end_date: { $lte: nextDay },
          subscribed: false,
          disabled: false,
     });

     // Iterate over the users and send reminder messages and schedule the deleteUserData function
     usersWithExpiredTrials.forEach(async (user) => {
          // Send a reminder message 2 days before trial end
          sendSubscriptionReminderEmail(user.email, user.name, user.trial_end_date);

          // Schedule the deleteUserData function to run 3 weeks later
          cron.schedule("0 0 * * *", { start: threeWeeksLater }, async () => {
               const result = await deleteUserData(user._id, user.companyId, user.siteId);

               console.log(
                    `Cron job executed to delete user account 3 weeks after disabling: ${result.success}`,
               );
          });

          // Send a reminder message 1 day before trial end
          sendAccountDisablingReminderEmail(user.email, user.name, user.trial_end_date);
     });

     console.log("Cron job executed to manage trial ending reminders.");
};

const calculateNextDay = () => {
     const currentDate = new Date();
     const nextDay = new Date(currentDate);
     nextDay.setDate(currentDate.getDate() + 1);
     nextDay.setHours(0, 0, 0, 0);
     return nextDay;
};

const calculateThreeWeeksLater = (nextDay) => {
     const threeWeeksLater = new Date(nextDay);
     threeWeeksLater.setDate(nextDay?.getDate() + 21);
     return threeWeeksLater;
};

module.exports = {
     sendOnboardingEmail,
     sendTrialEndReminderEmail,
     sendTrialExtensionEmail,
     sendSubscriptionEmail,
     sendSubscriptionExpiredEmail,
     sendSuspensionEmail,
     sendUnsuspensionEmail,
     sendCouponEmail,
     sendRatingMail,
     formatDate,
     reminderJob,
     scheduleUserDisablingCronJob,
     sendWelcomeEmail,
     sendForgotPasswordEmail,
     sendBanEmail,
     sendUnbanEmail,
};
