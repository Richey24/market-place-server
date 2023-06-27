const Odoo = require('../../config/odoo.connection');
const { getFeaturedCategories } = require('../../services/category.service');

class CategoryController {
    async findAll(req, res) {
        try {
            await Odoo.connect()
            let categories = await Odoo.execute_kw('product.public.category', 'search_read', [[]],
                {
                    'fields': ['name'],
                    'order': 'id desc'
                },
            );
            console.log("desc");
            res.status(200).json(categories);
        } catch (e) {
            console.error('Error when trying to connect odoo xml-rpc', e)
        }
    }

    async findOne(req, res) {
        try {
            await Odoo.connect()
            let data = await Odoo.execute_kw('product.public.category', 'search_read', [
                [['id', '=', req.params.id]]
            ]);
            res.status(200).json(data);
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

                let data = await Odoo.execute_kw('product.public.category', 'search_read', [
                    [['id', '=', req.params.id]]
                ]);
                res.status(201).json(data);
            } else {
                res.status(500) //TODO: make this better

            }
        } catch (e) {
            console.error('Error when trying to connect odoo xml-rpc', e)
        }
    }

    async createSubCategory(req, res) {
        const { categoryId, name } = req.body

        try {
            await Odoo.connect()
            let id = await Odoo.execute_kw('product.public.category', 'create', [
                {
                    'name': name,
                    'parent_id': categoryId
                }
            ]);
            res.status(201).json({ id });
        } catch (e) {
            console.error('Error when trying to connect odoo xml-rpc', e)
        }
    }

  
}

module.exports = new CategoryController()