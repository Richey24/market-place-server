const User = require("../../model/User");
const Company = require("../../model/Company");
const Site = require("../../model/Site");
var Odoo = require("async-odoo-xmlrpc");
const { formatDate, sendOnboardingEmail, reminderJob } = require("../../config/helpers");
const { initProducts } = require("../../utils/initProducts");
const { addMultipleProducts } = require("../../services/product.service");
const companyService = require("../../services/company.service");
const bannerImages = require("../../utils/bannerImages");
const midBannerCOnfig = require("../../utils/midBannerConfiq");
const midBannerConfig = require("../../utils/midBannerConfiq");

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

const site = (theme, services) => {
     return theme.type === "service"
          ? {
               theme: theme?.name,
               topAds: {
                    name: "topAds",
                    content: "",
                    component: {
                         theme: theme?.name,
                         name: "",
                         props: {
                              static: {
                                   show: true,
                                   title: "Get Up to40% OFF New-Season Styles",
                                   categories: ["men", "woman"],
                                   additionalText: "Limited time only",
                              },
                         },
                    },
               },
               footer: {
                    name: "footer",
                    content: "",
                    component: {
                         theme: theme?.name,
                         name: "",
                         props: {
                              static: {
                                   description:
                                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consectetur auctor elit.",
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
                                   businessHours: [
                                        "Monday - Friday 9am to 5pm",
                                        "Saturday - 9am to 2pm",
                                        "Sunday - Closed",
                                   ],
                              },
                         },
                    },
               },
               header: {
                    name: "header",
                    content: "",
                    component: {
                         theme: theme?.name,
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
                                        theme: theme?.name,
                                        props: {
                                             static: {
                                                  brochures:
                                                       "View our 2020 financial prospectus brochure for an easy to read guide on all of the services offer.",

                                                  serviceDetails: {
                                                       label: "Home - Service Details.",
                                                       image: "https://absa7kzimnaf.blob.core.windows.net/templates-images/service/hand.jpg",
                                                       subImage:
                                                            "https://absa7kzimnaf.blob.core.windows.net/templates-images/service/workers.jpg",
                                                       title: "International Business Opportunities.",
                                                       description:
                                                            "There are many variations of passages of Lorem Ipsum available, but the majority have suffered altera tion in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t anything embarrassing hidden. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.",
                                                       list: [
                                                            {
                                                                 title: "Seed do eiusmod tempor incididunt ut",
                                                            },
                                                            {
                                                                 title: "Exercitation ullamco laboris nis.",
                                                            },
                                                            {
                                                                 title: "Quis nostrud exerc citation.",
                                                            },
                                                            {
                                                                 title: "Andomised words which don't look",
                                                            },
                                                            {
                                                                 title: "Commodo consequat duis autex.",
                                                            },
                                                            {
                                                                 title: "Andomised words which don't look",
                                                            },
                                                            {
                                                                 title: "Andomised words which don't look",
                                                            },
                                                       ],
                                                  },
                                                  services,
                                                  howItWorks: {
                                                       description:
                                                            "Security companies are working all around the world to protect homes, offices and other buildings. Many security companies are using slogans and taglines to distinguish themselves from their competitors and to tell the public why they are the best and why they should hire them for their security. Thinking a slogan or tagline for a security company can be very hard. In this post, we have gathered",
                                                       list: [
                                                            {
                                                                 title: "Wait! What is VPN Service?",
                                                                 description:
                                                                      "Security companies are working all around the world to protect homes, offices and other buildings. Many security companies are using slogans and taglines to distinguish themselves from their competitors and to tell the public why they are the best & why they should hire them for their security Thinking a slogan or tagline for a security company can be very hard. In this post, we have gathered",
                                                            },

                                                            {
                                                                 title: "Why you need security service before start a new business?",
                                                                 description:
                                                                      "Security companies are working all around the world to protect homes, offices and other buildings. Many security companies are using slogans and taglines to distinguish themselves from their competitors and to tell the public why they are the best & why they should hire them for their security Thinking a slogan or tagline for a security company can be very hard. In this post, we have gathered",
                                                            },
                                                            {
                                                                 title: "How to be more benighted on business now-a-days?",
                                                                 description:
                                                                      "Security companies are working all around the world to protect homes, offices and other buildings. Many security companies are using slogans and taglines to distinguish themselves from their competitors and to tell the public why they are the best & why they should hire them for their security Thinking a slogan or tagline for a security company can be very hard. In this post, we have gathered",
                                                            },
                                                            {
                                                                 title: "Our business is protecting yours?",
                                                                 description:
                                                                      "Security companies are working all around the world to protect homes, offices and other buildings. Many security companies are using slogans and taglines to distinguish themselves from their competitors and to tell the public why they are the best & why they should hire them for their security Thinking a slogan or tagline for a security company can be very hard. In this post, we have gathered",
                                                            },
                                                       ],
                                                  },
                                                  midList: {
                                                       title: "Gigabit Service, Fastest Always",
                                                       list: [
                                                            {
                                                                 title: "The result of employees, over detailers and engineers",
                                                            },
                                                            {
                                                                 title: "All coming together to solve problem before.",
                                                            },
                                                            {
                                                                 title: "Teamwork it demonstrates both internally and externally",
                                                            },
                                                            {
                                                                 title: "Outstanding in the creation of landmark buildings",
                                                            },
                                                            {
                                                                 title: "The result of employees, over detailers and engineers",
                                                            },
                                                       ],
                                                  },
                                                  midSection: {
                                                       audit: {
                                                            description:
                                                                 "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet",
                                                       },
                                                       strategy: {
                                                            image: "https://absa7kzimnaf.blob.core.windows.net/templates-images/service/female.jpg",
                                                            title: "International Business Opportunities.",
                                                            description:
                                                                 "Adipisicing elit, sed do eiusmod tempor incididunt ul labore et dolore magna aliqua",
                                                            list: [
                                                                 {
                                                                      title: "research beyond the business plan",
                                                                 },
                                                                 {
                                                                      title: "marketing options and rates.",
                                                                 },
                                                                 {
                                                                      title: "the ability to turnaround consulting.",
                                                                 },
                                                            ],
                                                       },
                                                       sustainability: {
                                                            title: "Project Results.",
                                                            image: "https://absa7kzimnaf.blob.core.windows.net/templates-images/service/graph.png",
                                                            description:
                                                                 "There are many variations of passages of Lorem ipsum available, but the majority have suffered altera tion in some form, by injected, Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. eu fugiat nulla pariatur. Enim minim veniam quis nostrud. exercitation ullamco laboris nisi aliquip",
                                                       },
                                                  },
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
               shipping: {
                    free: {
                         condition: {
                              target: "quantity",
                              count: 50,
                         },
                         enabled: true,
                    },
               },
          }
          : {
               theme: theme?.name,
               topAds: {
                    name: "topAds",
                    content: "",
                    component: {
                         theme: theme?.name,
                         name: "",
                         props: {
                              static: {
                                   show: true,
                                   title: "Get Up to40% OFF New-Season Styles",
                                   categories: ["men", "woman"],
                                   additionalText: "Limited time only",
                              },
                         },
                    },
               },
               footer: {
                    name: "footer",
                    content: "",
                    component: {
                         theme: theme?.name,
                         name: "",
                         props: {
                              static: {
                                   description:
                                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consectetur auctor elit.",
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
                                   businessHours: [
                                        "Monday - Friday 9am to 5pm",
                                        "Saturday - 9am to 2pm",
                                        "Sunday - Closed",
                                   ],
                              },
                         },
                    },
               },
               header: {
                    name: "header",
                    content: "",
                    component: {
                         theme: theme?.name,
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
                                        theme: theme?.name,
                                        props: {
                                             static: {
                                                  brochures:
                                                       "View our 2020 financial prospectus brochure for an easy to read guide on all of the services offer.",
                                                  promotion: {
                                                       enabled: true,
                                                       promotion: {},
                                                  },
                                                  guarantee: {
                                                       shipping: "",
                                                       money: "",
                                                       support: "",
                                                  },
                                                  serviceDetails: {
                                                       label: "Home - Service Details.",
                                                       image: "https://absa7kzimnaf.blob.core.windows.net/templates-images/service/hand.jpg",
                                                       subImage:
                                                            "https://absa7kzimnaf.blob.core.windows.net/templates-images/service/workers.jpg",
                                                       title: "International Business Opportunities.",
                                                       description:
                                                            "There are many variations of passages of Lorem Ipsum available, but the majority have suffered altera tion in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t anything embarrassing hidden. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.",
                                                       list: [
                                                            {
                                                                 title: "Seed do eiusmod tempor incididunt ut",
                                                            },
                                                            {
                                                                 title: "Exercitation ullamco laboris nis.",
                                                            },
                                                            {
                                                                 title: "Quis nostrud exerc citation.",
                                                            },
                                                            {
                                                                 title: "Andomised words which don't look",
                                                            },
                                                            {
                                                                 title: "Commodo consequat duis autex.",
                                                            },
                                                            {
                                                                 title: "Andomised words which don't look",
                                                            },
                                                            {
                                                                 title: "Andomised words which don't look",
                                                            },
                                                       ],
                                                  },
                                                  categories: [
                                                       {
                                                            title: "Finance Management",
                                                       },
                                                       {
                                                            title: "Banking Investigation",
                                                       },
                                                       {
                                                            title: "Business Insurance",
                                                       },
                                                       {
                                                            title: "Car Insurance",
                                                       },
                                                       {
                                                            title: "Market Research",
                                                       },
                                                       {
                                                            title: "Home Insurance",
                                                       },
                                                       {
                                                            title: "Life Insurance",
                                                       },
                                                       {
                                                            title: "Health Insurance",
                                                       },
                                                  ],
                                                  midBanner: midBannerConfig?.[theme?.name] ?? "",
                                                  banner: [
                                                       {
                                                            title: "",
                                                            text: "",
                                                            imageUrl:
                                                                 bannerImages?.[theme?.name]
                                                                      ?.banner1,
                                                            link: "/",
                                                       },
                                                       {
                                                            title: "",
                                                            text: "",
                                                            imageUrl:
                                                                 bannerImages?.[theme?.name]
                                                                      ?.banner2,
                                                            link: "/",
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
                                             },
                                        },
                                   },
                              },
                         ],
                    },
                    {
                         name: "about_us",
                         layout: "",
                         sections: [
                              {
                                   name: "about_us",
                                   content: "",
                                   component: {
                                        theme: theme?.name,
                                        props: {
                                             static: {
                                                  history: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. posuere cubilia Curae; In eu libero ligula. Fusce eget metus lorem, ac viverra leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In eu libero ligula. Fusce eget metus lorem, ac viverra leo. desktop publishing software like Aldus PageMaker including versions. was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently",
                                                  team: [
                                                       {
                                                            name: "Victor",
                                                            role: "Engineer",
                                                            image_url: "",
                                                       },
                                                       {
                                                            name: "Ib",
                                                            role: "CEO",
                                                            image_url: "",
                                                       },
                                                  ],
                                             },
                                        },
                                   },
                              },
                         ],
                    },
                    {
                         name: "contact_us",
                         layout: "",
                         sections: [
                              {
                                   name: "contact_us",
                                   content: "",
                                   component: {
                                        theme: theme?.name,
                                        props: {
                                             static: {
                                                  contact_email: "example@gmail.com",
                                                  getInTouch:
                                                       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget leo at velit imperdiet varius. In eu ipsum vitae velit congue iaculis vitae at risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                                  businessHours: [
                                                       "Monday - Friday 9am to 5pm",
                                                       "Saturday - 9am to 2pm",
                                                       "Sunday - Closed",
                                                  ],
                                                  faq: [
                                                       {
                                                            title: "this is just a test",
                                                            description:
                                                                 "this is just a text descriptions",
                                                       },
                                                       {
                                                            title: "this is just a test",
                                                            description:
                                                                 "this is just a text descriptions",
                                                       },
                                                       {
                                                            title: "this is just a test",
                                                            description:
                                                                 "this is just a text descriptions",
                                                       },
                                                  ],
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
               shipping: {
                    free: {
                         condition: {
                              target: "quantity",
                              count: 50,
                         },
                         enabled: true,
                    },
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
     const categ_ids = req.body.categ_ids;
     const type = req?.body?.type;

     try {
          var odoo = new Odoo({
               url: process.env.ODOO_URI,
               port: process.env.ODOO_PORT,
               db: process.env.ODOO_DB,
               username: process.env.ODOO_USERNAME,
               password: process.env.ODOO_PASSWORD,
          });

          await odoo.connect();
          console.log("Connected to Odoo XML-RPC", type);

          if (type !== "service") {
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
               // const categoryIds = [];
               // if (company_id)
               //      try {
               //           for (const category of categories) {
               //                const id = await odoo.execute_kw(
               //                     "product.public.category",
               //                     "create",
               //                     [{ name: category.name }],
               //                );
               //                categoryIds.push(id);
               //           }
               //      } catch (err) {
               //           console.log("failed catgories", err);
               //      }

               const save_company = new Company({
                    user_id: _id,
                    company_id: company_id,
                    company_name: company_name,
                    company_type: company_type,
                    subdomain: tenantname,
                    theme: theme?.name,
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
                    categories: categ_ids || [],
                    type,
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

               // reminderJob.start();
               await User.findByIdAndUpdate(_id, {
                    $set: { onboarded: true, company: company_data?._id },
               });

               res.status(201).json({ company: company_data, status: true });
          } else {
               const save_company = new Company({
                    user_id: _id,
                    company_id: null,
                    company_name: company_name,
                    company_type: company_type,
                    subdomain: tenantname,
                    theme: theme?.name,
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
                    categories: null,
                    type,
                    serviceType: req?.body?.categories,
               });

               let company_data = await save_company.save();

               try {
                    console.log("services,", req.body.services);
                    const save_site = new Site(site(theme, req.body.services));
                    const site_data = await save_site.save();
                    await Company.findByIdAndUpdate(company_data?._id, {
                         $set: { site: site_data?._id },
                    });
               } catch (err) {
                    throw ("error creatting site", err);
               }

               sendOnboardingEmail(email, firstname, req.body.type);
               // reminderJob.start();
               await User.findByIdAndUpdate(_id, {
                    $set: { onboarded: true, company: company_data?._id },
               });
               res.status(201).json({ company: company_data, status: true });
          }
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
