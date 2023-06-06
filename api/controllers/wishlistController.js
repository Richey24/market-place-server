var Odoo = require('async-odoo-xmlrpc');

exports.getWishlist = async (req, res) => {

	console.log("GET /api/products");
	var odoo = new Odoo({
        url: 'http://104.43.252.217/',
        port: 80,
        db: 'bitnami_odoo',
        username: 'user@example.com',
        password: '850g6dHsX1TQ'
    });

    try {
    	await odoo.connect();
        let products = await odoo.execute_kw('product.wishlist', 'search_read', [[['type', '=', 'consu']]], {'fields': [ 'name', 'public_categ_ids'], 'limit': 5})
         // [[['is_company', '=', True]]], {'fields': ['name', 'country_id', 'comment'], 'limit': 5})
         // let products = await odoo.execute_kw('product.template', 'search_read', [[['type', '=', 'consu']]]);
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
	var odoo = new Odoo({
        url: 'http://104.43.252.217/',
        port: 80,
        db: 'bitnami_odoo',
        username: 'user@example.com',
        password: '850g6dHsX1TQ'
    });
    
    try {
	    await odoo.connect();
	    let id = await odoo.execute_kw('product.wishlist', 'create', [
	        { 'active': true, 'product_id': req.body.product_id, 'website_id': 1},
	    ]);
	    res.status(201).json({ id });

    } catch(e) {
		    console.error("Error when try connect Odoo XML-RPC.", e);
	}

}
