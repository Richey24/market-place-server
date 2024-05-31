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
     addProductVariant,
     deleteProduct,
} = require("../../services/product.service");
const { initProducts } = require("../../utils/initProducts");

exports.getProductbyCompanyId = async (req, res) => {
     console.log("GET /api/products");

     try {
          const companyId = [+req.params.companyId];
          const searchQuery = req.query.searchQuery;

          if (companyId) {
               await Odoo.connect();
               console.log("Connected to Odoo XML-RPC - api/products");

               // Define the search filter
               let searchFilter = [
                    ["type", "=", "consu"],
                    ["company_id", "=", companyId],
               ];

               if (searchQuery) {
                    searchFilter.push(["name", "ilike", searchQuery]);
               }

               const theProducts = await Odoo.execute_kw(
                    "product.template",
                    "search_read",
                    [
                         searchFilter,
                         [
                              "id",
                              "public_categ_ids",
                              "name",
                              "display_name",
                              "list_price",
                              // "image_1920",
                              "standard_price",
                              "description",
                              "base_unit_count",
                              "product_variant_id",
                              "categ_id",
                              "rating_avg",
                              "rating_count",
                              "x_color",
                              "x_dimension",
                              "x_size",
                              "x_subcategory",
                              "x_weight",
                              "x_rating",
                              "x_images",
                              "x_free_shipping",
                              "create_date",
                              "website_url",
                              "website_meta_keywords",
                              "x_shipping_package",
                              "x_discount",
                         ],
                         null,
                         0,
                         // 10,
                    ],
                    { fields: ["name", "public_categ_ids"] },
               );

               // console.log("theProducts", theProducts);

               const products = theProducts.map((product) => {
                    return {
                         ...product,
                         x_discount: product?.x_discount ? JSON.parse(product?.x_discount) : null,
                         x_images:
                              typeof product?.x_images === "string" && product?.x_images
                                   ? JSON?.parse(product?.x_images)
                                   : product?.x_images,
                    };
               });

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
          const categoryId = +req.params.categoryId;
          const companyId = [+req.params.companyId];

          if (!req.params.category) {
               await Odoo.connect();
               console.log("Connect to Odoo XML-RPC - api/products");

               const theProducts = await Odoo.execute_kw("product.template", "search_read", [
                    [
                         ["public_categ_ids", "=", categoryId],
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
                         "product_variant_id",
                         "standard_price",
                         "description",
                         "base_unit_count",
                         "categ_id",
                         "rating_avg",
                         "rating_count",
                         "x_color",
                         "x_dimension",
                         "x_size",
                         "x_images",
                         "x_subcategory",
                         "x_weight",
                         "x_rating",
                         "website_url",
                         "website_meta_keywords",
                         "x_shipping_package",
                         "x_discount",
                    ],
               ]);

               const products = theProducts.map((product) => {
                    return {
                         ...product,
                         x_images: JSON.parse(product.x_images),
                         x_discount: product?.x_discount ? JSON.parse(product?.x_discount) : null,
                    };
               });

               res.status(200).json({ products, status: true });
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
     try {
          console.log("GET  api/products/featured");
          const company_id = [+req.params.companyId];

          let user = req.userData;

          let params = {
               promo: req.body,
               user: user,
               company_id,
               page: req.query.page,
          };

          const theProducts = await getFeaturedProducts(params);
          const productsLength = await Odoo.execute_kw("product.template", "search_read", [
               [
                    ["x_featured_product", "=", true],
                    ["company_id", "=", params.company_id],
               ],
               ["id"],
          ]);

          if (theProducts.length === 0) {
               return res.status(400).json({ products: null, count: 0 });
          }
          const products = theProducts.map((product) => {
               return {
                    ...product,
                    x_images: JSON?.parse(product?.x_images),
               };
          });

          res.status(201).json({ products, count: productsLength.length });
     } catch (error) {
          console.log(error);
     }
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
                         // "image_512",
                         "categ_id",
                         "x_rating",
                         "rating_count",
                         "x_color",
                         "x_dimension",
                         "x_size",
                         "x_subcategory",
                         "x_weight",
                         "x_rating",
                         "x_images",
                         "website_url",
                         "public_categ_ids",
                         "website_meta_keywords",
                         "x_shipping_package",
                         "x_show_sold_count",
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
                         public_categ_ids: product.public_categ_ids,
                         list_price: product.list_price,
                         standard_price: product.standard_price,
                         company_id: product.company_id,
                         display_name: product.display_name,
                         base_unit_count: product.base_unit_count,
                         // image_1920: product.image_1920,
                         // image_1024: product.image_1024,
                         x_rating: product.x_rating,
                         create_date: product.create_date,
                         x_subcategory: product.x_subcategory,
                         x_size: product.x_size,
                         x_weight: product.x_weight,
                         x_color: product.x_color,
                         x_images: JSON.parse(product.x_images),
                         x_dimension: product.x_dimension,
                         x_shipping_package: product?.x_shipping_package,
                         x_show_sold_count: product?.x_show_sold_count,
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
                         "x_images",
                         "x_rating",
                         "rating_count",
                         "website_url",
                         "public_categ_ids",
                         "website_meta_keywords",
                         "x_shipping_package",
                         "x_show_sold_count",
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
                         public_categ_ids: product.public_categ_ids,
                         list_price: product.list_price,
                         standard_price: product.standard_price,
                         company_id: product.company_id,
                         display_name: product.display_name,
                         base_unit_count: product.base_unit_count,
                         // image_1920: product.image_1920,
                         // image_1024: product.image_1024,
                         x_rating: product.x_rating,
                         create_date: product.create_date,
                         x_subcategory: product.x_subcategory,
                         x_show_sold_count: product?.x_show_sold_count,
                         x_size: product.x_size,
                         x_weight: product.x_weight,
                         x_color: product.x_color,
                         x_shipping_package: product?.x_shipping_package,
                         x_images:
                              typeof product?.x_images === "string"
                                   ? JSON?.parse(product?.x_images)
                                   : product?.x_images,
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
     await Odoo.connect();
     const productId = req.params.id;

     const details = await getProductById(productId);

     const product = details?.map((product) => {
          return {
               ...product,
               x_images: JSON?.parse(product?.x_images),
               x_discount: product?.x_discount ? JSON.parse(product?.x_discount) : null,
          };
     });

     res.status(201).json({ product: product });
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
               product: { ...req.body },
               // user: user
          };
          const productId = await addProduct({ ...params });
          index.search(params.product.name).then(async ({ hits }) => {
               if (hits.length < 1) {
                    await index.saveObject(req.body, {
                         autoGenerateObjectIDIfNotExist: true,
                    });
               }
          });
          console.log(productId);
          res.status(201).json({ productId, status: true });
     } catch (err) {
          console.log("error", err);
          res.status(400).json({ err, status: false });
     }
};

exports.createProductWithVariant = async (req, res) => {
     // let user = req.userData;
     try {
          console.log("req body", req.body);
          const client = algoliasearch("CM2FP8NI0T", "daeb45e2c3fb98833358aba5e0c962c6");
          const index = client.initIndex("market-product");
          let params = {
               odoo: Odoo,
               product: {
                    ...{
                         ...req.body,
                         variants: req.body?.variants ? JSON.parse(req.body?.variants) : null,
                         // variants: JSON.parse(
                         //      '[[{"attributeId":3,"value":"423","price_extra":5},{"attributeId":1,"value":"666","price_extra":21},{"attributeId":1,"value":"888","price_extra":5},{"attributeId":1,"value":"211","price_extra":15}],[{"attributeId":3,"value":"444","price_extra":5},{"attributeId":3,"value":"999","price_extra":15},{"attributeId":3,"value":"801","price_extra":5}]]',
                         // ),
                    },
                    // images: req.files,
                    is_variant: true,
               },
               // user: user
          };
          console.log("pro", params.product);
          const productId = await addProductVariant({ ...params });
          index.search(params.product.name).then(async ({ hits }) => {
               if (hits.length < 1) {
                    await index.saveObject(req.body, {
                         autoGenerateObjectIDIfNotExist: true,
                    });
               }
          });
          res.status(201).json({ productId: productId, status: true });
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
               product: {
                    ...req.body,
                    variants: req.body?.variants ? JSON.parse(req.body?.variants) : null,
               },
               productId: req.params?.id,
          };
          await updateProduct({ ...params });

          res.status(200).json({ message: "updated successfully", status: true });
     } catch (err) {
          res.status(400).json({ err, status: false });
     }
};

