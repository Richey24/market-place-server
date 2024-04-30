const { sendVideoInvite, sendCreateEventMail } = require("../../config/helpers");
const Company = require("../../model/Company");
const nodemailer = require("nodemailer");
const Odoo = require("../../config/odoo.connection");
const Site = require("../../model/Site");
const Service = require("../../model/Service");
const User = require("../../model/User");

const transporter = nodemailer.createTransport({
     host: "smtp.office365.com",
     port: 587,
     secure: false,
     auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
     },
});

const getCompany = async (req, res) => {
     try {
          const companyId = req.params.id;

          if (!companyId) {
               return res.status(400).json({ message: "Company ID is required" });
          }

          const company = await Company.findOne({ company_id: companyId }, "subdomain");

          if (!company) {
               return res.status(404).json({ message: "Company not found" });
          }

          res.status(200).json(company);
     } catch (error) {
          console.error(error);
          res.status(500).json({ error: error.message });
     }
};

const updateCompany = async (req, res) => {
     try {
          const id = req.params.id;
          const data = req.body;
          if (!id) {
               return res.status(400).json({ message: "Send Company ID" });
          }
          await Company.findOneAndUpdate({ company_id: id }, data);
          res.status(200).json({ message: "success" });
     } catch (error) {
          return res.status(500).json({ error });
     }
};

const updateBrandColor = async (req, res) => {
     const { companyId } = req.params;
     const { brandColor } = req.body;

     if (!brandColor) {
          return res.status(400).send({ message: "brandColor is required" });
     }

     try {
          const company = await Company.findById(companyId);
          if (!company) {
               return res.status(404).send({ message: "Company not found" });
          }

          company.brandcolor = brandColor;
          await company.save();

          res.status(200).send({
               message: "Brand colors updated successfully",
               brandColor: company.brandColor,
               status: true,
          });
     } catch (error) {
          console.log("err", error.message);
          res.status(500).send({ message: "Error updating brand colors", error: error.message });
     }
};

const findCompanyByCompanyIdAndPopulateUser = async (companyId) => {
     try {
          const company = await Company.findOne({ company_id: companyId })
               .populate("user_id")
               .exec();

          if (!company) return null;

          // The user data will be populated in the 'user_id' field
          return company;
     } catch (error) {
          throw error;
     }
};

const findCompaniesAndPopulateUser = async () => {
     try {
          const companies = await Company.find({}).populate("user_id").exec();

          if (!companies) return null;

          // The user data will be populated in the 'user_id' field
          return companies;
     } catch (error) {
          throw error;
     }
};

const deleteCompany = async (req, res) => {
     try {
          const id = req.params.id
          const company = await Company.findById(id)
          if (!company) {
               return res.status(400).json({ message: "company not found" })
          }
          if (company.type !== "service") {
               await Odoo.connect();
               let searchFilter = [
                    ["type", "=", "consu"],
                    ["company_id", "=", company.company_id],
               ];
               const theProducts = await Odoo.execute_kw(
                    "product.template",
                    "search_read",
                    [
                         searchFilter,
                         [
                              "id",
                         ],
                         null,
                         0,
                         // 10,
                    ],
                    { fields: ["name", "public_categ_ids"] },
               );
               for (const product of theProducts) {
                    await Odoo.execute_kw("product.template", "unlink", [[Number(product.id)]]);
               }
          } else {
               const services = await Service.find({ userId: company.user_id })
               for (const service of services) {
                    await Service.findByIdAndDelete(service._id)
               }
          }
          await Site.findByIdAndDelete(company.site)
          await Company.findByIdAndDelete(company._id)
          await User.findByIdAndDelete(company.user_id)
          res.status(200).send({ message: "Company and all related data deleted successfully" });
     } catch (error) {
          console.log("err", error.message);
          res.status(500).send({ message: "Error deleting company", error: error.message });
     }
}

const sendMeetingInvite = async (req, res) => {
     try {
          const { name, email, url } = req.body;
          if (!name || !email || !url) {
               return res.status(400).json({ message: "Send required parameter" });
          }
          const mailOptions = {
               from: process.env.EMAIL,
               to: email,
               subject: `Video Meeting Invitation`,
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
            <img class="logo" src="https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/logo.png" alt="Company Logo">
            <h1 style="color: #333333;">Video Meeting Invitation</h1>
          </div>
          <div class="message">
            <p>Hi ${name}, Click on the button below to join the meeting</p>
            <a class="cta-button" href="${url}">Join meeting</a>
            </div>
          <div class="footer">
            <p style="color: #777777;">This email was sent by Breaking Black Ventures, LLC. If you no longer wish to receive emails from us, please <a href="#" style="color: #777777; text-decoration: underline;">unsubscribe</a>.</p>
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
          res.status(200).json({ message: "video invite sent" });
     } catch (error) {
          return res.status(500).json({ error });
     }
};

module.exports = {
     updateCompany,
     findCompanyByCompanyIdAndPopulateUser,
     findCompaniesAndPopulateUser,
     updateBrandColor,
     sendMeetingInvite,
     getCompany,
     deleteCompany
};
