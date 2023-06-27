
const getFeaturedCategories = async ( params )  => {
	
	try { 
		await params.odoo.connect();
		let categories = await params.odoo.execute_kw('product.public.category', 'search_read',[
		   [['parent_id', '=', false]]
		   , ['name','id','parent_id', 'parent_path', 'child_id', 'display_name', 'product_tmpl_ids'
		   	  ]
		   , 0, 6 // offset, limit
		]);
		return await categories
	} catch (e) {
		console.error("Error when try connect to Odoo XML-RPC", e);
	}
}



module.exports = {
	getFeaturedCategories
}