exports.deleteProduct = async (req, res) => {
     const id = req.params.id;
     if (!id) {
          return res.status(400).json({ message: "Send product id" });
     }
     const response = deleteProduct(id);
     if (response) {
          res.status(200).json({ message: "Product deleted successfully" });
     } else {
          res.status(500).json({ message: "Something went wrong" });
     }
};

exports.salesProducts = async (req, res) => {
     try {
          await Odoo.connect();
          const startDate = req.params.startDate;
          const endDate = req.params.endDate;
          // Retrieve recently sold products
          const recentlySoldProductsResult = await Odoo.execute_kw(
               "sale.order.line",
               "search_read",
               [
                    [
                         ["order_id.state", "!=", "draft"],
                         ["order_id.date_order", ">=", startDate],
                         ["order_id.date_order", "<=", endDate],
                         ["company_id", "=", 122],
                    ],
               ],
          );
          //
          // console.log("recentlySoldProducts", recentlySoldProductsResult);

          // Extract product information from recently sold products
          const recentlySoldProducts = recentlySoldProductsResult.map((product) => {
               return {
                    product_id: product.product_id[0],
                    product_name: product.display_name,
                    quantity: product.product_uom_qty,
                    total_price: product.price_subtotal,
                    state: product.state,
                    create_date: product.create_date,
               };
          });

          res.status(201).json({
               products: recentlySoldProducts,
               status: true,
          });
     } catch (err) {
          console.log("error", err);
          res.status(400).json({ err, status: false });
     }
};

