const User = require("../model/User");
const Company = require("../model/Company");
const Odoo = require("../config/odoo.connection");
const { toDataURL } = require("../utils/imageBase64");
const fs = require("fs");
const axios = require("axios");

const unitOfMeasure = async (odoo) => {
     try {
          await odoo.connect();
          console.log("Get unit of mesasure");
          let uom = await odoo.execute_kw("uom.uom", "search_read", []);
          return { uom };
     } catch (e) {
          console.error("Error when trying to connect to odoo xml-rpc");
     }
};

const getProductById = async (id) => {
     let productId = id;

     try {
          await Odoo.connect();
          let products = await Odoo.execute_kw("product.product", "read", [productId]);
          return products;
     } catch (e) {
          console.error("XMPLC Error", e);
     }
};
/**
 * This function get feature products
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getFeaturedProducts = async (params) => {
     console.log("GET /api/products");
     try {
          await Odoo.connect();

          const tagName = "Featured Product";
          const products = await Odoo.execute_kw(
               "product.product",
               "search_read",
               [
                    [
                         ["product_tag_ids.name", "=", tagName],
                         ["company_id", "=", params.company_id],
                    ],
               ],

               {},
          );
          return products;
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

const addProduct = async (params) => {
     try {
          const images = params.product.images || [];
          // Convert each image buffer to base64
          const base64Images = images.map((image) => {
               return {
                    ...image,
                    base64: image.buffer.toString("base64"),
               };
          });

          // Connect to Odoo instance
          await params.odoo.connect();

          // Create the product
          const productData = {
               base_unit_count: params.product.qty,
               categ_id: params.product.category_id,
               list_price: params.product.list_price,
               standard_price: params.product.standard_price,
               name: params.product.name,
               uom_name: params.product.uom_name,
               display_name: params.product.name,
               website_published: params.product.published,
               company_id: params.product.company_id,
               // product_tag_ids: [1, 5, 4, 6],
          };

          const productId = await params.odoo.execute_kw("product.template", "create", [
               productData,
          ]);

          if (JSON.parse(params.product.product_tag_ids).length > 0) {
               await params.odoo.execute_kw("product.template", "write", [
                    [productId],
                    { product_tag_ids: JSON.parse(params.product.product_tag_ids) },
               ]);
          }
          // // Write the images if provided
          for (const base64Image of base64Images) {
               await params.odoo.execute_kw("product.template", "write", [
                    [productId],
                    { image_1920: base64Image.base64 },
               ]);
          }

          // Return the ID of the created product
          return 1;
     } catch (error) {
          console.error("Error when trying to connect to Odoo XML-RPC.", error);
          throw error;
     }
};

const addMultipleProducts = async (params) => {
     try {
          const productIds = [];
          for (const product of params.products) {
               const images = product?.images || [];
               const base64Images = [];

               // Convert each image URL to base64
               for (const imageUrl of images) {
                    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
                    const imageBuffer = Buffer.from(response.data, "binary");

                    base64Images.push({
                         url: imageUrl,
                         base64: imageBuffer.toString("base64"),
                    });
               }

               // // Connect to Odoo instance
               await params.odoo.connect();

               // // Create the product
               const productData = {
                    base_unit_count: product.qty,
                    categ_id: product.category_id,
                    list_price: product.list_price,
                    standard_price: product.standard_price,
                    name: product.name,
                    uom_name: product.uom_name,
                    display_name: product.name,
                    website_published: product.published,
                    company_id: product.company_id,
               };

               const productId = await params.odoo.execute_kw("product.template", "create", [
                    productData,
               ]);

               // // Write the images if provided
               for (const base64Image of base64Images) {
                    await params.odoo.execute_kw("product.template", "write", [
                         [productId],
                         { image_1920: base64Image.base64 },
                    ]);
               }
               productIds.push(productId);
               // Log the ID of the created product
               console.log(`Product created with ID: ${productId}`);
          }

          // Return a success message or relevant data
          return productIds;
     } catch (error) {
          console.error("Error when trying to connect to Odoo XML-RPC.", error);
          throw error;
     }
};

const getProductDetails = async (productId) => {
     try {
          await Odoo.connect();
          console.log("Connect to odoo XML-RPC is successed.");

          let id = await Odoo.execute_kw("product.template", "search", [[["id", "=", productId]]]);
          let details = await Odoo.execute_kw("product.template", "read", [id]);

          return details;
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

const updateProduct = async (params) => {
     try {
          await params.odoo.connect();
          let product = await odoo.execute_kw("product.template", "write", [
               [params.product_id],
               {
                    base_unit_count: params.product.qty,
                    categ_id: params.product.category_id,
                    list_price: params.product.list_price,
                    standard_price: params.product.standard_price,
                    name: params.product.name,
                    // image: params.product.image,
                    uom_name: params.product.uom_name,
                    display_name: params.product.name,
                    // product_variant_ids: 1,
                    website_published: params.product.published,
               },
          ]);
          return product;
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

/**
 * This function delete a user product
 * @param  {[array]} product_id [The id of the product that has been seleected]
 * @return {[productID]}        [Return the id of the product]
 */
const deleteProduct = async (params) => {};

// const getProductImageUrl = async (params) => {

// 	try {
// 		await params.odoo.connect();
// 		let product = await odoo.execute_kw('product.template', 'read', [
// 			[params.product_id]
// 	} catch (e) {

// 	}
// }

module.exports = {
     addProduct,
     unitOfMeasure,
     getFeaturedProducts,
     getProductById,
     getProductDetails,
     addMultipleProducts,
};
