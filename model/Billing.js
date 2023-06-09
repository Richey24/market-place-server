const mongoose = require("mongoose");

const billingSchema = mongoose.Schema({

	firstname: {
		type: String,
		required: [ true, "Please include first name"]
	},

	lastname: {
		type: String,
		required: [ true, "Please include last name"]
	},
	
	company: {
		type: String
	},

	country: {
		type: String,
		required: [true, 'Please include your country']
	},

	state: {
		type: String,
		required: [true, 'Please include you country state']
	},

	city: {
		type: String,
		required: [true, 'Please include your city']
	},

	street: {
		type: String,
		required: [true, 'Please include your street address']
	},

	zipcode: {
		type: Number,
		required: [true, 'Please include your zipcode']
	},

	phone: {
		type: String,
	},

	email: {
		type: String,
		required: [ true, "Please include emaill addresss"]
	},

	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}

})


const Billing = mongoose.model('Billing', billingSchema);
module.exports = Billing;