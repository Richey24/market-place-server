const devService = require("../../../services/dev.service");
const { addProductVariant } = require("../../../services/product.service");

exports.getProducts = async (req, res) => {
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
                              "create_date",
                              "website_url",
                              "website_meta_keywords",
                              "x_shipping_package",
                         ],
                         null,
                         0,
                         // 10,
                    ],
                    { fields: ["name", "public_categ_ids"] },
               );

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
                         x_images: JSON.parse(product.x_images),
                         x_weight: product.x_weight,
                         x_color: product.x_color,
                         x_dimension: product.x_dimension,
                         x_shipping_package: product?.x_shipping_package,
                    };
               });
               res.status(200).json({ products: products, status: true });
          } else {
               res.status(404).json({ error: "Invalid Company Id", status: false });
          }
     } catch (error) {
          console.error("Error when trying to connect to Odoo XML-RPC.", error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.createProduct = async (req, res) => {
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
          // console.log("pro", params.product);
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
