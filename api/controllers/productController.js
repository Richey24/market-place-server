const Odoo = require("../../config/odoo.connection");
const Company = require("../../model/Company");
const User = require("../../model/User");

const {
     addProduct,
     getFeaturedProducts,
     getProductDetails,
     addMultipleProducts,
     getProductById,
     updateProduct,
     searchProducts,
} = require("../../services/product.service");
const { initProducts } = require("../../utils/initProducts");

exports.getProductbyCompanyId = async (req, res) => {
     console.log("GET /api/products");

     try {
          const companyId = [+req.params.companyId];
          console.log("companyId", companyId);
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
                    ],
                    { fields: ["name", "public_categ_ids"] },
               );
               const products = theProducts.map((product) => {
                    return (
                         product.id,
                         product.website_url,
                         product.name,
                         product.description,
                         product.categ_id,
                         product.list_price,
                         product.standard_price,
                         product.company_id,
                         product.display_name,
                         product.base_unit_count,
                         product.x_subcategory,
                         product.x_size,
                         product.x_weight,
                         product.x_color,
                         product.x_dimension
                    )
               })
               res.status(200).json({ products, status: true });
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
          const category = req.params.category;
          console.log("category", category);
          if (req.params.category) {
               await Odoo.connect();
               console.log("Connect to Odoo XML-RPC - api/products");

               const theProducts = await Odoo.execute_kw(
                    "product.public.category",
                    "search_read",
                    [[["name", "=", category]]],
                    { fields: ["name", "public_categ_ids"] },
               );
               const products = theProducts.map((product) => {
                    return (
                         product.id,
                         product.website_url,
                         product.name,
                         product.description,
                         product.categ_id,
                         product.list_price,
                         product.standard_price,
                         product.company_id,
                         product.display_name,
                         product.base_unit_count,
                         product.x_subcategory,
                         product.x_size,
                         product.x_weight,
                         product.x_color,
                         product.x_dimension
                    )
               })
               res.status(200).json({ products, status: true });
          } else {
               res.status(404).json({ error: "Invalid Category", status: false });
          }
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
     };

     const theProducts = await getFeaturedProducts(params);
     const products = theProducts.map((product) => {
          return (
               product.id,
               product.website_url,
               product.name,
               product.description,
               product.categ_id,
               product.list_price,
               product.standard_price,
               product.company_id,
               product.display_name,
               product.base_unit_count,
               product.x_subcategory,
               product.x_size,
               product.x_weight,
               product.x_color,
               product.x_dimension
          )
     })
     res.status(201).json({ products });
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
                         "rating_avg",
                         "rating_count",
                         "website_url",
                         "public_categ_ids",
                         "website_meta_keywords",
                    ], // Fields
                    0,
                    5, // Offset, Limit
               ]);
               const products = theProducts.map((product) => {
                    return (
                         product.id,
                         product.website_url,
                         product.name,
                         product.description,
                         product.categ_id,
                         product.list_price,
                         product.standard_price,
                         product.company_id,
                         product.display_name,
                         product.base_unit_count,
                         product.x_subcategory,
                         product.x_size,
                         product.x_weight,
                         product.x_color,
                         product.x_dimension
                    )
               })
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
                         "rating_avg",
                         "rating_count",
                         "website_url",
                         "public_categ_ids",
                         "website_meta_keywords",
                    ], // Fields
                    0,
                    5, // Offset, Limit
               ]);
               const products = theProducts.map((product) => {
                    return (
                         product.id,
                         product.website_url,
                         product.name,
                         product.description,
                         product.categ_id,
                         product.list_price,
                         product.standard_price,
                         product.company_id,
                         product.display_name,
                         product.base_unit_count,
                         product.x_subcategory,
                         product.x_size,
                         product.x_weight,
                         product.x_color,
                         product.x_dimension
                    )
               })
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
          return (
               product.id,
               product.website_url,
               product.name,
               product.description,
               product.categ_id,
               product.list_price,
               product.standard_price,
               product.company_id,
               product.display_name,
               product.base_unit_count,
               product.x_subcategory,
               product.x_size,
               product.x_weight,
               product.x_color,
               product.x_dimension
          )
     })
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
          let user = await User.findById(req.body.userId);
          if (user) {
               const wishlistRecord = {
                    partner_id: user.partner_id,
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
          } else {
               throw "User Doesnt Exist";
          }
     } catch (error) {
          console.error("Error when trying to create wishlist record.", error);
          res.status(404).json({ error, status: false });
     }
};

