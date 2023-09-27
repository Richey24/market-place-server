// var Odoo = require("async-odoo-xmlrpc");
const Odoo = require("../../config/odoo.connection");
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
     try {
          let user = req.userData;
          await Odoo.connect();
          const partnerData = await Odoo.execute_kw("res.partner", "search", [[]], {
               fields: ["name", "email", "phone", "company_id"],
          });
          console.log("partner", partnerData);
          const orderData = {
               partner_id: 162,
               company_id: 122,
               order_line: [[0, 0, { product_id: 232, product_uom_qty: 4 }]],
          };

          const orderId = await Odoo.execute_kw("sale.order", "create", [orderData]);
          console.log("Order created successfully. Order ID:", orderId);

          // const product = await addOrder(params);
          res.status(201).json({ orderId, status: true });
     } catch (error) {
          console.log("error", error);
          res.status(400).json({ error, status: false });
     }
};
