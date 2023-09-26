var Odoo = require('async-odoo-xmlrpc');
const Company = require('../../model/Company');
const { getRewards } = require('../../services/reward.service')

const {
	addPromotion,
	updatePromotion,
	getPromotion,
	deletePromotion,
	getPromotionRewards,
	addPromotionRewards,
	getPromotionCondition,
	addPromotionConditon
} = require('../../services/promotion.service');
const Promotion = require('../../model/Promotion');


/**
 * This get Promotion by company id
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getPromotions = async (req, res) => {

	let company_id = req.params.company_id;

	const promos = await getPromotion(company_id)
	res.status(201).json({ promos })
}

/**
 * This function creates a promotion
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.createPromotions = async (req, res) => {
	try {
		if (!body.promoCode || !body.discountType || !body.discountValue || !body.target || !body.target_id) {
			return req.status(400).json({ message: "One or more parameter missing" })
		}
		const body = req.body
		const checkPromo = await Promotion.findOne({ promoCode: body.promoCode })
		if (checkPromo) {
			return res.status(419).json({ message: "promo code already exist" })
		}
		const promos = await Promotion.create(body);
		res.status(201).json(promos)
	} catch (error) {
		res.status(201).json({ message: "An error occured" })
	}
}

exports.updatePromotions = async (req, res) => {

	let user = req.userData;


	var odoo = new Odoo({
		url: 'http://104.43.252.217/', port: 80, db: 'bitnami_odoo',
		username: 'user@example.com',
		password: '850g6dHsX1TQ'
	});

	let params = {
		id: req.params.id,
		promo: req.body,
		user: user
	}

	const promos = await updatePromotion(params);
	res.status(201).json({ promos })
}

/**
 * this function create conditions
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.createCondition = async (req, res) => {

	let user = req.userData;
	let company_id = 1;


	let params = {
		condition: req.body,
		user: user
	}

	const condition = await addPromotionConditon(params);
	res.status(201).json({ condition })
}

/**
 * this function creates new rewards
 * @return {[type]} [description]
 */
exports.createRewards = async (req, res) => {

	let user = req.userData;
	let company_id = 1;


	var odoo = new Odoo({
		url: 'http://104.43.252.217/', port: 80, db: 'bitnami_odoo',
		username: 'user@example.com',
		password: '850g6dHsX1TQ'
	});

	console.log(req.body)

	let params = {
		odoo: odoo,
		reward: req.body,
		user: user
	}

	const rewards = await addPromotionRewards(params);
	res.status(201).json({ rewards })
}

/**
 * This function get rewards
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getRewards = async (req, res) => {

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

	const rewards = await getPromotionRewards(params);
	res.status(201).json({ rewards })
}

exports.getCondtions = async (req, res) => {

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

	const conditions = await getPromotionCondition(params);
	res.status(201).json({ conditions });
}

exports.getPromotionBanner = async (req, res) => {
	let user = req.userData;
	let company_id = 1;

	let params = {
		promo: req.body,
		user: user
	}

	const rewards = await getRewards(params);
	res.status(201).json(rewards);
}
