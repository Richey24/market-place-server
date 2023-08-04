const User = require("../../model/User");
const Company = require("../../model/Company");
var Odoo = require("async-odoo-xmlrpc");

exports.getSiteByDomain = async (req, res) => {
     const { domain } = req.params;
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

          const company = await Company.findOne({ subdomain: domain })
               .populate({
                    path: "site",
               })
               .populate({
                    path: "user_id",
               });

          if (company) {
               res.status(201).json({ status: true, domain, company });
          } else {
               throw "Subdomain does not exist";
          }
     } catch (error) {
          console.log("error", error);
          res.status(400).json({ error, status: false });
     }
};
