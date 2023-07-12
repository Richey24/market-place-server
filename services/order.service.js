const addOrder = async (params) => {
     try {
          await params.odoo.connect();
          let order = await params.odoo.execute_kw("order.template", "create", [
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
          return await order;
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

module.exports = {
     addOrder,
};
