
const getPromotion = async (params ) => {

	//TODO: need find out if i can call odoo connection once
	await params.odoo.connect();
	let promotion = await params.odoo.execute_kw('loyalty.program', 'search_read',[
		   [['company_id', '=', false]]
		   , ['name', 
		   	  'active', 
		   	  'applies_on', 
		   	  'available_on', 
		   	  'coupon_count', 
		   	  'coupon_count_display',
		   	  'coupon_ids',
		   	  'limit_usage',
		   	  'program_type',
		   	  'reward_ids',
		   	  'rule_ids',
		   	  'trigger',
		   	  'trigger_product_ids'
		   	  ]
		   , 0, 5 // offset, limit
		]);

	return promotion;
}

const addPromotion = async ( params ) => {

	const currentDate = new Date();

	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
	const day = String(currentDate.getDate()).padStart(2, '0');
	const formattedDate = `${year}-${month}-${day}`;

	try {
		await params.odoo.connect();
		let promotion = await params.odoo.execute_kw('loyalty.program', 'create', [ {
			applies_on: params.promo.applies_on,
			company_id: params.promo.company_id,
			// coupon_code: params.promo.coupon_code,
			create_date: formattedDate,
			currency_id: 1,
			display_name: params.promo.display_name,
			is_payment_program: params.promo.is_payment_program,
			limit_usage: params.promo.limit_usage,
			name: params.promo.program_name
		}]);
		return await promotion;
	}catch(e) {
		console.error('Error when try connect Odoo XML-RPC', e)
	}
}

const getPromotionRewards = async ( params ) => {

	try {
		await params.odoo.connect();
		let rewards = await params.odoo.execute_kw('loyalty.rewards', 'search_read',[
		   [['company_id', '=', false]]
		   , ['id', 'display_name', 'active', 'discount_max_amount', 'discount_mode',
		   	  'discount_product_category_id', 'discount_product_domain', 'discount_product_ids',
		   	  'reward_product_ids', 'reward_product_id', 'reward_type'
		   	]
		   , 0, 5 // offset, limit
		]);

		return await rewards;
	} catch(e) {
		console.error('Error when trying to connect to Odoo XML-RPC', e)
	}
}

const addPromotionRewards = async ( params ) => {
	try {
		await params.odoo.connect();
		let rewards = await params.odoo.execute_kw('loyalty.rewards', 'create', [
			{
				program_id: params.reward.program_id,
				description: params.reward.desc,
				discount: params.reward.discount,
				display_name: params.reward.display_name,
				reward_type: params.reward.reward_type,
				reward_product_qty: params.reward_product_qty
			}
		])

		return await rewards;
	} catch (e) {
		console.error('Error when try connect Odoo XML-RPC');
	}
}

/**
 * This funciton update promotion
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const updatePromotion = async ( params ) => {

	const currentDate = new Date();

	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
	const day = String(currentDate.getDate()).padStart(2, '0');

	const formattedDate = `${year}-${month}-${day}`;
	
	try {
		await params.odoo.connect();
		let promo = await params.odoo.execute_kw('loyalty.program', 'write', [
			[params.promo.id], 
				{
					applied_on: params.applied_on,
					company_id: params.company_id,
					coupon_code: params.coupon_code,
					create_date: formattedDate,
					currency_id: 1,
					display_name: params.display_name,
					is_payment_program: params.is_payment_program,
					limit_usage: params.limit_usage
				}
		]);
	} catch (e) {
		console.error('Error when trying to connect to Odoo ')
	}
}

const updatePromotionReward = async ( params ) => {}
const getPromotionCondition = async ( params ) => {}
const updatePromotionCondition = async ( params ) => {}
const deletePromotion = async ( params ) => {}

module.exports = {
 	getPromotion,
 	addPromotion,
 	updatePromotion,
 	deletePromotion
};