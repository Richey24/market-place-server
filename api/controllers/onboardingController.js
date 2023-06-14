const User = require("../../model/User");
const Company = require("../../model/Company");
var Odoo = require("async-odoo-xmlrpc");

const getErrorMessage = (faultCode) => {
     switch (faultCode) {
          case 1:
               return "User/Company Already Exists";
          case 2:
               return "Access Denied";
          case 3:
               return "Invalid Database";
          default:
               return "Unknown Error";
     }
};

exports.getOnboarding = async (req, res) => {
     console.log("Post Request: Onboarding Users");
     console.log(req.body, req.userData);

     const currentDate = new Date();

     const year = currentDate.getFullYear();
     const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
     const day = String(currentDate.getDate()).padStart(2, "0");

     const formattedDate = `${year}-${month}-${day}`;

     // Onboarding params
     let date = formattedDate;
     let company_name = req.body.company_name;
     let company_type = req.body.company_type;
     let tenantname = req.body.domain;
     let theme = req.body.theme;
     let brandcolor = req.body.colors;
     let subscription = req.body.subscription;
     const { firstname, lastname, email, _id } = req.userData;

     try {
          var odoo = new Odoo({
               url: "http://104.43.252.217/",
               port: 80,
               db: "bitnami_odoo",
               username: "user@example.com",
               password: "850g6dHsX1TQ",
          });

          await odoo.connect();
          console.log("Connected to Odoo XML-RPC");

          let partner = await odoo.execute_kw("res.partner", "create", [
               { is_company: true, is_published: true, is_public: true, name: company_name },
          ]);

          let domain = req.body.domain + "." + "imarketplace.world";
          let company_id = await odoo.execute_kw("res.company", "create", [
               {
                    account_opening_date: date,
                    active: true,
                    name: req.body.company_name,
                    partner_id: partner,
                    website: domain,
                    email,
                    phone: "80911223344",
                    currency_id: 1,
               },
          ]);

          //   const save_user = new User({
          //        firstname: req.body.firstname,
          //        lastname: req.body.lastname,
          //        email: req.body.email,
          //        role: "vendor",
          //        password: req.body.password,
          //   });

          //   let data = await save_user.save();
          //   const token = await save_user.generateAuthToken();

          const save_company = new Company({
               user_id: _id,
               company_id: company_id,
               company_name: company_name,
               company_type: company_type,
               subdomain: tenantname,
               theme: theme,
               phone: "09033442211",
               logo: req.body.logo,
               brandcolor: brandcolor,
               subscription: subscription,
               country: "req.body.country",
               city: "req.body.city",
               state: " req.body.state",
          });

          let company_data = await save_company.save();
          await User.findByIdAndUpdate(_id, {
               $set: { onboarded: true, companyId: company_data?._id },
          });
          res.status(201).json({ company: company_data, status: true });
     } catch (error) {
          const faultCode = error?.faultCode;
          if (faultCode) {
               const errorMessage = getErrorMessage(faultCode);
               res.status(400).json({ error: errorMessage, status: false });
               //    console.error("Error creating company:", faultCode, errorMessage);
          } else {
               res.status(400).json({ error, status: false });
          }
     }
};