exports.productOutOfStock = async (req, res) => {
     try {
          await Odoo.connect();
          const { company_id } = req.body;

          const outOfStockProductsResult = await Odoo.execute_kw(
               "product.template",
               "search_read",
               [
                    [
                         ["company_id", "=", +company_id],
                         ["x_total_available_qty", "=", 0],
                    ],
               ],
          );

          res.status(201).json({
               products: outOfStockProductsResult,
               status: true,
          });
     } catch (err) {
          console.log("error", err);
          res.status(400).json({ err, status: false });
     }
};

exports.totalSales = async (req, res) => {
     try {
          await Odoo.connect();
          const { startDate, endDate, company_id } = req.body;

          const salesReportResult = await Odoo.execute_kw("sale.report", "search_read", [
               [
                    "&",
                    ["company_id", "=", +company_id],
                    ["state", "!=", "draft"],
                    ["date", ">=", startDate],
                    ["date", "<=", endDate],
               ],
          ]);

          // Calculate total revenue
          const totalRevenue = salesReportResult?.reduce(
               (total, sale) => total + sale.price_total,
               0,
          );

          res.status(201).json({
               totalRevenue: totalRevenue,
               status: true,
               salesReportResult,
               body: req.body,
          });
     } catch (err) {
          console.log("error", err);
          res.status(400).json({ err, status: false });
     }
};

