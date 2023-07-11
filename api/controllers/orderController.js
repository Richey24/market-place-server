var Odoo = require("async-odoo-xmlrpc");
const { addOrder } = require("../../services/order.service");

exports.getOrders = async (req, res) => {
     console.log("GET /api/orders");
     var odoo = new Odoo({
          url: "http://104.43.252.217/",
          port: 80,
          db: "bitnami_odoo",
          username: "user@example.com",
          password: "850g6dHsX1TQ",
     });

     try {
          await odoo.connect();
          console.log("Connect to Odoo XML-RPC - api/products");

          let products = await odoo.execute_kw(
               "order.template",
               "search_read",
               [[["type", "=", "consu"]]],
               { fields: ["name", "public_categ_ids"], limit: 5 },
          );
          res.status(201).json({ products });
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

exports.createOrder = async (req, res) => {
     let user = req.userData;

     var odoo = new Odoo({
          url: "http://104.43.252.217/",
          port: 80,
          db: "bitnami_odoo",
          username: "user@example.com",
          password: "850g6dHsX1TQ",
     });

     let params = {
          odoo: odoo,
          product: req.body,
          // user: user
     };

     const product = await addOrder(params);
     res.status(201).json({ product });
};