exports.fetchWishlist = async (req, res) => {
     try {
          await Odoo.connect();
          console.log("Connected to Odoo XML-RPC - fetchWishlist");
          let user = await User.findById(req.params.userId);
          // Search for wishlist records based on the user ID
          if (user) {
               const wishlistRecords = await Odoo.execute_kw(
                    "product.wishlist",
                    "search_read",
                    [[["partner_id", "=", +user.partner_id]]],
                    { fields: ["user_id", "product_id"] },
               );

               console.log(
                    "Wishlist records for user",
                    +req.params.partnerId,
                    ":",
                    wishlistRecords,
               );
               res.status(200).json({ wishlist: wishlistRecords, status: true });
          } else {
               throw "User Doesnt Exist";
          }
     } catch (error) {
          console.error("Error when trying to fetch wishlist records.", error);
          res.status(404).json({ error, status: false });
     }
};

exports.createProduct = async (req, res) => {
     // let user = req.userData;
     try {
          let params = {
               odoo: Odoo,
               product: { ...req.body, images: req.files },
               // user: user
          };

          const theProduct = await addProduct({ ...params });
          const product = theProduct.map((product) => {
               return (
                    product.id,
                    product.website_url,
                    product.name,
                    product.description,
                    product.categ_id,
                    product.list_price,
                    product.standard_price,
                    product.company_id,
                    product.display_name,
                    product.base_unit_count,
                    product.x_subcategory,
                    product.x_size,
                    product.x_weight,
                    product.x_color,
                    product.x_dimension
               )
          })
          res.status(201).json({ product: product, status: true });
     } catch (err) {
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
               return (
                    product.id,
                    product.website_url,
                    product.name,
                    product.description,
                    product.categ_id,
                    product.list_price,
                    product.standard_price,
                    product.company_id,
                    product.display_name,
                    product.base_unit_count,
                    product.x_subcategory,
                    product.x_size,
                    product.x_weight,
                    product.x_color,
                    product.x_dimension
               )
          })
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
               return (
                    product.id,
                    product.website_url,
                    product.name,
                    product.description,
                    product.categ_id,
                    product.list_price,
                    product.standard_price,
                    product.company_id,
                    product.display_name,
                    product.base_unit_count,
                    product.x_subcategory,
                    product.x_size,
                    product.x_weight,
                    product.x_color,
                    product.x_dimension
               )
          })
          res.status(201).json({ products, status: true });
     } catch (err) {
          res.status(400).json({ err, status: false });
     }
};


exports.searchProduct = async (req, res) => {
     try {
          const body = req.body
          console.log(body);
          const keys = Object.keys(body)
          const arr = []
          keys.forEach((key) => {
               arr.push([key, "=", body[key]])
          })
          console.log(arr);
          const theProducts = await searchProducts(arr)
          const products = theProducts.map((product) => {
               return (
                    product.id,
                    product.website_url,
                    product.name,
                    product.description,
                    product.categ_id,
                    product.list_price,
                    product.standard_price,
                    product.company_id,
                    product.display_name,
                    product.base_unit_count,
                    product.x_subcategory,
                    product.x_size,
                    product.x_weight,
                    product.x_color,
                    product.x_dimension
               )
          })
          res.status(200).json({ products, status: true });
     } catch (err) {
          res.status(400).json({ err, status: false });
     }
}
exports.getBestSellingProducts = async (req, res) => {
     console.log("GET /api/best-selling-products");

     try {
          await Odoo.connect();
          console.log("Connected to Odoo XML-RPC - getBestSellingProducts");
          const companyId = [+req.params.companyId];

          // Fetch best-selling products based on your criteria (e.g., sales count)
          const theProducts = await Odoo.execute_kw("product.product", "search_read", [
               [["company_id", "=", companyId]],
               { limit: 3 },
          ]);
          const products = theProducts.map((product) => {
               return (
                    product.id,
                    product.website_url,
                    product.name,
                    product.description,
                    product.categ_id,
                    product.list_price,
                    product.standard_price,
                    product.company_id,
                    product.display_name,
                    product.base_unit_count,
                    product.x_subcategory,
                    product.x_size,
                    product.x_weight,
                    product.x_color,
                    product.x_dimension
               )
          })
          res.status(200).json({ bestSellingProducts: products, status: true });
     } catch (error) {
          console.error("Error when trying to fetch best-selling products.", error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};
