const Odoo = require("../../config/odoo.connection");
const Company = require("../../model/Company");

const {
     addProduct,
     getFeaturedProducts,
     getProductDetails,
     addMultipleProducts,
     getProductById,
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

               const products = await Odoo.execute_kw(
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

               const products = await Odoo.execute_kw(
                    "product.public.category",
                    "search_read",
                    [[["name", "=", category]]],
                    { fields: ["name", "public_categ_ids"] },
               );

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

     const products = await getFeaturedProducts(params);
     res.status(201).json({ products });
};

exports.filterProducts = async (req, res) => {
     const category = req.body.category_id;
     const offset = 5;
     const page = 0;

     try {
          await Odoo.connect();

          if (category === null) {
               let products = await Odoo.execute_kw("product.product", "search_read", [
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
               let products = await Odoo.execute_kw("product.product", "search_read", [
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
     res.status(201).json({ details });
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

exports.createProduct = async (req, res) => {
     // let user = req.userData;
     try {
          let params = {
               odoo: Odoo,
               product: { ...req.body, images: req.files },
               // user: user
          };

          const product = await addProduct({ ...params });

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

          const products = await addMultipleProducts({ ...params });

          res.status(201).json({ products, status: true });
     } catch (err) {
          res.status(400).json({ err, status: false });
     }
};
