var Odoo = require('async-odoo-xmlrpc');
const Company = require('../../model/Company');
const { 
	addPromotion,
	updatePromotion,
	getPromotion,
	deletePromotion 
} = require('../../services/promotion.service');

/**
 * This get Promotion by company id
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getPromotions = async (req, res) => {
	
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

	const promos = await getPromotion(params)
	res.status(201).json({promos})
}

/**
 * This function creates a promotion
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.createPromotions = async (req, res) => {

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

	const promos = await addPromotion(params);
	res.status(201).json({promos})

}

exports.getRewards = async ( req, res) => {

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

	const rewards = await getReward(params);
	res.status(201).json({ rewards })
}