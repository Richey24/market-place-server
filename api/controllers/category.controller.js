const Odoo = require('../../config/odoo.connection');

class CategoryController {
    async findAll(_, res) {
        try {
            await Odoo.connect()
            console.log("Connect to Odoo XML-RPC is successed.");
            let categories = await Odoo.execute_kw('product.public.category', 'search_read', [], 0, 8);
            res.status(200).json({ categories });
        } catch (e) {
            console.error('Error when trying to connect odoo xml-rpc', e)
        }
    }

    async findOne(req) {
        try {
            await Odoo.connect()
            let res = await Odoo.execute_kw('product.public.category', 'search_read', [
                [['id', '=', req.params.id]]
            ]);
            res.status(200).json({ res });
        } catch (e) {
            console.error('Error when trying to connect odoo xml-rpc', e)
        }
    }

    async create(req, res) {

        try {
            await Odoo.connect()
            let id = await Odoo.execute_kw('product.public.category', 'create', [
                { 'name': req.body.name }
            ]);
            res.status(201).json({ id });
        } catch (e) {
            console.error('Error when trying to connect odoo xml-rpc', e)
        }
    }

    async update(req, res) {
        const id = req.params.id

        try {
            await Odoo.connect()
            let resUpdate = await Odoo.execute_kw('product.public.category', 'write', [
                [id]
                , { 'name': req.body.name }
            ]);
            if (resUpdate) {

                let res = await Odoo.execute_kw('product.public.category', 'search_read', [
                    [['id', '=', req.params.id]]
                ]);
                res.status(201).json(res);
            } else {
                res.status(500) //TODO: make this better

            }
        } catch (e) {
            console.error('Error when trying to connect odoo xml-rpc', e)
        }
    }
}

module.exports = new CategoryController()