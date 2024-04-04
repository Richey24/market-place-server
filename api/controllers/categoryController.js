const { getFeaturedCategories } = require("../../services/category.service");
const Odoo = require("../../config/odoo.connection");
const CompanyService = require("../../services/company.service");
const UserService = require("../../services/user.service");
const mainControllerModel = require("../../model/MainCategory");

class CategoryController {
     async findAll(req, res) {
          try {
               await Odoo.connect();

               let categories = await Odoo.execute_kw("product.public.category", "search_read", [
                    [],
               ]);

               console.log("heyyyyyy");
               res.status(200).json({ categories, status: true });
          } catch (e) {
               res.status(500).json({ error: e, status: false });
               // console.error("Error when trying to connect odoo xml-rpc", e);
          }
     }

     async getCategoriesByCompanyId(req, res) {
          try {
               await Odoo.connect();
               const company = await CompanyService.findById(req.params.companyId);
               console.log("company", company.categories);

               let categories = await Odoo.execute_kw(
                    "product.public.category",
                    "search_read",
                    [[["id", "in", company.categories]]],
                    {
                         fields: ["name"],
                         order: "id desc",
                    },
               );

               res.status(200).json({ categories, status: true });
          } catch (e) {
               res.status(500).json({ error: e, status: false });
               // console.error("Error when trying to connect odoo xml-rpc", e);
          }
     }

     async getComapnyCategoriesByName(req, res) {
          try {
               const { name } = req.body;
               await Odoo.connect();
               const company = await CompanyService.findById(req.params.companyId);
               console.log("company", company.categories);

               let categories = await Odoo.execute_kw(
                    "product.public.category",
                    "search_read",
                    [[["id", "in", company.categories]], ["id", "name"]],
                    {
                         fields: ["name"],
                         order: "id desc",
                    },
               );

               const category = categories.find((cat) => cat.name === name);

               res.status(200).json({ category, status: true });
          } catch (e) {
               res.status(500).json({ error: e, status: false });
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
               res.status(500).json(e);
               console.error("Error when trying to connect odoo xml-rpc", e);
          }
     }

     async create(req, res) {
          try {
               await Odoo.connect();
               const { name, categ_id } = req.body;
               const user = await UserService.findById(req.userData._id);
               let id;

               console.log("company", name, categ_id);
               if (name) {
                    id = await Odoo.execute_kw("product.public.category", "create", [
                         { name: name },
                    ]);
                    await CompanyService.updateCategories(user.company._id, id);
               } else if (categ_id) {
                    await CompanyService.updateCategories(user.company._id, categ_id);
               } else {
                    throw "Invalid Category";
               }

               res.status(201).json({ status: true, message: "Created Successfullly", id: id });
          } catch (e) {
               res.status(500).json(e);
               console.error("Error when trying to connect odoo xml-rpc", e);
          }
     }

     async createMultiple(req, res) {
          try {
               const { names } = req.body;
               console.log("names", names);
               // Assuming you have a way to extract the company ID from the request or user data
               const companyId = req?.userData?.company?._id || 1;

               await Odoo.connect();

               const createdCategories = [];

               for (const name of names) {
                    const id = await Odoo.execute_kw("product.public.category", "create", [
                         { name: name, parent_id: 1, company_id: 1 },
                    ]);
                    createdCategories.push(id);
               }

               // ... rest of your code ...

               res.status(201).json({ createdCategories, company: 1 });
          } catch (e) {
               res.status(500).json(e);
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
               res.status(500).json(e);
               console.error("Error when trying to connect odoo xml-rpc", e);
          }
     }

     async createSubCategory(req, res) {
          const { categoryId, name } = req.body;

          try {
               await Odoo.connect();
               let id = await Odoo.execute_kw("product.public.category", "create", [
                    {
                         name: name,
                         parent_id: categoryId,
                    },
               ]);

               const user = await UserService.findById(req.userData._id);
               await CompanyService.updateCategories(user.company._id, id);

               res.status(201).json({ id });
          } catch (e) {
               res.status(500).json(e);
               console.error("Error when trying to connect odoo xml-rpc", e);
          }
     }

     async fetchFeatureCategories(req, res) {
          console.log("../fetching feature categories");

          let user = req.userData;

          let params = {
               odoo: Odoo,
               promo: req.body,
               user: user,
          };

          const categories = await getFeaturedCategories(params);
          res.status(201).json({ categories });
     }

     async createMainController(req, res) {
          const category = await mainControllerModel.create({ name: req.body.name });

          res.status(200).json(category);
     }
}

module.exports = new CategoryController();
