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

          const company = await Company.findOne({ subdomain: domain }).populate({
               path: "site",
               options: { virtuals: true },
          });

          const site = {
               theme: "theme1",
               pages: [
                    {
                         name: "home",
                         layout: "",
                         sections: [
                              {
                                   name: "footer",
                                   content: "",
                                   component: {
                                        theme: "theme1",
                                        name: "",
                                   },
                              },
                              {
                                   name: "header",
                                   content: "",
                                   component: {
                                        theme: "theme1",
                                        props: { phone: "+1940595000" },
                                   },
                              },
                              {
                                   name: "home",
                                   content: "",
                                   component: {
                                        theme: "theme1",
                                        props: { phone: "+1940595000" },
                                   },
                              },
                         ],
                    },
               ],
               pageLinks: ["home", "shop"],
               styles: {
                    colors: [],
                    mode: "light",
               },
          };

          res.status(201).json({ status: true, domain, company });
     } catch (error) {
          res.status(400).json({ error, status: false });
     }
};
