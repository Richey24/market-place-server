const { getRewardById } = require('./reward.service')
const Odoo = require('../config/odoo.connection');
/**
 * This function get all promotions
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getPromotion = async (params ) => {	
	console.log('..get promotionS')
	try {
		await Odoo.connect();
		
		let promotions = await Odoo.execute_kw('loyalty.program', 'search_read',[
			[['company_id', '=', 1]]
			, [ 'name',  'active', 'applies_on', 'available_on', 'coupon_count', 
				'coupon_count_display', 'coupon_ids', 'limit_usage', 'program_type',
				'reward_ids', 'rule_ids', 'trigger', 'trigger_product_ids'
				]
			, 0, 5 // offset, limit
		]);

		let loyality = await Promise.all(promotions.map(async (obj)  => {
			let data = {
				id: obj.id,
				name: obj.name,
				active: obj.active,
				applies_on: obj.applies_on,
				available_on: obj.available_on,
				coupon_count: obj.coupon_count,
				coupon_count_display: obj.coupon_count_display,
				coupon_ids: obj.coupon_ids,
				limit_usage: obj.limit_usage,
				program_type: obj.program_type,
				rewards_ids: obj.reward_ids,
				rule_id: obj.rule_id,
				rewards: await Odoo.execute_kw('loyalty.reward', 'read', [obj.reward_ids[0]])
			}
			console.log(data)
			return data;
		}))
		
		return await loyality;
	} catch (e) {
		console.error('Error when try connect Odoo XML-RPC', e)
	}

}

/**
 * This function creates promotion condition 
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const addPromotion = async ( params ) => {

	const currentDate = new Date();

	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
	const day = String(currentDate.getDate()).padStart(2, '0');
	const formattedDate = `${year}-${month}-${day}`;

	try {
		var odoo = await Odoo.connect();
		let promotion = await odoo.execute_kw('loyalty.program', 'create', [ {
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

/**
 * This function get all promotion rewards
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getPromotionRewards = async ( params ) => {

	try {
		var odoo = await Odoo.connect();
		let rewards = await odoo.execute_kw('loyalty.reward', 'search_read',[
		   [['company_id', '=', 1]]
		   , ['id', 'display_name', 'active', 'discount_max_amount', 'discount_mode',
		   	  'discount_product_category_id', 'discount_product_domain', 'discount_product_ids',
		   	  'reward_product_ids', 'reward_product_id', 'reward_type', 'company_id', 'program_id'
		   	]
		   , 0, 5 // offset, limit
		]);

		return await rewards;
	} catch(e) {
		console.error('Error when trying to connect to Odoo XML-RPC', e)
	}
}

/**
 * This function get all company promotions
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getPromotionCondition = async ( params ) => {

	try {
		var odoo = await Odoo.connect();
		let conditions = await odoo.execute_kw('loyalty.rule', 'search_read', [
			[['company_id', '=', 1]]
			,['id', 'display_name']
			, 0, 5 // offset, limit
		]);

		return await conditions;
	} catch (e) {
		console.error('Error when trying to connect to Odoo XML-RPC', e);
	}
}
/**
 * This service add Promotion reward
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const addPromotionRewards = async ( params ) => {
	try {
		var odoo = await Odoo.connect();
		let rewards = await odoo.execute_kw('loyalty.reward', 'create', [
			{
				description: params.reward.desc,
				discount: params.reward.discount,
				display_name: params.reward.display_name,
				reward_type: params.reward.reward_type,
				program_id: params.reward.program_id,
				reward_product_qty: params.reward_product_qty
			}
		])

		return await rewards;
	} catch (e) {
		console.error('Error when try connect Odoo XML-RPC', e);
	}
}

/**
 * This service add condition rule
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const addPromotionConditon = async ( params ) => {

	console.log(params);
	try {
		var odoo = await Odoo.connect();
		let conditions = await odoo.execute_kw('loyalty.rule', 'create', [
			{
				program_id: params.condition.program_id,
				program_ids: params.condition.program_ids,
				product_category_id: params.condition.product_category_id,
				minimum_qty: params.condition.minimum_qty,
				mode: params.condition.mode,
				program_type: params.condition.program_type,
				rewards_points_mode: params.condition.points_mode,
				minimum_amount_tax_mode: params.condition.minimum_amount_tax_mode,
				display_name: params.condition.display_name,
				minimum_amount: params.condition.minimum_amount 
			}
		]);

		return await conditions
	} catch (e ) {
		console.error('Something went wrong', e)
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
		var odoo = await Odoo.connect();
		let promo = await odoo.execute_kw('loyalty.program', 'write', [
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

		return promo
	} catch (e) {
		console.error('Error when trying to connect to Odoo ')
	}
}
const updatePromotionReward = async ( params ) => {}
const updatePromotionCondition = async ( params ) => {}
const deletePromotion = async ( params ) => {}

module.exports = {
 	getPromotion,
 	addPromotion,
 	updatePromotion,
 	deletePromotion,
 	getPromotionRewards,
 	getPromotionCondition,
 	addPromotionConditon,
 	addPromotionRewards
};