exports.totalSalesQuantity = async (req, res) => {
     // let companyId = req.params?.company_id;
     // console.log("parasm", user);
     try {
          await Odoo.connect();
          const { startDate, endDate, company_id } = req.body;

          // Retrieve recently sold products
          // Retrieve sales report
          const recentlySoldProductsResult = await Odoo.execute_kw("sale.report", "search_read", [
               [
                    "&",
                    ["company_id", "=", +company_id],
                    ["state", "!=", "draft"],
                    ["date", ">=", startDate],
                    ["date", "<=", endDate],
               ],
          ]);
          const recentlySoldProducts = recentlySoldProductsResult.map((product) => {
               return {
                    product_id: product.product_id[0],
                    product_name: product.product_id[1],
                    quantity: product.product_uom_qty,
                    total_price: product.price_subtotal,
               };
          });
          // Calculate total revenue
          const totalQuantitySold = recentlySoldProducts.reduce(
               (total, product) => total + product.quantity,
               0,
          );
          res.status(201).json({
               quantity: totalQuantitySold,
               status: true,
          });
     } catch (err) {
          console.log("error", err);
          res.status(400).json({ err, status: false });
     }
};
exports.totalFailedOrder = async (req, res) => {
     // let companyId = req.params?.company_id;
     // console.log("parasm", user);
     try {
          await Odoo.connect();
          const { startDate, endDate, company_id } = req.body;

          const failedOrdersResult = await Odoo.execute_kw("sale.order", "search_read", [
               [
                    ["state", "=", "failed"], // Assuming "failed" is the state of failed orders
                    ["company_id", "=", +company_id],
                    ["date_order", ">=", startDate],
                    ["date_order", "<=", endDate],
               ],
          ]);

          // Calculate total failed orders
          const totalFailedOrders = failedOrdersResult?.length;

          res.status(201).json({
               orders: totalFailedOrders,
               status: true,
          });
     } catch (err) {
          console.log("error", err);
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
                    public_categ_ids: product.public_categ_ids,
                    list_price: product.list_price,
                    standard_price: product.standard_price,
                    company_id: product.company_id,
                    display_name: product.display_name,
                    base_unit_count: product.base_unit_count,
                    // image_1920: product.image_1920,
                    // image_1024: product.image_1024,
                    x_rating: product.x_rating,
                    create_date: product.create_date,
                    x_subcategory: product.x_subcategory,
                    x_size: product.x_size,
                    x_weight: product.x_weight,
                    x_color: product.x_color,
                    x_images:
                         typeof product?.x_images === "string" && product?.x_images
                              ? JSON?.parse(product?.x_images)
                              : product?.x_images,
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
               arr.push([key, "ilike", body[key]]);
          });
          const theProducts = await searchProducts(arr);

          const products = theProducts.map((product) => {
               return {
                    ...product,
                    x_discount: product?.x_discount ? JSON.parse(product?.x_discount) : null,
                    x_images: JSON.parse(product.x_images),
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
          const theProducts = await Odoo.execute_kw("product.template", "search_read", [
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
                    "description",
                    "base_unit_count",
                    "categ_id",
                    "rating_avg",
                    "rating_count",
                    "x_color",
                    "x_dimension",
                    "x_size",
                    "x_subcategory",
                    "x_weight",
                    "x_rating",
                    "x_images",
                    "website_url",
                    "public_categ_ids",
                    "website_meta_keywords",
               ],
               // null,
               null,
               null,
          ]);
          const products = theProducts.map((product) => {
               return {
                    id: product.id,
                    website_url: product.website_url,
                    name: product.name,
                    description: product.description,
                    categ_id: product.categ_id,
                    public_categ_ids: product.public_categ_ids,
                    list_price: product.list_price,
                    standard_price: product.standard_price,
                    company_id: product.company_id,
                    display_name: product.display_name,
                    base_unit_count: product.base_unit_count,
                    // image_1920: product.image_1920,
                    // image_1024: product.image_1024,
                    x_rating: product.x_rating,
                    create_date: product.create_date,
                    x_subcategory: product.x_subcategory,
                    x_size: product.x_size,
                    x_weight: product.x_weight,
                    x_color: product.x_color,
                    sales_count: product.sales_count,
                    x_images:
                         typeof product?.x_images === "string" && product?.x_images
                              ? JSON?.parse(product?.x_images)
                              : product?.x_images,
                    x_dimension: product.x_dimension,
               };
          });
          res.status(200).json({
               products: products
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
          // await Odoo.execute_kw("product.product", "write", [
          //      [+productId],
          //      { x_rating: ratingAvg },
          // ]);
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
          const companyId = req.params.companyId;
          const user = await User.findById(userId);
          if (!user || !companyId) {
               return res
                    .status(400)
                    .json({ message: "Send all required parameters", status: false });
          }
          const uniquePro = [...new Set(user.order_products.map((pro) => JSON.stringify(pro)))].map(
               (uni) => JSON.parse(uni),
          );
          const unratedProducts = uniquePro.filter(
               (order) => !user.rated.includes(order.id) && order.company_id === companyId,
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
                    "description",
                    "product_variant_id",
                    "base_unit_count",
                    "categ_id",
                    "rating_avg",
                    "rating_count",
                    "x_color",
                    "x_dimension",
                    "x_size",
                    "x_subcategory",
                    "x_images",
                    "x_weight",
                    "x_rating",
                    "website_url",
                    "public_categ_ids",
                    "website_meta_keywords",
                    "x_ads_num",
                    "x_discount",
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

const getOdooSuggestions = async (query) => {
     try {
          await Odoo.connect();
          // Fetch category suggestions from Odoo
          const categorySuggestions = await Odoo.execute_kw(
               "product.public.category",
               "search_read",
               [[["name", "ilike", query]], ["name"]],
          );

          // Fetch product suggestions from Odoo
          const productSuggestions = await Odoo.execute_kw("product.template", "search_read", [
               [["name", "ilike", query]],
               [
                    "name",
                    "standard_price",
                    "description",
                    "base_unit_count",
                    "public_categ_ids",
                    "product_variant_id",
                    "x_size",
                    "list_price",
                    "image_1920",
               ],
          ]);

          // Extract names and add type information
          const categoryNames = categorySuggestions.map((category) => ({
               name: category.name,
               type: "category",
          }));
          // const productNames = productSuggestions.map((product) => ({
          //      name: product.name,
          //      type: "product",
          // }));

          // Combine and return the suggestions
          return categoryNames.concat(productSuggestions);
     } catch (error) {
          console.error("Error fetching Odoo suggestions:", error.message);
          return [];
     }
};

exports.searchProductsAndcateg = async (req, res) => {
     try {
          const query = req.query.q || "";
          console.log("req.query.q", req.query.q);
          // Fetch suggestions from Odoo
          const odooSuggestions = await getOdooSuggestions(query);

          // You can add additional sources and logic as needed

          // Combine and return the suggestions
          res.json({ suggestions: odooSuggestions });
     } catch (err) {
          console.log("error", err);
          res.status(500).json({ error: err, status: false });
     }
};

exports.createProductAttributes = async (req, res) => {
     try {
          await Odoo.connect();
          // Create the attribute
          const attributeData = {
               name: req.body.name,
               display_name: req.body.name, // You can customize this
               // display_type: req.body.type ?? "selection", // Example type, change as needed
          };

          const attributeId = await Odoo.execute_kw("product.attribute", "create", [attributeData]);

          res.status(200).json({ attributeId, status: true });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.fetchProductAttributes = async (req, res) => {
     try {
          await Odoo.connect();
          const attributeIds = await Odoo.execute_kw("product.attribute", "search", [[]]);
          const attributes = await Odoo.execute_kw("product.attribute", "read", [attributeIds, []]);

          res.status(200).json({ attributes, status: true });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.fetchProductAttributeValues = async (req, res) => {
     try {
          await Odoo.connect();
          const attributeId = +req.params.attributeId;

          const attributeValues = await Odoo.execute_kw("product.attribute.value", "search_read", [
               [["attribute_id", "=", attributeId]],
               ["name", "display_name", "attribute_id"],
          ]);

          console.log(`Attribute Values for Attribute ID ${attributeId}:`, attributeValues);

          res.status(200).json({ values: attributeValues, status: true });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.filterProductSearch = async (req, res) => {
     try {
          const body = req.body;
          const keys = Object.keys(body);
          const arr = [];
          keys.forEach((key) => {
               if (key === "categ_id") {
                    arr.push(["public_categ_ids", "=", body[key]]);
               }
               if (key === "minPrice") {
                    arr.push(["standard_price", ">=", body[key]]);
               }
               if (key === "maxPrice") {
                    arr.push(["standard_price", "<=", body[key]]);
               }
          });

          arr.push(["company_id", "=", Number(req.query.companyId)]);

          console.log({ keys, arr: [...arr] });
          // const theProducts = await searchProducts(arr); //[[['categ_id', '=', categoryId], ['company_id', '=', companyId]]]
          try {
               await Odoo.connect();
               const theProducts = await Odoo.execute_kw(
                    "product.product",
                    "search_read",
                    [
                         [...arr],
                         [
                              "id",
                              "name",
                              "display_name",
                              "list_price",
                              "company_id",
                              "standard_price",
                              "description",
                              "base_unit_count",
                              "categ_id",
                              "rating_avg",
                              "x_subcategory",
                              "x_images",
                              "rating_count",
                              "public_categ_ids",
                              "x_discount",
                         ],
                    ],

                    {},
               );

               const products = theProducts.map((product) => {
                    return {
                         ...product,
                         x_discount: product?.x_discount ? JSON.parse(product?.x_discount) : null,
                         x_images: JSON.parse(product.x_images),
                    };
               });
               return res.status(200).json({ products, status: true });
          } catch (e) {
               console.error("Error when try connect Odoo XML-RPC.", e);
               res.status(500).json({ err, status: false });
          }
     } catch (err) {
          res.status(400).json({ err, status: false });
     }
};

exports.getProductbyCompanyIdAndSearch = async (req, res) => {
     console.log("GET /api/products");
 
     try {
         const companyId = [+req.params.companyId];
         const searchQuery = req.query.searchQuery;
         const page = parseInt(req.query.page) || 1;
         const limit = 10; // Number of products per page
         const offset = (page - 1) * limit; // Calculate offset
 
         if (companyId) {
             await Odoo.connect();
             console.log("Connected to Odoo XML-RPC - api/products");
 
             // Define the search filter
             let searchFilter = [
                 ["type", "=", "consu"],
                 ["company_id", "=", companyId],
             ];
 
             if (searchQuery) {
                 searchFilter.push(["name", "ilike", searchQuery]);
             }
 
             // Get total count of products
             const totalCount = await Odoo.execute_kw("product.template", "search_count", [
                 searchFilter,
             ]);
 
             const theProducts = await Odoo.execute_kw("product.template", "search_read", [
                 searchFilter,
                 [
                     "id",
                     "public_categ_ids",
                     "name",
                     "display_name",
                     "list_price",
                     "standard_price",
                     "description",
                     "base_unit_count",
                     "product_variant_id",
                     "categ_id",
                     "rating_avg",
                     "rating_count",
                     "x_color",
                     "x_dimension",
                     "x_size",
                     "x_subcategory",
                     "x_weight",
                     "x_rating",
                     "x_images",
                     "x_free_shipping",
                     "create_date",
                     "website_url",
                     "website_meta_keywords",
                     "x_shipping_package",
                 ],
                 offset,
                 limit,
             ]);
 
             const products = theProducts.map((product) => {
                 return {
                     ...product,
                     x_images: JSON.parse(product.x_images),
                 };
             });
 
             res.status(200).json({ products, totalCount, status: true });
         } else {
             res.status(404).json({ error: "Invalid Company Id", status: false });
         }
     } catch (error) {
         console.error("Error when trying to connect to Odoo XML-RPC.", error);
         res.status(500).json({ error: "Internal Server Error", status: false });
     }
 };
 
