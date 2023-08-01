const { getFeaturedCategories } = require("../../services/category.service");
const Odoo = require("../../config/odoo.connection");
const CompanyService = require("../../services/company.service");
const UserService = require("../../services/user.service");
const mainControllerModel = require("../../model/MainCategory");

class CategoryController {
     // async findAll(req, res) {
     //     try {
     //         await Odoo.connect()
     //         const company = await CompanyService.findById(req.params.companyId)
     //         let categories = await Odoo.execute_kw('product.public.category', 'search_read', [[['id', 'in', company.categories]]],
     //             {
     //                 'fields': ['name'],
     //                 'order': 'id desc'
     //             },
     //         );

     //         res.status(200).json(categories);
     //     } catch (e) {
     //         console.error('Error when trying to connect odoo xml-rpc', e)
     //     }
     // }

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

exports.findOne = async (req, res) => {
     try {
          await Odoo.connect();
          let data = await Odoo.execute_kw("product.public.category", "search_read", [
               [["id", "=", req.params.id]],
          ]);
          res.status(200).json(data);
     } catch (e) {
          res.status(400).json({ error: e });
          console.error("Error when trying to connect odoo xml-rpc", e);
     }
};

exports.create = async (req, res) => {
     try {
          const { name } = req.body;
          console.log("log1");
          await Odoo.connect();
          let id = await Odoo.execute_kw("product.public.category", "create", [{ name: name }]);
          console.log("log2");

          const user = await UserService.findById(req.userData._id);
          console.log("log3");

          const company = await CompanyService.updateCategories(user.company._id, id);
          console.log("log34");

          res.status(201).json({ id, company });
     } catch (e) {
          res.status(400).json({ error: e });
          console.error("Error when trying to connect odoo xml-rpc", e);
     }
};

exports.update = async (req, res) => {
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
          console.error("Error when trying to connect odoo xml-rpc", e);
     }
};

exports.createSubCategory = async (req, res) => {
     const { categoryId, name } = req.body;

     try {
          await Odoo.connect();
          let id = await Odoo.execute_kw("product.public.category", "create", [
               {
                    name: name,
                    parent_id: categoryId,
               },
          ]);
          res.status(201).json({ id });
     } catch (e) {
          res.status(400).json({ error: e });
          console.error("Error when trying to connect odoo xml-rpc", e);
     }
};

exports.findAll = async (req, res) => {
     try {
          console.log("../fetching categories");

          let user = req.userData;
          let company_id = 1;

          // var odoo = new Odoo({
          //      url: "http://104.43.252.217/",
          //      port: 80,
          //      db: "bitnami_odoo",
          //      username: "user@example.com",
          //      password: "850g6dHsX1TQ",
          // });

          console.log(Odoo);

          let params = {
               odoo: Odoo,
               promo: req.body,
               user: user,
          };

          const categories = await getFeaturedCategories(params);
          res.status(201).json(categories);
     } catch (error) {
          res.status(400).json({ error });
          console.error("Error when trying to connect odoo xml-rpc", error);
     }
};

exports.fetchFeatureCategories = async (req, res) => {
     console.log("../fetching feature categories");

     let user = req.userData;
     let company_id = 1;

     var odoo = new Odoo({
          url: "http://104.43.252.217/",
          port: 80,
          db: "bitnami_odoo",
          username: "user@example.com",
          password: "850g6dHsX1TQ",
     });

     let params = {
          odoo: odoo,
          promo: req.body,
          user: user,
     };

     const categories = await getFeaturedCategories(params);
     res.status(201).json(categories);
};

exports.categoryDetails = async (req, res) => { };

exports.createCategory = async (req, res) => { };
