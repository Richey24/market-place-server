// var Odoo = require("async-odoo-xmlrpc");
const Odoo = require("../../config/odoo.connection");
const User = require("../../model/User");
const { addOrder } = require("../../services/order.service");
const { getProductById } = require("../../services/product.service");

exports.getSalesReport = async (req, res) => {
     console.log("GET /api/getSalesReport");

     // let user = req.userData;
     // const companyId = +req.params.companyId;
     // console.log("user", user);
     try {
          await Odoo.connect();
          const startDate = req.params.startDate;
          const endDate = req.params.endDate;

          const result = await Odoo.execute_kw("sale.report", "search_read", [
               [
                    "&",
                    ["company_id", "=", 122],
                    ["state", "!=", "draft"],
                    ["date", ">=", startDate],
                    ["date", "<=", endDate],
               ],
          ]);
          const totalRevenue = result?.map((re) => re.price_total).reduce((a, b) => a + b);

          res.status(201).json({
               // result,
               totalSales: result?.length,
               totalRevenue,
               averageOrderSpend: totalRevenue / result?.length,
               status: true,
          });
     } catch (error) {
          console.error("Error when try connect Odoo XML-RPC.", error);
          res.status(400).json({ error, status: false });
     }
};

exports.getBestSellingProducts = async (req, res) => {
     console.log("GET /api/getSalesReport");

     // let user = req.userData;
     // const companyId = +req.params.companyId;
     // console.log("user", user);
     try {
          await Odoo.connect();
          const startDate = req.params.startDate;
          const endDate = req.params.endDate;

          const orderIds = await Odoo.execute_kw(
               "sale.order",
               "search",
               [
                    [
                         ["company_id", "=", 122],
                         ["date_order", ">=", startDate],
                         ["date_order", "<=", endDate],
                    ],
               ],
               {
                    fields: ["name", "partner_id"],
               },
          );

          if (!orderIds.length) {
               res.status(201).json({
                    // result,
                    // orders,
                    products: [],
                    status: true,
               });
          }

          // const orderIds = orders.map((order) => order.id);
          const lines = await Odoo.execute_kw("sale.order.line", "search_read", [
               [["order_id", "in", orderIds]],
               ["product_uom_qty", "product_id", "price_total"],
          ]);

          // Create a map to store product quantities
          const productQuantities = new Map();

          // Iterate through sales order lines
          lines.forEach((line) => {
               const productId = line.product_id[0];
               const productName = line.product_id[1];
               const quantity = line.product_uom_qty;
               price = line.price_total;

               // Update product quantity in the map
               if (productQuantities.has(productId)) {
                    productQuantities.set(productId, {
                         quantity: productQuantities.get(productId)?.quantity + quantity,
                         productName,
                         price: productQuantities.get(productId)?.price + price,
                    });
               } else {
                    productQuantities.set(productId, { quantity, productName, price });
               }
          });

          // Convert the map to an array of objects
          const bestSellingProducts = Array.from(productQuantities, ([productId, details]) => ({
               productId,
               quantity: details?.quantity,
               productName: details.productName,
               price: details?.price,
          }));

          // Sort the array by quantity in descending order
          bestSellingProducts.sort((a, b) => b.quantity - a.quantity);

          res.status(201).json({
               bestSellingProducts,
               status: true,
          });
     } catch (error) {
          console.error("Error when try connect Odoo XML-RPC.", error);
          res.status(400).json({ error, status: false });
     }
};

exports.getOrdersByCustomers = async (req, res) => {
     console.log("GET /api/getSalesReport");

     // let user = req.userData;
     // const companyId = +req.params.companyId;
     // console.log("user", user);
     try {
          await Odoo.connect();
          const startDate = req.params.startDate;
          const endDate = req.params.endDate;

          const orders = await Odoo.execute_kw("sale.order", "search_read", [
               [
                    ["company_id", "=", 122],
                    ["date_order", ">=", startDate],
                    ["date_order", "<=", endDate],
               ],
               ["name", "partner_id"],
          ]);

          // Extract unique customer IDs from the orders
          const uniqueCustomerIds = [...new Set(orders.map((order) => order.partner_id[0]))];

          res.status(201).json({
               totalOrders: orders.length,
               noOfCustomers: uniqueCustomerIds.length,
               status: true,
          });
     } catch (error) {
          console.error("Error when try connect Odoo XML-RPC.", error);
          res.status(400).json({ error, status: false });
     }
};

exports.getRevenueByCustomers = async (req, res) => {
     console.log("GET /api/getSalesReport");

     // let user = req.userData;
     // const companyId = +req.params.companyId;
     // console.log("user", user);
     try {
          await Odoo.connect();
          const startDate = req.params.startDate;
          const endDate = req.params.endDate;

          const orderIds = await Odoo.execute_kw(
               "sale.order",
               "search",
               [[["state", "!=", "draft"]]],
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

          // Aggregate revenue per customer
          const customerRevenueMap = new Map();
          orders.forEach((order) => {
               const partnerId = order.partner_id[0];
               const name = order.partner_id[1];

               const revenue = order.amount_total;

               if (customerRevenueMap.has(partnerId)) {
                    customerRevenueMap.set(partnerId, {
                         revenue: customerRevenueMap.get(partnerId).revenue + revenue,
                         name,
                    });
               } else {
                    customerRevenueMap.set(partnerId, { revenue, name });
               }
          });

          // Convert the map to an array of objects
          const topCustomersByRevenue = Array.from(customerRevenueMap, ([partnerId, details]) => ({
               partnerId,
               revenue: details?.revenue,
               name: details?.name,
          }));

          // Sort the array by revenue in descending order
          topCustomersByRevenue.sort((a, b) => b.revenue - a.revenue);

          res.status(201).json({
               topCustomersByRevenue,
               status: true,
          });
     } catch (error) {
          console.error("Error when try connect Odoo XML-RPC.", error);
          res.status(400).json({ error, status: false });
     }
};

exports.getRevenueByCustomers = async (req, res) => {
     console.log("GET /api/getSalesReport");

     // let user = req.userData;
     // const companyId = +req.params.companyId;
     // console.log("user", user);
     try {
          await Odoo.connect();
          // Fetch products that need to be reordered
          const productsToReorder = await Odoo.execute_kw("product.product", "search_read", [
               [["product_uom_qty", "<=", 0]],
               // ["name", "product_uom_qty", "virtual_available"],
          ]);


          res.status(201).json({
               productsToReorder,
               status: true,
          });
     } catch (error) {
          console.error("Error when try connect Odoo XML-RPC.", error);
          res.status(400).json({ error, status: false });
     }
};