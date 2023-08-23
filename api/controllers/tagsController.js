const { getFeaturedCategories } = require("../../services/category.service");
const Odoo = require("../../config/odoo.connection");
const CompanyService = require("../../services/company.service");
const UserService = require("../../services/user.service");
const mainControllerModel = require("../../model/MainCategory");

class TagsController {
     async findAll(req, res) {
          try {
               await Odoo.connect();
               // const company = await CompanyService.findById(req.params.companyId);

               // Fetch all product tags
               const tagIds = await Odoo.execute_kw("product.tag", "search", [[]]);

               const tags = await Odoo.execute_kw("product.tag", "read", [tagIds, ["id", "name"]]);

               res.status(200).json({ tags, status: true });
          } catch (e) {
               res.status(500).json({ error: e, status: false });
               console.error("Error when trying to connect odoo xml-rpc", e);
          }
     }

     async findOne(req, res) {
          try {
               await Odoo.connect();
               let data = await Odoo.execute_kw("product.public.category", "search_read", [
                    [["id", "=", req.params.id]],
               ]);
               res.status(200).json(data);
          } catch (e) {
               res.status(500).json({ error: e, status: false });
               console.error("Error when trying to connect odoo xml-rpc", e);
          }
     }

     async create(req, res) {
          try {
               const { name, companyId } = req.body;
               console.log("tabnmae", name);
               await Odoo.connect();
               const newTag = await Odoo.execute_kw("product.tag", "create", [{ name }]);
               res.status(201).json({ newTag, status: true });
          } catch (e) {
               res.status(500).json({ error: e, status: false });
               console.error("Error when trying to connect odoo xml-rpc", e);
          }
     }

     async update(req, res) {
          const id = req.params.id;

          try {
               await Odoo.connect();
               let resUpdate = await Odoo.execute_kw("product.public.category", "write", [
                    [id],
                    { name: req.body.name },
               ]);
               if (resUpdate) {
                    let data = await Odoo.execute_kw("product.public.category", "search_read", [
                         [["id", "=", req.params.id]],
                    ]);
                    res.status(201).json(data);
               } else {
                    res.status(500); //TODO: make this better
               }
          } catch (e) {
               res.status(500).json({ error: e, status: false });
               console.error("Error when trying to connect odoo xml-rpc", e);
          }
     }
     async delete(req, res) {
          const tagId = req.params.id;

          try {
               await Odoo.connect();
               await Odoo.execute_kw("product.tag", "unlink", [[tagId]]);
               res.status(201).json({ tagId, status: true });
          } catch (e) {
               res.status(500).json({ error: e, status: false });
               console.error("Error when trying to connect odoo xml-rpc", e);
          }
     }
}

module.exports = new TagsController();
