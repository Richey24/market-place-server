const Company = require('../model/Company')

const unitOfMeasure = async (odoo) => {
	try {
		await odoo.connect();
		console.log('Get unit of mesasure')
		let uom =  await odoo.execute_kw('uom.uom', 'search_read', [])
	    return { uom }
	} catch ( e ) {
		console.error('Error when trying to connect to odoo xml-rpc');
	}
}

const addProduct = async (  params ) => {
	
	console.log( params )
	try {
		await params.odoo.connect();
		let product = await params.odoo.execute_kw('product.template', 'create', [
			{
	    		base_unit_count: params.product.qty, 
	    		categ_id: params.product.category_id, 
	    		// product_type: 'consu', 
	    		name: params.product.name,
	    		// image: params.product.image,
	    		uom_name: params.product.uom_name,
	    		display_name: params.product.name,
	    		// product_variant_ids: 1,
	    		website_published: params.product.published
			}
		]);
		return await product
	} catch (e) {
		 console.error("Error when try connect Odoo XML-RPC.", e);
	}
}

module.exports = {
  addProduct,
  unitOfMeasure
};