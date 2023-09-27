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
	try {
		let company_id = req.params.company_id;
		if (!company_id) {
			return res.status(400).json({ message: "Company ID is required" })
		}
		const promo = await Promotion.find({ company_id: company_id })
		if (!promo) {
			return res.status(400).json({ message: "No Promotion Found with this company ID" })
		}
		res.status(200).json(promo)
	} catch (error) {
		res.status(500).json({ message: "An error occured" })
	}
}

/**
 * This function creates a promotion
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.createPromotions = async (req, res) => {
	try {
		if (!body.promoCode || !body.discountType || !body.discountValue || !body.target || !body.target_id || !body.company_id) {
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
		res.status(500).json({ message: "An error occured" })
	}
}

exports.updatePromotions = async (req, res) => {
	try {

		const id = req.params.id
		const body = req.body
		if (!id) {
			return res.status(400).json({ message: "ID is required" })
		}
		await Promotion.findByIdAndUpdate(id, body)
		res.status(201).json({ message: "Updated Successfully" })
	} catch (error) {
		res.status(500).json({ message: "An error occured" })
	}
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
