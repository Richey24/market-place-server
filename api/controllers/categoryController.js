var Odoo = require('async-odoo-xmlrpc');

exports.getCategories = async ( req, res) => {

	console.log("GET /api/categories")
	var odoo = new Odoo({
        url: 'http://104.43.252.217/',
        port: 80,
        db: 'bitnami_odoo',
        username: 'user@example.com',
        password: '850g6dHsX1TQ'
    });

    try {
        await odoo.connect();
        console.log("Connect to Odoo XML-RPC is successed.");
        let categories = await odoo.execute_kw('product.public.category', 'search_read', [], 0, 1);
        res.status(201).json({ categories });
    } catch (e) {
        console.error('Error when trying to connect odoo xml-rpc', e)
    }
}

exports.categoryDetails = async (req, res ) => {}

exports.createCategory = async ( req, res) => {}