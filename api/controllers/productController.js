const { sendRatingMail } = require("../../config/helpers");
const Odoo = require("../../config/odoo.connection");
const Company = require("../../model/Company");
const Rating = require("../../model/Rating");
const algoliasearch = require("algoliasearch");
const User = require("../../model/User");

const {
     addProduct,
     getFeaturedProducts,
     getProductDetails,
     addMultipleProducts,
     getProductById,
     updateProduct,
     searchProducts,
     rateProduct,
} = require("../../services/product.service");
const { initProducts } = require("../../utils/initProducts");

exports.getProductbyCompanyId = async (req, res) => {
     console.log("GET /api/products");

     try {
          const companyId = [+req.params.companyId];
          if (req.params.companyId) {
               await Odoo.connect();
               console.log("Connect to Odoo XML-RPC - api/products");

               const theProducts = await Odoo.execute_kw(
                    "product.template",
                    "search_read",
                    [
                         [
                              ["type", "=", "consu"],
                              ["company_id", "=", companyId],
                         ],
                         [
                              "id",
                              "public_categ_ids",
                              "name",
                              "display_name",
                              "list_price",
                              // "image_1920",
                              "standard_price",
                              "categ_id",
                              "rating_avg",
                              "rating_count",
                              "x_color",
                              "x_dimension",
                              "x_size",
                              "x_subcategory",
                              "x_weight",
                              "x_rating",
                              "website_url",
                              "website_meta_keywords",
                         ],
                         // null,
                         0,
                         10,
                    ],
                    { fields: ["name", "public_categ_ids"] },
               );

               res.status(200).json({ products: theProducts, status: true });
          } else {
               res.status(404).json({ error: "Invalid Company Id", status: false });
          }
     } catch (error) {
          console.error("Error when trying to connect to Odoo XML-RPC.", error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.getProductbyCategory = async (req, res) => {
     console.log("GET /api/products");

     try {
          const categoryId = +req.params.categoryId;
          const companyId = [+req.params.companyId];

          if (!req.params.category) {
               await Odoo.connect();
               console.log("Connect to Odoo XML-RPC - api/products");

               const theProducts = await Odoo.execute_kw("product.template", "search_read", [
                    [
                         ["public_categ_ids", "=", categoryId], // Replace "categ_id" with the actual field name for the category
                         ["type", "=", "consu"],
                         ["company_id", "=", companyId], // If you want to filter by company
                    ],
                    [
                         "id",
                         "public_categ_ids",
                         "name",
                         "display_name",
                         "list_price",
                         // "image_1920",
                         "standard_price",
                         "categ_id",
                         "rating_avg",
                         "rating_count",
                         "x_color",
                         "x_dimension",
                         "x_size",
                         "x_subcategory",
                         "x_weight",
                         "x_rating",
                         "website_url",
                         "website_meta_keywords",
                    ],
               ]);

               res.status(200).json({ products: theProducts, status: true });
          } else {
               res.status(404).json({ error: "Invalid Category", status: false });
          }
     } catch (error) {
          console.error("Error when trying to connect to Odoo XML-RPC.", error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.getProductImage = async (req, res) => {
     console.log("GET /api/products");

     try {
          const productId = +req.params.productId;

          await Odoo.connect();
          console.log("Connect to Odoo XML-RPC - api/products");

          const theProducts = await Odoo.execute_kw("product.template", "search_read", [
               [
                    ["id", "=", productId], // If you want to filter by company
               ],
               ["image_1920", "image_1024"],
          ]);

          res.status(200).json({ image: theProducts?.[0], status: true });
     } catch (error) {
          console.error("Error when trying to connect to Odoo XML-RPC.", error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.getFeaturedProducts = async (req, res) => {
     console.log("GET  api/products/featured");
     const company_id = [+req.params.companyId];

     let user = req.userData;

     let params = {
          promo: req.body,
          user: user,
          company_id,
          page: req.query.page
     };

     const theProducts = await getFeaturedProducts(params);
     const productsLength = await Odoo.execute_kw("product.product", "search_read", [
          [
               ["product_tag_ids.name", "=", "Featured Product"],
               ["company_id", "=", params.company_id],
          ],
          [
               "id"
          ]
     ]);
     const products = theProducts.map((product) => {
          return {
               id: product.id,
               website_url: product.website_url,
               name: product.name,
               description: product.description,
               categ_id: product.categ_id,
               list_price: product.list_price,
               standard_price: product.standard_price,
               company_id: product.company_id,
               display_name: product.display_name,
               base_unit_count: product.base_unit_count,
               image_1920: product.image_1920,
               image_1024: product.image_1024,
               x_rating: product.x_rating,
               create_date: product.create_date,
               x_subcategory: product.x_subcategory,
               x_size: product.x_size,
               x_weight: product.x_weight,
               x_color: product.x_color,
               x_dimension: product.x_dimension,
          };
     });
     res.status(201).json({ products, count: productsLength.length });
};

exports.filterProducts = async (req, res) => {
     const category = req.body.category_id;
     const offset = 5;
     const page = 0;

     try {
          await Odoo.connect();

          if (category === null) {
               let theProducts = await Odoo.execute_kw("product.product", "search_read", [
                    [["type", "=", "consu"]],
                    [
                         "name",
                         "list_price",
                         "image_512",
                         "categ_id",
                         "x_rating",
                         "rating_count",
                         "x_color",
                         "x_dimension",
                         "x_size",
                         "x_subcategory",
                         "x_weight",
                         "x_rating",
                         "website_url",
                         "public_categ_ids",
                         "website_meta_keywords",
                    ],
                    0,
                    5, // Offset, Limit
               ]);
               const products = theProducts.map((product) => {
                    return {
                         id: product.id,
                         website_url: product.website_url,
                         name: product.name,
                         description: product.description,
                         categ_id: product.categ_id,
                         list_price: product.list_price,
                         standard_price: product.standard_price,
                         company_id: product.company_id,
                         display_name: product.display_name,
                         base_unit_count: product.base_unit_count,
                         image_1920: product.image_1920,
                         image_1024: product.image_1024,
                         x_rating: product.x_rating,
                         create_date: product.create_date,
                         x_subcategory: product.x_subcategory,
                         x_size: product.x_size,
                         x_weight: product.x_weight,
                         x_color: product.x_color,
                         x_dimension: product.x_dimension,
                    };
               });
               res.status(201).json({ products });
          } else {
               let theProducts = await Odoo.execute_kw("product.product", "search_read", [
                    [["type", "=", "consu"]],
                    // [['type', '=', 'consu'], ['public_categ_ids', '=', Number(category)]]
                    [
                         "name",
                         "list_price",
                         "image_512",
                         "categ_id",
                         "x_color",
                         "x_dimension",
                         "x_size",
                         "x_subcategory",
                         "x_weight",
                         "x_rating",
                         "rating_count",
                         "website_url",
                         "public_categ_ids",
                         "website_meta_keywords",
                    ], // Fields
                    0,
                    5, // Offset, Limit
               ]);
               const products = theProducts.map((product) => {
                    return {
                         id: product.id,
                         website_url: product.website_url,
                         name: product.name,
                         description: product.description,
                         categ_id: product.categ_id,
                         list_price: product.list_price,
                         standard_price: product.standard_price,
                         company_id: product.company_id,
                         display_name: product.display_name,
                         base_unit_count: product.base_unit_count,
                         image_1920: product.image_1920,
                         image_1024: product.image_1024,
                         x_rating: product.x_rating,
                         create_date: product.create_date,
                         x_subcategory: product.x_subcategory,
                         x_size: product.x_size,
                         x_weight: product.x_weight,
                         x_color: product.x_color,
                         x_dimension: product.x_dimension,
                    };
               });
               res.status(201).json(products);
          }
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

exports.productDetails = async (req, res) => {
     const productId = req.params.id;

     const details = await getProductById(productId);
     // console.log("product", details);
     const product = details.map((product) => {
          return {
               id: product.id,
               website_url: product.website_url,
               name: product.name,
               description: product.description,
               categ_id: product.categ_id,
               list_price: product.list_price,
               standard_price: product.standard_price,
               company_id: product.company_id,
               display_name: product.display_name,
               base_unit_count: product.base_unit_count,
               image_1920: product.image_1920,
               image_1024: product.image_1024,
               x_rating: product.x_rating,
               create_date: product.create_date,
               x_subcategory: product.x_subcategory,
               x_size: product.x_size,
               x_weight: product.x_weight,
               x_color: product.x_color,
               x_dimension: product.x_dimension,
          };
     });
     res.status(201).json({ product });
};

exports.wishlistProduct = async (req, res) => {
     console.log(" GET /api/details");

     const productId = req.params.id;

     try {
          await Odoo.connect();

          let id = await Odoo.execute_kw("product.template", "search", [[["id", "=", productId]]]);

          let products = await Odoo.execute_kw("product.wishlist", "read", [id]);
          res.status(201).json(products);

          // let products = await odoo.execute_kw("product.wishlist", "read", [id]);
          // res.status(201).json(products);
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

exports.createWishlistRecord = async (req, res) => {
     try {
          await Odoo.connect();
          console.log("Connected to Odoo XML-RPC - createWishlistRecord", req.body);

          const wishlistRecord = {
               partner_id: req.body.partner_id,
               product_id: req.body.productId,
               website_id: 1,
               price: req.body.price,
               display_name: req.body.display_name,
          };

          // Create a new record in the wishlist model
          const createdWishlistRecord = await Odoo.execute_kw("product.wishlist", "create", [
               wishlistRecord,
          ]);

          console.log("Wishlist record created:", createdWishlistRecord);
          res.status(200).json({ wishlist: createdWishlistRecord, status: true });
     } catch (error) {
          console.error("Error when trying to create wishlist record.", error);
          res.status(404).json({ error, status: false });
     }
};

exports.fetchWishlist = async (req, res) => {
     try {
          await Odoo.connect();
          console.log("Connected to Odoo XML-RPC - fetchWishlist");

          const wishlistRecords = await Odoo.execute_kw(
               "product.wishlist",
               "search_read",
               [[["partner_id", "=", +req.params.partner_id]]],
               { fields: ["user_id", "product_id"] },
          );

          console.log("Wishlist records for user", +req.params.partnerId, ":", wishlistRecords);
          res.status(200).json({ wishlist: wishlistRecords, status: true });
     } catch (error) {
          console.error("Error when trying to fetch wishlist records.", error);
          res.status(404).json({ error, status: false });
     }
};

exports.createProduct = async (req, res) => {
     // let user = req.userData;
     try {
          const client = algoliasearch("CM2FP8NI0T", "daeb45e2c3fb98833358aba5e0c962c6");
          const index = client.initIndex("market-product");
          let params = {
               odoo: Odoo,
               product: { ...req.body, images: req.files },
               // user: user
          };
          const productId = await addProduct({ ...params });
          index.search(params.product.name).then(async ({ hits }) => {
               if (hits.length < 1) {
                    await index.saveObject(req.body, {
                         autoGenerateObjectIDIfNotExist: true,
                    })
               }
          })
          res.status(201).json({ productId, status: true });
     } catch (err) {
          console.log("error", err);
          res.status(400).json({ err, status: false });
     }
};

exports.updateProduct = async (req, res) => {
     // let user = req.userData;
     // console.log("parasm", req.params);
     try {
          let params = {
               odoo: Odoo,
               product: { ...req.body, images: req.files },
               productId: req.params?.id,
          };

          const theProduct = await updateProduct({ ...params });
          const product = theProduct.map((product) => {
               return {
                    id: product.id,
                    website_url: product.website_url,
                    name: product.name,
                    description: product.description,
                    categ_id: product.categ_id,
                    list_price: product.list_price,
                    standard_price: product.standard_price,
                    company_id: product.company_id,
                    display_name: product.display_name,
                    base_unit_count: product.base_unit_count,
                    image_1920: product.image_1920,
                    image_1024: product.image_1024,
                    x_rating: product.x_rating,
                    create_date: product.create_date,
                    x_subcategory: product.x_subcategory,
                    x_size: product.x_size,
                    x_weight: product.x_weight,
                    x_color: product.x_color,
                    x_dimension: product.x_dimension,
               };
          });
          res.status(201).json({ product: product, status: true });
     } catch (err) {
          res.status(400).json({ err, status: false });
     }
};

exports.createMultipleProducts = async (req, res) => {
     try {
          let params = {
               odoo: Odoo,
               products: initProducts,
          };

          const theProducts = await addMultipleProducts({ ...params });
          const products = theProducts.map((product) => {
               return {
                    id: product.id,
                    website_url: product.website_url,
                    name: product.name,
                    description: product.description,
                    categ_id: product.categ_id,
                    list_price: product.list_price,
                    standard_price: product.standard_price,
                    company_id: product.company_id,
                    display_name: product.display_name,
                    base_unit_count: product.base_unit_count,
                    image_1920: product.image_1920,
                    image_1024: product.image_1024,
                    x_rating: product.x_rating,
                    create_date: product.create_date,
                    x_subcategory: product.x_subcategory,
                    x_size: product.x_size,
                    x_weight: product.x_weight,
                    x_color: product.x_color,
                    x_dimension: product.x_dimension,
               };
          });
          res.status(201).json({ products, status: true });
     } catch (err) {
          res.status(400).json({ err, status: false });
     }
};

exports.searchProduct = async (req, res) => {
     try {
          const body = req.body;
          const keys = Object.keys(body);
          const arr = [];
          keys.forEach((key) => {
               arr.push([key, "=", body[key]]);
          });
          const theProducts = await searchProducts(arr);
          const products = theProducts.map((product) => {
               return {
                    id: product.id,
                    website_url: product.website_url,
                    name: product.name,
                    description: product.description,
                    categ_id: product.categ_id,
                    list_price: product.list_price,
                    standard_price: product.standard_price,
                    company_id: product.company_id,
                    display_name: product.display_name,
                    base_unit_count: product.base_unit_count,
                    image_1920: product.image_1920,
                    image_1024: product.image_1024,
                    x_rating: product.x_rating,
                    create_date: product.create_date,
                    x_subcategory: product.x_subcategory,
                    x_size: product.x_size,
                    x_weight: product.x_weight,
                    x_color: product.x_color,
                    x_dimension: product.x_dimension,
               };
          });
          res.status(200).json({ products, status: true });
     } catch (err) {
          res.status(400).json({ err, status: false });
     }
};
exports.getBestSellingProducts = async (req, res) => {
     console.log("GET /api/best-selling-products");

     try {
          await Odoo.connect();
          console.log("Connected to Odoo XML-RPC - getBestSellingProducts");
          const companyId = [+req.params.companyId];

          // Fetch best-selling products based on your criteria (e.g., sales count)
          const theProducts = await Odoo.execute_kw("product.product", "search_read", [
               [
                    ["sale_ok", "=", true],
                    ["company_id", "=", companyId],
               ],

               [
                    "id",
                    "name",
                    "display_name",
                    "list_price",
                    // "image_1920",
                    "standard_price",
                    "categ_id",
                    "rating_avg",
                    "rating_count",
                    "x_color",
                    "x_dimension",
                    "x_size",
                    "x_subcategory",
                    "x_weight",
                    "x_rating",
                    "website_url",
                    "public_categ_ids",
                    "website_meta_keywords",
               ],
               // null,
               null,
               null,
          ]);
          res.status(200).json({
               products: theProducts
                    ?.sort((a, b) => b?.sales_count - a?.sales_count)
                    ?.filter((_, idx) => idx < 3),
               status: true,
          });
     } catch (error) {
          console.error("Error when trying to fetch best-selling products.", error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.sendRateMail = async (req, res) => {
     try {
          const { product, email, url, name } = req.body;
          if ((!product || !email || !url, !name)) {
               return res
                    .status(400)
                    .json({ message: "Send all required parameters", status: false });
          }
          sendRatingMail(email, name, url, product);
          res.status(200).json({ message: "Rating Mail Sent Successfully", status: true });
     } catch (error) {
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.rateProduct = async (req, res) => {
     try {
          const { productId, userId, title, name, detail, rating } = req.body;
          if (!productId || !title || !userId || !name || !rating) {
               return res
                    .status(400)
                    .json({ message: "Send all required parameters", status: false });
          }
          const user = await User.findById(userId);
          if (user.rated.includes(productId)) {
               return res
                    .status(400)
                    .json({ message: "User already rated this product", status: false });
          }
          const rateObj = {
               productId: productId,
               ratings: {
                    title: title,
                    name: name,
                    detail: detail,
                    rating: rating,
                    date: Date.now(),
               },
          };
          const rate = await Rating.findOne({ productId: productId });
          let theRate;
          if (rate) {
               theRate = await Rating.findOneAndUpdate(
                    { productId: productId },
                    { $push: { ratings: rateObj.ratings } },
                    { new: true },
               );
          } else {
               theRate = await Rating.create(rateObj);
          }
          const mapNum = theRate.ratings.map((ra) => ra.rating);
          const ratingAvg = mapNum.reduce((a, b) => Number(a) + Number(b)) / mapNum.length;
          await Odoo.connect();
          const result = await Odoo.execute_kw("product.template", "write", [
               [+productId],
               { x_rating: ratingAvg },
          ]);
          await Odoo.execute_kw("product.product", "write", [
               [+productId],
               { x_rating: ratingAvg },
          ]);
          await User.findByIdAndUpdate(userId, { $push: { rated: productId } });
          res.status(200).json({
               ratingAvg: ratingAvg,
               theRate,
               result,
               status: true,
               message: "Rated Successfully",
          });
     } catch (error) {
          res.status(500).json({ message: "Something went wrong, try again", status: false });
     }
};

exports.getProductRating = async (req, res) => {
     try {
          const productId = req.params.id;
          if (!productId) {
               return res
                    .status(400)
                    .json({ message: "Send all required parameters", status: false });
          }
          const rating = await Rating.findOne({ productId: productId });
          res.status(200).json({ rating, status: true });
     } catch (error) {
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.deleteProductRating = async (req, res) => {
     try {
          const productId = req.params.id;
          if (!productId) {
               return res
                    .status(400)
                    .json({ message: "Send all required parameters", status: false });
          }
          await Rating.findOneAndDelete({ productId: productId });
          res.status(200).json({ message: "deleted", status: true });
     } catch (error) {
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.getUnratedProducts = async (req, res) => {
     try {
          const userId = req.params.id;
          const user = await User.findById(userId);
          if (!user) {
               return res
                    .status(400)
                    .json({ message: "Send all required parameters", status: false });
          }
          const unratedProducts = user.order_products.filter(
               (order) => !user.rated.includes(order.id),
          );
          res.status(200).json({ unratedProducts, status: true });
     } catch (error) {
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.getAdsProduct = async (req, res) => {
     try {
          await Odoo.connect();
          console.log("Connect to Odoo XML-RPC - api/products");
          const theProducts = await Odoo.execute_kw("product.template", "search_read", [
               [["x_ads_num", "=", "1"]],
               [
                    "id",
                    "name",
                    "display_name",
                    "list_price",
                    // "image_1920",
                    "standard_price",
                    "categ_id",
                    "rating_avg",
                    "rating_count",
                    "x_color",
                    "x_dimension",
                    "x_size",
                    "x_subcategory",
                    "x_weight",
                    "x_rating",
                    "website_url",
                    "public_categ_ids",
                    "website_meta_keywords",
                    "x_ads_num",
               ],
          ]);
          const adsProduct = theProducts?.filter((pro) => pro.x_ads_num !== false);
          const notAdsProduct = theProducts?.filter((pro) => pro.x_ads_num === false);

          const finalArr = [...adsProduct, ...notAdsProduct];

          res.status(200).json({ finalArr, status: true });
     } catch (error) {
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};
