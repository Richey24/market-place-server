const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	company_id: {
		type: Number,
		required: [true, "Company id is required"]
	},
	company_name: {
		type: String,
		 required: [true, "Company Name is required"]
	},

	company_type: {
		type: String
	},

	subdomain: {
		type: String,
		required: [true, 'Subdomain is a required field']
	},

	theme: {
		type: Number,
		required: [true, "Theme is a required field"]
	},

	logo: {
		type: String
	},

	brandcolor: {
		type: Array,
		required: [true, 'brandcolor is a required feild']
	},

	subscription: {
		type: String
	},
	country: {
		type: String,
		required: [true, "country is a required field"]
	},
	city: {
		type: String,
		required: [true, "city is a required field"]
	},

	address: {
		type: String,
	},

	categories: {
		type: Array,
		required: false
	}
});

const Company = mongoose.model('Company', companySchema ) ;
module.exports = Company
