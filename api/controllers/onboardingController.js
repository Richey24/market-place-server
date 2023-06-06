const User = require('../../model/User');
const Companies = require('../../model/Company');

exports.getOnboarding = async (req, res) => {

	console.log('Post Request: Onboarding Users')
	console.table(req.table);

	// Onboarding params
	let date = new Date.now();
	let company_name = req.body.company_name;
	let company_typen = req.body.company_typen;

	//User Params
	let firstname = req.body.firstname;
	let lastname = req.body.lastname;
	let email = req.body.email


}