var Odoo = require("async-odoo-xmlrpc");
const Company = require("../../model/Company");
const { addProduct, getFeaturedProducts } = require("../../services/product.service");

exports.getProducts = async (req, res) => {
     console.log("GET /api/products");
     var odoo = new Odoo({
          url: "http://104.43.252.217/",
          port: 80,
          db: "bitnami_odoo",
          username: "user@example.com",
          password: "850g6dHsX1TQ",
     });

     try {
          await odoo.connect();
          console.log("Connect to Odoo XML-RPC - api/products");

          let products = await odoo.execute_kw(
               "product.template",
               "search_read",
               [[["type", "=", "consu"]]],
               { fields: ["name", "public_categ_ids"] },
          );
          res.status(201).json({ products });
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

/**
 * This function will get featured products for the landing page
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getFeaturedProducts = async (req, res) => {
     console.log("GET  api/products/featured");

     let user = req.userData;
     let company_id = 1;

     var odoo = new Odoo({
          url: "http://104.43.252.217/",
          port: 80,
          db: "bitnami_odoo",
          username: "user@example.com",
          password: "850g6dHsX1TQ",
     });

     let params = {
          odoo: odoo,
          promo: req.body,
          user: user,
     };

     const products = await getFeaturedProducts(params);
     res.status(201).json({ products });
};

exports.filterProducts = async (req, res) => {
     var odoo = new Odoo({
          url: "http://104.43.252.217/",
          port: 80,
          db: "bitnami_odoo",
          username: "user@example.com",
          password: "850g6dHsX1TQ",
     });

     const category = req.body.category_id;
     const offset = 5;
     const page = 0;

     try {
          await odoo.connect();

          if (category === null) {
               let products = await odoo.execute_kw("product.product", "search_read", [
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
               res.status(201).json({ products });
          } else {
               let products = await odoo.execute_kw("product.product", "search_read", [
                    [
                         ["type", "=", "consu"],
                         ["public_categ_ids", "=", Number(category)],
                    ],
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

               res.status(201).json({ products });
          }
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

exports.productDetails = async (req, res) => {
     console.log(" GET /api/details");

     const productId = req.params.id;

     try {
          await odoo.connect();

          console.log("Connect to odoo XML-RPC is successed.");

          let id = await odoo.execute_kw("product.template", "search", [[["id", "=", productId]]]);

          let products = await odoo.execute_kw("product.template", "read", [id]);
          res.status(201).json(products);
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

exports.wishlistProduct = async (req, res) => {
     console.log(" GET /api/details");

     const productId = req.params.id;

     try {
          await odoo.connect();

          console.log("Connect to odoo XML-RPC is successed.");

          let id = await odoo.execute_kw("product.template", "search", [[["id", "=", productId]]]);

          let products = await odoo.execute_kw("product.wishlist", "read", [id]);
          res.status(201).json(products);
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

exports.createProduct = async (req, res) => {
     let user = req.userData;
     try {
          var odoo = new Odoo({
               url: "http://104.43.252.217/",
               port: 80,
               db: "bitnami_odoo",
               username: "user@example.com",
               password: "850g6dHsX1TQ",
          });

          let params = {
               odoo: odoo,
               product: req.body,
               // user: user
          };

          const product = await addProduct({ ...params, user });
          console.log(product);
          res.status(201).json({ product });
     } catch (err) {
          res.status(400).json({ err });
     }
};
