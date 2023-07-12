const Odoo = require('../config/odoo.connection');
const { getProductById } = require('./product.service');

/** Get Reward as a id */
const getRewardById = async (params) => {
    try {
        await Odoo.connect();
        let rewards = await Odoo.execute_kw('loyalty.reward', 'read', [params.id[0]]);
        return await rewards;
    } catch (e) {
        console.error('Error when try connect Odoo XML-RPC', e)
    }
}

/** This function get promotion rewards */
const getRewards = async (params) => {

    try {
        await Odoo.connect();
        let rewards = await Odoo.execute_kw('loyalty.reward', 'search_read', [
            [['company_id', '=', 1], ['discount_applicability', '=', 'specific']]
            , ['active', 'discount_product_ids', 'company_id', 'create_date', 'currency_id',
                'discount', 'discount_applicability', 'discount_line_product_id', 'discount_max_amount',
            'display_name', 'id', 'multi_product', 'program_type', 'point_name','reward_type', 'description', 'discount_mode']
            , 0, 5
        ])

        let promotions = await Promise.all(rewards.map( async (obj) => {
            
            let product = await getProductById(obj.discount_product_ids[0]);

            let data = {
                id: obj.id,
                product_id: obj.discount_product_ids,
                active: obj.active,
                display_name: obj.display_name,
                description: obj.description,
                product: product[0],
            }
            return data
        }))

        return await promotions;
    } catch (e) {
        console.error("Something went wrong with odoo external api", e)
    }

}

module.exports = {
    getRewardById,
    getRewards
}