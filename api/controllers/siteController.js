const User = require("../../model/User");
const Company = require("../../model/Company");
const Site = require("../../model/Site");

var Odoo = require("async-odoo-xmlrpc");

exports.getSiteByDomain = async (req, res) => {
     const { domain } = req.params;
     try {
          const company = await Company.findOne({ subdomain: domain })
               .populate({
                    path: "site",
               })
               .populate({
                    path: "status",
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

exports.updateSiteById = async (req, res) => {
     const { id } = req.params;
     const updateData = req.body;

     console.log("updateData", updateData);
     try {
          const site = await Site.findByIdAndUpdate(id, { $set: { ...updateData } }, { new: true });

          if (site) {
               res.status(201).json({ status: true, site });
          } else {
               throw "Site does not exist";
          }
     } catch (error) {
          console.log("error", error);
          res.status(400).json({ error, status: false });
     }
};
