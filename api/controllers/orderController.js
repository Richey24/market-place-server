// var Odoo = require("async-odoo-xmlrpc");
const Odoo = require("../../config/odoo.connection");
const { addOrder } = require("../../services/order.service");

exports.getOrders = async (req, res) => {
     console.log("GET /api/orders");
     let user = req.userData;
     console.log("userData", user);
     const partnerId = 163;

     try {
          await Odoo.connect();
          const orderIds = await Odoo.execute_kw(
               "sale.order",
               "search",
               [[["partner_id", "=", partnerId]]],
               {
                    fields: ["name", "partner_id"],
               },
          );
          const orders = await Odoo.execute_kw("sale.order", "read", [
               orderIds,
               [
                    "id",
                    "partner_id",
                    "order_line",
                    "company_id",
                    "name",
                    "state",
                    "amount_total",
                    "date_order",
               ],
          ]);
          const ordersWithDetails = await Promise.all(
               orders.map(async (order) => {
                    const orderLines = await Odoo.execute_kw(
                         "sale.order.line",
                         "search_read",
                         [[["order_id", "=", order.id]]],
                         {
                              fields: ["product_id", "product_uom_qty", "price_unit"],
                         },
                    );
                    order.order_lines = orderLines;
                    return order;
               }),
          );
          // const orderLineId = await Odoo.execute_kw("sale.order.line", "create", [
          //      {
          //           order_id: 13,
          //           product_id: 232,
          //           product_uom_qty: 4,
          //           company_id: 122,
          //           price_unit: 120000,
          //      },
          // ]);
          // const product = await Odoo.execute_kw("product.product", "write", [
          //      [232],
          //      { company_id: 122 },
          // ]);
          // Display the list of all fields and their properties
          // console.log("Fields for sale.order:", fieldsInfo);
          res.status(201).json({ orders: ordersWithDetails, status: true });
     } catch (error) {
          console.error("Error when try connect Odoo XML-RPC.", error);
          res.status(400).json({ error, status: false });
     }
};

exports.createOrder = async (req, res) => {
     try {
          const user = req.userData;
          await Odoo.connect();

          const productData = req.body.products; // Assuming req.body.products is an array of product IDs and quantities
          const orderLines = productData.map(({ productId, quantity }) => [
               0,
               0,
               { product_id: productId, product_uom_qty: quantity },
          ]);

          // Ensure the products belong to the same company
          // Update the products' company to match the sale order's company
          const productIds = productData.map(({ productId }) => productId);
          await Odoo.execute_kw("product.product", "write", [productIds, { company_id: 122 }]);

          const orderData = {
               partner_id: 163,
               company_id: 122,
               order_line: orderLines,
          };

          const orderId = await Odoo.execute_kw("sale.order", "create", [orderData]);
          console.log("Order created successfully. Order ID:", orderId);

          res.status(201).json({ orderId, status: true });
     } catch (error) {
          console.log("Error", error);
          res.status(400).json({ error, status: false });
     }
};
