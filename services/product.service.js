const Company = require("../model/Company");

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

const getProduct = async (params) => {
     console.log("GET /api/products");
     try {
          await Odoo.connect();
          let products = await Odoo.execute_kw(
               "product.template",
               "search_read",
               [[["type", "=", "consu"]]],
               { fields: ["name", "public_categ_ids"], limit: 5 },
          );
          res.status(201).json({ products });
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

const addProduct = async (params) => {
     try {
          await params.odoo.connect();
          let product = await params.odoo.execute_kw("product.template", "create", [
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
          return await product;
     } catch (e) {
          throw ("Error when try connect Odoo XML-RPC.", e);
     }
};

const updateProduct = async (params) => {
     try {
          await params.odoo.connect();
          let product = await odoo.execute_kw("product.template", "write", [
               [params.product.id],
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

module.exports = {
     addProduct,
     unitOfMeasure,
};
