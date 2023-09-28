// var Odoo = require("async-odoo-xmlrpc");
const Odoo = require("../../config/odoo.connection");
const { addOrder } = require("../../services/order.service");

exports.getOrders = async (req, res) => {
     console.log("GET /api/orders");

     try {
          await Odoo.connect();
          const orderIds = await Odoo.execute_kw("sale.order", "search_read", [[]], {
               fields: ["name", "partner_id", "amount_total", "state", "order_line"],
          });
          // // Fetch order lines for each order
          // const ordersWithDetails = await Promise.all(
          //      orderIds.map(async (order) => {
          //           const orderLines = await Odoo.execute_kw(
          //                "sale.order.line",
          //                "search_read",
          //                [[["order_id", "=", order.id]]],
          //                {
          //                     fields: ["product_id", "product_uom_qty", "price_unit"],
          //                },
          //           );
          //           order.order_lines = orderLines;
          //           return order;
          //      }),
          // );
          res.status(201).json({ orderIds });
     } catch (error) {
          console.error("Error when try connect Odoo XML-RPC.", error);
          res.status(400).json({ error, status: false });
     }
};

exports.createOrder = async (req, res) => {
     try {
          let user = req.userData;
          await Odoo.connect();
          // const partnerData = await Odoo.execute_kw("res.partner", "search", [[]], {
          //      fields: ["name", "email", "phone", "company_id"],
          // });
          // console.log("partner", partnerData);
          const orderData = {
               partner_id: 163,
               company_id: 122,
               order_line: [[{ product_id: 232, product_uom_qty: 4 }]],
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
