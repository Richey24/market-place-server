

/** Get Reward as a id */
const getRewardById = async (params) => {
   
    let rewards = await params.odoo.execute_kw('loyalty.reward', 'read', [params.id[0]]);
    return await rewards;
}

/** This function get promotion rewards */
const getRewards = async (params) => {

    try {
        await params.odoo.connect();
        let rewards = await params.odoo.execute_kw('loyalty.reward', 'search_read', [
            [['company_id', '=', 1], ['discount_applicability', '=', 'specific']]
            , ['active', 'all_discount_product_ids', 'company_id', 'create_date', 'currency_id',
                'discount', 'discount_applicability', 'discount_line_product_id', 'discount_max_amount',
            'display_name', 'id', 'multi_product', 'program_type', 'point_name','reward_type', 'description', 'discount_mode']
            , 0, 5
        ])

        let promotions = await Promise.all(rewards.map(async (obj) => {

            let product = await params.odoo.execute_kw('product.template', 'read', [obj.all_discount_product_ids[0]])
            let data = {
                id: obj.id,
                active: obj.active,
                display_name: obj.display_name,
                description: obj.description,
                product: product[0]
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