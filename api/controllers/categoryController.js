var Odoo = require('async-odoo-xmlrpc');
const { getFeaturedCategories } = require('../../services/category.service');

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

exports.fetchFeatureCategories = async ( req, res) => {

    console.log('../fetching feature categories')
    
    let user = req.userData;
    let company_id = 1;

    var odoo = new Odoo({
        url: 'http://104.43.252.217/', port: 80, db: 'bitnami_odoo',
        username: 'user@example.com',
        password: '850g6dHsX1TQ'
    });

    let params = {
        odoo: odoo,
        promo: req.body,
        user: user
    }

    const categories = await getFeaturedCategories(params)
    res.status(201).json(categories)

}

exports.categoryDetails = async (req, res ) => {}

exports.createCategory = async ( req, res) => {}