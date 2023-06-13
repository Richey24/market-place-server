const User = require('../../model/User');
const Company = require('../../model/Company');
var Odoo = require('async-odoo-xmlrpc');


exports.getOnboarding = async (req, res) => {

	console.log('Post Request: Onboarding Users')
	console.log(req.body)

	const currentDate = new Date();

	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
	const day = String(currentDate.getDate()).padStart(2, '0');

	const formattedDate = `${year}-${month}-${day}`;

	// Onboarding params
	let date = formattedDate;
	let company_name = req.body.company_name;
	let company_type = req.body.company_type;
	let tenantname = req.body.domain
	let theme = req.body.theme;
	let brandcolor = req.body.colors;
	let subscription = req.body.subscription;

	//User Params
	let firstname = req.body.firstname;
	let lastname = req.body.lastname;
	let email = req.body.email;
	let role = 'vendor';
	let password = req.body.password;
	let country = req.body.country;
	let city = req.body.city;
	let state = req.body.state;
	let address1 = req.body.address;
	let phone = req.body.phone;


	try {
		await Odoo.connect();
		console.log("Connect to Odoo XML-RPC");

		let partner = await Odoo.execute_kw('res.partner', 'create', [
			{ is_company: true, is_published: true, is_public: true, name: company_name }
		]);

		let domain = req.body.domain + '.' + 'imarketplace.world'
		let company_id = await odoo.execute_kw("res.company", "create", [
			{
				'account_opening_date': date,
				'active': true,
				name: req.body.company_name,
				partner_id: partner,
				website: domain,
				email: req.body.email,
				phone: req.body.phone,
				currency_id: 1
			}
		]);

		const save_user = new User({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			role: 'vendor',
			password: req.body.password,

		});

		let data = await save_user.save();
		const token = await save_user.generateAuthToken();

		const save_company = new Company({
			user_id: data._id,
			company_id: company_id,
			company_name: company_name,
			company_type: company_type,
			subdomain: tenantname,
			theme: theme,
			phone: req.body.phone,
			logo: req.body.logo,
			brandcolor: brandcolor,
			subscription: subscription,
			country: req.body.country,
			city: req.body.city,
			state: req.body.state
		})

		let company_data = await save_company.save();

		res.status(201).json({ company: company_data, user: data })
	} catch (e) {
		console.error("Error when try connect Odoo XML-RPC.", e);
	}


}