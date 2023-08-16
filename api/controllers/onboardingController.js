const User = require("../../model/User");
const Company = require("../../model/Company");
const Site = require("../../model/Site");
var Odoo = require("async-odoo-xmlrpc");
const { formatDate, sendOnboardingEmail, reminderJob } = require("../../config/helpers");
const { initProducts } = require("../../utils/initProducts");
const { addMultipleProducts } = require("../../services/product.service");
const companyService = require("../../services/company.service");

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

const site = (theme) => {
     return {
          theme,
          footer: {
               name: "footer",
               content: "",
               component: {
                    theme,
                    name: "",
                    props: {
                         static: {
                              customerService: [
                                   { name: "Help & Faq", link: "/" },
                                   { name: "Order Tracking", link: "/" },
                                   { name: "Shipping & Delivery", link: "/" },
                                   { name: "Orders History", link: "/" },
                                   { name: "Advanced Search", link: "/" },
                                   { name: "About Us", link: "/" },
                                   { name: "Corporate Sales", link: "/" },
                                   { name: "Privacy", link: "/" },
                              ],
                              popularTags: [
                                   { name: "Cloths", link: "/" },
                                   { name: "Fashions", link: "/" },
                                   { name: "Hub", link: "/" },
                                   { name: "Shirt", link: "/" },
                                   { name: "Skirt", link: "/" },
                                   { name: "Sports", link: "/" },
                                   { name: "Sweater", link: "/" },
                              ],
                         },
                    },
               },
          },
          header: {
               name: "header",
               content: "",
               component: {
                    theme,
                    props: {
                         company: {},
                         static: {
                              languages: [],
                              currencies: [],
                              socials: [
                                   { name: "facebook", link: "/" },
                                   { name: "instagram", link: "/" },
                                   { name: "twitter", link: "/" },
                              ],
                              pageLinks: [
                                   {
                                        name: "home",
                                        url: "/",
                                        subMenu: null,
                                   },
                                   {
                                        name: "shop",
                                        url: "/tester",
                                        subMenu: [
                                             {
                                                  name: "tester",
                                                  url: "/shop/tester",
                                             },
                                        ],
                                   },
                              ],
                         },
                    },
               },
          },
          pages: [
               {
                    name: "home",
                    layout: "",
                    sections: [
                         {
                              name: "home",
                              content: "",
                              component: {
                                   theme,
                                   props: {
                                        static: {
                                             promotion: {
                                                  homePage: [],
                                             },
                                             banner: [
                                                  {
                                                       title: "",
                                                       text: "",
                                                       imageUrl:
                                                            "https://absa7kzimnaf.blob.core.windows.net/templates-images/banner/banner-fashion-1.jpg",
                                                  },
                                                  {
                                                       title: "",
                                                       text: "",
                                                       imageUrl:
                                                            "https://absa7kzimnaf.blob.core.windows.net/templates-images/banner/banner-fashion-2.jpg",
                                                  },
                                             ],
                                             dealsBanner: [
                                                  {
                                                       title: "",
                                                       text: "",
                                                       imageUrl:
                                                            "https://absa7kzimnaf.blob.core.windows.net/templates-images/demo1-product/banner/banner-8.jpg",
                                                       link: "/",
                                                  },
                                                  {
                                                       title: "",
                                                       text: "",
                                                       imageUrl:
                                                            "https://absa7kzimnaf.blob.core.windows.net/templates-images/demo1-product/banner/banner-7.jpg",
                                                       link: "/",
                                                  },
                                                  {
                                                       title: "",
                                                       text: "",
                                                       imageUrl:
                                                            "https://absa7kzimnaf.blob.core.windows.net/templates-images/demo1-product/banner/banner-6.jpg",
                                                       link: "/",
                                                  },
                                             ],
                                             featuredProtured: [],
                                        },
                                   },
                              },
                         },
                    ],
               },
          ],
          pageLinks: ["home", "shop"],
          styles: {
               colors: [],
               mode: "light",
               demoLink: "demo13",
          },
     };
};

exports.postOnboarding = async (req, res) => {
     const currentDate = new Date();
     const trialEndDate = currentDate.setDate(currentDate.getDate() + 14);
     const formattedDate = formatDate(new Date(currentDate));
     const formattedTrialEndDate = formatDate(new Date(trialEndDate));

     let date = formattedDate;
     let company_name = req.body.company_name;
     let company_type = req.body.company_type;
     let tenantname = req.body.domain;
     let theme = req.body.theme;
     let brandcolor = req.body.colors;
     let subscription = req.body.subscription;
     let subscribed = false;
     let trial_End_Date = formattedTrialEndDate;
     const { firstname, email, _id } = req.userData;
     const categories = req.body.categories;

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

          // HANDLE CREATE CATEOGIES
          const categoryIds = [];
          if (company_id)
               try {
                    for (const category of categories) {
                         const id = await odoo.execute_kw("product.public.category", "create", [
                              { name: category.name },
                         ]);
                         categoryIds.push(id);
                    }
               } catch (err) {
                    console.log("failed catgories", err);
               }

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
               subscribed: subscribed,
               account_opening_date: date,
               trial_end_date: trial_End_Date,
               country: req.body.country,
               city: req.body.city,
               state: req.body.state,
               categories: categoryIds || [],
          });

          let company_data = await save_company.save();

          try {
               const save_site = new Site(site(theme));
               const site_data = await save_site.save();
               await Company.findByIdAndUpdate(company_data?._id, {
                    $set: { site: site_data?._id },
               });
          } catch (err) {
               console.log("error creatting site", err);
          }

          // HANDLE CREATE PRODUCTS
          let params = {
               odoo,
               products: initProducts(company_id),
          };
          if (company_id)
               try {
                    await addMultipleProducts({ ...params });
               } catch (err) {
                    console.log("failed products", err);
               }

          sendOnboardingEmail(email, firstname);

          reminderJob.start();
          await User.findByIdAndUpdate(_id, {
               $set: { onboarded: true, company: company_data?._id },
          });

          res.status(201).json({ company: company_data, status: true });
     } catch (error) {
          console.log("err", error);
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

exports.getOnboarding = async (req, res) => {
     console.log("get onboarding api");
     let domain = req.params.domain;
     const company = await Company.find({ subdomain: domain });
     return res.status(201).json(company);
};

exports.verifyCompanyName = async (req, res) => {
     const { companyName } = req.body;

     try {
          // Check if company name already exists
          const existingCompany = await Company.findOne({ company_name: companyName });
          if (existingCompany) {
               return res
                    .status(409)
                    .json({ message: "Company name already exists.", status: false });
          }

          // Company name is unique
          res.status(200).json({ message: "Company name is unique.", status: true });
     } catch (error) {
          console.error("Error verifying company name uniqueness:", error);
          res.status(500).json({ message: "Internal server error.", status: false });
     }
};

exports.verifyDomainName = async (req, res) => {
     const { domainName } = req.body;

     try {
          // Check if company name already exists
          const existingCompany = await Company.findOne({ subdomain: domainName });
          if (existingCompany) {
               return res
                    .status(409)
                    .json({ message: "Domain name already exists.", status: false });
          }

          // Company name is unique
          res.status(200).json({ message: "Domain name is unique.", status: true });
     } catch (error) {
          console.error("Error verifying Domain name uniqueness:", error);
          res.status(500).json({ message: "Internal server error.", status: false });
     }
};
