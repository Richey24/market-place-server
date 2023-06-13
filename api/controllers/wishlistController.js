var Odoo = require('../../config/odoo.connection');

exports.getWishlist = async (req, res) => {

    console.log("GET /api/products");

    try {
        await Odoo.connect();
        let products = await Odoo.execute_kw('product.wishlist', 'search_read', [[['type', '=', 'consu']]], { 'fields': ['name', 'public_categ_ids'], 'limit': 5 })
         // [[['is_company', '=', True]]], {'fields': ['name', 'country_id', 'comment'], 'limit': 5})
         // let products = await Odoo.execute_kw('product.template', 'search_read', [[['type', '=', 'consu']]]);
         // 
         // console.log(products);
         res.status(201).json({ products });
        console.log("Connect to Odoo XML-RPC");
    } catch (e) {
    	console.error('Error Went try connect Odoo XML-RPC')
    }
}

exports.createWishlist = async (req, res) => {


	console.log("Post /api/wishlist");
    console.log(req.body.product_id);
    
    try {
        await Odoo.connect();
        let id = await Odoo.execute_kw('product.wishlist', 'create', [
	        { 'active': true, 'product_id': req.body.product_id, 'website_id': 1},
	    ]);
	    res.status(201).json({ id });

    } catch(e) {
		    console.error("Error when try connect Odoo XML-RPC.", e);
	}

}
