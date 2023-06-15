const User = require('../model/User');

/**
 * This function get customer by user company id
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getCustomer = async ( params ) => {
	let users = await User.find({ company_id: params.company_id, role: 'customer' )});
    return res.status(201).json({ users: users})
}

/**
 * This function get customer details by customer id
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getCustomerDetails = async ( params ) => {

	let user = await User.findById({params.id});

	try {
		params.odoo.connect();
		let details = params.odoo('e')
	}
}

const updateCustomer = async (params ) => {}

const deleteCustomer = async( params ) => {}