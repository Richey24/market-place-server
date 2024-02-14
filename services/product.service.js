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
     console.log("id", id);
     try {
          await Odoo.connect();
          const productData = await Odoo.execute_kw("product.template", "search_read", [
               [["id", "=", productId]],
               [
                    "id",
                    "name",
                    "display_name",
                    "list_price",
                    // "image_1920",
                    "standard_price",
                    "description",
                    "categ_id",
                    "rating_avg",
                    "x_color",
                    "x_dimension",
                    "x_size",
                    "x_subcategory",
                    "x_weight",
                    "x_rating",
                    "x_images",
                    "rating_count",
                    "website_url",
                    "public_categ_ids",
                    "website_meta_keywords",
               ],
          ]);
          if (productData.length === 0) {
               return []
          }

          let attributeLineIds = productData[0].attribute_line_ids || [];
          attributeLineIds = attributeLineIds?.map(async (attributeLineId) => {
               let attributeLineData = await Odoo.execute_kw(
                    "product.template.attribute.line",
                    "read",
                    [[attributeLineId], []],
               );

               attributeLineData = await attributeLineData?.map(async (lineData) => {
                    // const valueIds = lineData?.value_ids || [];
                    let productTemplateValueIds = lineData?.product_template_value_ids || [];

                    // for (const valueId of valueIds) {
                    //      const attributeValueData = await Odoo.execute_kw(
                    //           "product.attribute.value",
                    //           "read",
                    //           [[valueId], []],
                    //      );

                    //      console.log("Attribute Value ID:", attributeValueData);
                    // }

                    productTemplateValueIds = productTemplateValueIds?.map(
                         async (productTemplateValueId) => {
                              const productTemplateValueData = await Odoo.execute_kw(
                                   "product.template.attribute.value",
                                   "read",
                                   [[productTemplateValueId], []],
                              );

                              return await productTemplateValueData;
                         },
                    );

                    productTemplateValueIds = await Promise.all(productTemplateValueIds);

                    return {
                         ...lineData,
                         product_template_value_ids_data: productTemplateValueIds,
                    };
                    // return lineData;
               });
               // attributeLineIds = await Promise.all(attributeLineData);
               // console.log("Attribute Line ID:", await attributeLineData);

               attributeLineData = Promise.all(attributeLineData);
               return await attributeLineData;
          });
          attributeLineIds = await Promise.all(attributeLineIds);
          // console.log("attributeLineIds", attributeLineIds);
          return [{ ...productData[0], attribute_line_ids_data: attributeLineIds }];
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
          const products = await Odoo.execute_kw("product.product", "search_read", [
               [
                    ["product_tag_ids.name", "=", tagName],
                    ["company_id", "=", params.company_id],
               ],
               [
                    "id",
                    "name",
                    "display_name",
                    "list_price",
                    // "image_1920",
                    "standard_price",
                    "description",
                    "categ_id",
                    "rating_avg",
                    "x_color",
                    "x_dimension",
                    "x_size",
                    "x_subcategory",
                    "x_weight",
                    "x_rating",
                    "x_images",
                    "rating_count",
                    "website_url",
                    "public_categ_ids",
                    "website_meta_keywords",
               ],
               // null,
               params.page ? params.page * 10 - 10 : 0,
               params.page ? params.page * 10 : 10,
          ]);
          return products;
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

const searchProducts = async (params) => {
     console.log("GET /api/products/search");
     try {
          await Odoo.connect();
          const products = await Odoo.execute_kw(
               "product.template",
               "search_read",
               [[...params]],
               [
                    "id",
                    "name",
                    "display_name",
                    "list_price",
                    // "image_1920",
                    "standard_price",
                    "description",
                    "categ_id",
                    "rating_avg",
                    "x_color",
                    "x_dimension",
                    "x_size",
                    "x_subcategory",
                    "x_weight",
                    "x_rating",
                    "x_images",
                    "rating_count",
                    "website_url",
                    "public_categ_ids",
                    "website_meta_keywords",
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
          // const images = params.product.images || [];
          // Convert each image buffer to base64
          // const base64Images = images.map((image) => {
          //      return {
          //           ...image,
          //           base64: image.buffer.toString("base64"),
          //      };
          // });

          // Connect to Odoo instance
          await params.odoo.connect();

          // Create the product
          const productData = {
               base_unit_count: params.product.qty,
               public_categ_ids: [+params.product.category_id],
               list_price: params.product.list_price,
               standard_price: params.product.standard_price,
               name: params.product.name,
               uom_name: params.product.uom_name,
               display_name: params.product.name,
               website_published: params.product.published,
               company_id: params.product.company_id,
               x_color: params.product.color,
               x_subcategory: params.product.subcategory,
               x_size: params.product.size,
               x_weight: params.product.weight,
               x_images: params.product.images,
               x_dimension: params.product.dimension,
               product_tag_ids: params.product.product_tag_ids
                    ? JSON.parse(params.product.product_tag_ids)
                    : [],
          };

          const productId = await params.odoo.execute_kw("product.template", "create", [
               productData,
          ]);

          if (params.product.product_tag_ids) {
               if (JSON.parse(params.product.product_tag_ids)?.length > 0) {
                    await params.odoo.execute_kw("product.template", "write", [
                         [productId],
                         { product_tag_ids: JSON.parse(params.product.product_tag_ids) },
                    ]);
               }
          }
          // // Write the images if provided
          // for (const base64Image of base64Images) {
          //      await params.odoo.execute_kw("product.template", "write", [
          //           [productId],
          //           { image_1920: base64Image.base64 },
          //      ]);

          //      const recordId = await Odoo.execute_kw("ir.attachment", "create", [
          //           {
          //                name: "productId.png",
          //                datas: base64Image.base64,
          //                res_model: "ir.ui.view",
          //                res_id: productId,
          //                res_field: "product_images",
          //                public: true,
          //                company_id: params.product.company_id,
          //           },
          //      ]);

          //      console.log("Image saved with ID:", recordId);
          // }

          // saveImageToOdoo(base64Images[0].base64);
          // Return the ID of the created product
          return productId;
     } catch (error) {
          console.error("Error when trying to connect to Odoo XML-RPC.", error);
          throw error;
     }
};

const createProductTemplate = async (params, templateData) => {
     try {
          await params.odoo.connect();
          return await params.odoo.execute_kw("product.template", "create", [templateData]);
     } catch (error) {
          console.error("Error creating product template:", error);
          throw error;
     }
};

const createProductVariant = async (params, templateId, variantData) => {
     try {
          // variantData.product_tmpl_id = templateId;
          // const combination_indices = 10033454365 * Math.random(1000);

          // Check if the combination already exists
          // const existingCombination = await params.odoo.execute_kw(
          //      "product.product",
          //      "search_count",
          //      [
          //           [
          //                ["product_tmpl_id", "=", templateId],
          //                ["combination_indices", "=", combination_indices],
          //           ],
          //      ],
          // );

          // console.log(
          //      "existingCombination",
          //      existingCombination,
          //      "combination_indices",
          //      combination_indices,
          // );

          // The combination is unique, proceed with creating the product variant

          const variantId = await params.odoo.execute_kw("product.product", "create", [
               { ...variantData },
          ]);

          return variantId;

          // await params.odoo.execute_kw("product.template", "write", [
          //      [templateId],
          //      { product_variant_ids: [[4, variantId]] }, // 4 is for linking the variant
          // ]);

          // Update variant with additional information
          // await params.odoo.execute_kw("product.product", "write", [
          //      [variantId],
          //      { x_additional_property: variantData.x_additional_property },
          // ]);

          // Write images for the variant
          // ... (existing image handling code)
     } catch (error) {
          console.error("Error creating product variant:", error);
          throw error;
     }
};

const addProductVariant = async (params) => {
     if (params.product.is_variant) {
          const templateData = {
               base_unit_count: params.product.qty,
               public_categ_ids: [+params.product.category_id],
               list_price: params.product.list_price,
               standard_price: params.product.standard_price,
               name: params.product.name,
               uom_name: params.product.uom_name,
               display_name: params.product.name,
               website_published: params.product.published,
               company_id: params.product.company_id,
               x_color: params.product.color,
               x_subcategory: params.product.subcategory,
               x_size: params.product.size,
               x_weight: params.product.weight,
               x_images: params.product.images,
               x_dimension: params.product.dimension,
               // qty_available: 5,
               // product_tag_ids: params.product.product_tag_ids
               //      ? JSON.parse(params.product.product_tag_ids)
               //      : [],
          };

          console.log("templateData", templateData);
          const templateId = await createProductTemplate(params, templateData);

          // if (params.product?.qty_available) {
          //      console.log("got here");
          //      await Odoo.execute_kw("product.product", "write", [
          //           templateId,
          //           { company_id: +params.product.company_id },
          //      ]);

          //      const stockMoveData = {
          //           product_id: templateId,
          //           product_uom_qty: +params.product.qty_available,
          //           company_id: +params.product.company_id,
          //           // location_id: params.location_id, // Replace with the source location ID
          //           // location_dest_id: params.location_dest_id, // Replace with the destination location ID
          //      };
          //      console.log("got here now", stockMoveData);

          //      const stockMoveId = await params.odoo.execute_kw("stock.move", "create", [
          //           stockMoveData,
          //      ]);
          //      console.log("dead", stockMoveData);

          //      // Confirm the stock move
          //      const confirmMoveResult = await params.odoo.execute_kw(
          //           "stock.move",
          //           "action_confirm",
          //           [[stockMoveId]],
          //      );
          //      if (!confirmMoveResult) {
          //           console.error("Failed to confirm the stock move.");
          //           // Handle the error as needed
          //      }
          // }

          if (params?.product?.variants && params?.product?.variants.length > 0) {
               await params?.product?.variants?.forEach(async (container) => {
                    await container.forEach(async (variant, idx) => {
                         // console.log("variant", variant);

                         let attributeValueId;

                         if (!variant?.valueId) {
                              const attributeValueData = {
                                   name: variant?.value, // Replace with the actual value
                                   attribute_id: variant?.attributeId,
                                   sequence: 1, // Optional: Display sequence
                              };

                              attributeValueId = await params.odoo.execute_kw(
                                   "product.attribute.value",
                                   "create",
                                   [attributeValueData],
                              );
                         } else {
                              attributeValueId = variant?.valueId;
                         }

                         const attributeLineData = {
                              product_tmpl_id: templateId,
                              attribute_id: variant?.attributeId,
                              value_ids: [[6, 0, [attributeValueId]]],
                         };

                         const attributeLineId = await params.odoo.execute_kw(
                              "product.template.attribute.line",
                              "create",
                              [attributeLineData],
                         );

                         if (variant?.price_extra && variant?.price_extra !== 0) {
                              ///ADD PRICE_EXTRA
                              const attributeLineRespData = await Odoo.execute_kw(
                                   "product.template.attribute.line",
                                   "read",
                                   [[attributeLineId], ["product_template_value_ids"]],
                              );

                              const productTemplateValueIds =
                                   attributeLineRespData[0]?.product_template_value_ids || [];
                              const attributeValueWriteData = {
                                   price_extra: variant?.price_extra, // Set the price adjustment here
                              };

                              await params.odoo.execute_kw(
                                   "product.template.attribute.value",
                                   "write",
                                   [[productTemplateValueIds[0]], attributeValueWriteData],
                              );
                         }
                    });
               });
          }

          // const images = params.product?.images || [];
          // // Convert each image buffer to base64
          // const base64Images = images.map((image) => {
          //      return {
          //           ...image,
          //           base64: image.buffer.toString("base64"),
          //      };
          // });

          // // // Write the images if provided
          // for (const base64Image of base64Images) {
          //      await params.odoo.execute_kw("product.template", "write", [
          //           [templateId],
          //           { image_1920: base64Image.base64 },
          //      ]);

          //      const recordId = await Odoo.execute_kw("ir.attachment", "create", [
          //           {
          //                name: "productId.png",
          //                datas: base64Image.base64,
          //                res_model: "ir.ui.view",
          //                res_id: templateId,
          //                res_field: "product_images",
          //                public: true,
          //                company_id: params.product.company_id,
          //           },
          //      ]);

          //      console.log("Image saved with ID:", recordId);
          // }

          return templateId;
     } else {
          console.log("failed");
          // return await addProduct(params);
          return 1;
     }
};

const updateProduct = async (params) => {
     try {
          // const images = params.product.images || [];
          // Convert each image buffer to base64
          // const base64Images = images?.map((image) => {
          //      return {
          //           ...image,
          //           base64: image.buffer.toString("base64"),
          //      };
          // });

          await params.odoo.connect();
          console.log(" params.product", params.product);
          // Create the product
          const productData = {
               base_unit_count: params.product.qty,
               // categ_id: +params.product.category_id,
               list_price: params.product.list_price,
               standard_price: params.product.standard_price,
               name: params.product.name,
               uom_name: params.product.uom_name,
               display_name: params.product.name,
               website_published: params.product.published,
               company_id: params.product.company_id,
               x_color: params.product.color,
               x_subcategory: params.product.subcategory,
               x_size: params.product.size,
               x_images: params.product.images,
               x_weight: params.product.weight,
               x_dimension: params.product.dimension,
               product_tag_ids: params.product.product_tag_ids
                    ? JSON.parse(params.product.product_tag_ids)
                    : [],
          };
          // Update the product data
          const result = await params.odoo.execute_kw("product.template", "write", [
               [+params?.productId],
               productData,
          ]);
          console.log("result", result);

          if (result) {
               console.log("Product data updated successfully. Product ID:", +params?.productId);
          } else {
               console.error("Failed to update product data.");
               throw new Error("Failed to update product data.");
          }

          // for (const base64Image of base64Images) {
          //      await params.odoo.execute_kw("product.template", "write", [
          //           [productId],
          //           { image_1920: base64Image.base64 },
          //      ]);

          //      const recordId = await Odoo.execute_kw("ir.attachment", "create", [
          //           {
          //                name: "productId.png",
          //                datas: base64Image.base64,
          //                res_model: "ir.ui.view",
          //                res_id: productId,
          //                res_field: "product_images",
          //                public: true,
          //                company_id: params.product.company_id,
          //           },
          //      ]);

          //      console.log("Image saved with ID:", recordId);
          // }

          return result;
     } catch (error) {
          console.error("Error updating product:", error);
          throw error;
     }
};

const addMultipleProducts = async (params) => {
     try {
          const productIds = [];
          for (const product of params.products) {
               // const images = product?.images || [];
               // const base64Images = [];

               // // Convert each image URL to base64
               // for (const imageUrl of images) {
               //      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
               //      const imageBuffer = Buffer.from(response.data, "binary");

               //      base64Images.push({
               //           url: imageUrl,
               //           base64: imageBuffer.toString("base64"),
               //      });
               // }

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
                    x_images: product.images
               };

               const productId = await params.odoo.execute_kw("product.template", "create", [
                    productData,
               ]);

               // // Write the images if provided
               // for (const base64Image of base64Images) {
               //      await params.odoo.execute_kw("product.template", "write", [
               //           [productId],
               //           { image_1920: base64Image.base64 },
               //      ]);
               // }
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

          const fields = ["name", "res_id", "res_model", "public", "datas"];
          let attachments = await Odoo.execute_kw("ir.attachment", "search_read", [
               [],
               // fields,
               // [["name", "=", "s_mega_menu_images_subtitles_default_image_3.jpg"]],
          ]);

          if (attachments?.length > 0) {
               const et = attachments.filter((attachment) => {
                    return attachment?.res_id === productId;
               });

               console.log("et", et);
          }
          // const productImages = await Odoo.execute_kw("product.image", "search_read", [
          //      [["product_tmpl_id", "=", id]],
          //      { fields: ["image"] },
          // ]);

          return attachments;
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

// const updateProduct = async (params) => {
//      try {
//           await params.odoo.connect();
//           let product = await odoo.execute_kw("product.template", "write", [
//                [params.product_id],
//                {
//                     base_unit_count: params.product.qty,
//                     categ_id: params.product.category_id,
//                     list_price: params.product.list_price,
//                     standard_price: params.product.standard_price,
//                     name: params.product.name,
//                     // image: params.product.image,
//                     uom_name: params.product.uom_name,
//                     display_name: params.product.name,
//                     // product_variant_ids: 1,
//                     website_published: params.product.published,
//                },
//           ]);
//           return product;
//      } catch (e) {
//           console.error("Error when try connect Odoo XML-RPC.", e);
//      }
// };

/**
 * This function delete a user product
 * @param  {[array]} product_id [The id of the product that has been seleected]
 * @return {[productID]}        [Return the id of the product]
 */
const deleteProduct = async (id) => {
     try {
          await Odoo.connect();
          await Odoo.execute_kw("product.template", "unlink",
               [[Number(id)]],
          )
          return true
     } catch (error) {
          console.log(error);
          return false
     }
};

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
     updateProduct,
     searchProducts,
     addProductVariant,
     deleteProduct
};
