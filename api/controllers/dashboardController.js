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
          const mapRevenue = result?.map((re) => re.price_total);
          if (mapRevenue.length > 1) {
               const totalRevenue = mapRevenue.reduce((a, b) => a + b)
               res.status(201).json({
                    // result,
                    totalSales: result?.length,
                    totalRevenue,
                    averageOrderSpend: totalRevenue / result?.length,
                    status: true,
               });
          } else {
               res.status(200).json({ message: "No total revenue for the specified date range" })
          }

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
               return res.status(201).json({
                    // result,
                    // orders,
                    bestSellingProducts: [],
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

exports.getSalesByCategory = async (req, res) => {
     console.log("GET /api/getSalesReport");

     // let user = req.userData;
     // const companyId = +req.params.companyId;
     // console.log("user", user);
     try {
          await Odoo.connect();
          // Fetch products that need to be reordered
          const saleOrderLines = await Odoo.execute_kw("sale.order.line", "search_read", [
               [["company_id", "=", 122]],
               ["order_id", "product_id"],
          ]);

          // Extract product IDs
          const productIds = saleOrderLines.map((line) => line.product_id[0]);

          // Fetch product information, including the category
          const products = await Odoo.execute_kw("product.product", "read", [productIds], {
               fields: ["id", "name", "categ_id"],
          });

          // Group sales data by category and count sales
          const salesByCategory = products.reduce((result, product) => {
               const categoryKey = product.categ_id[0];
               if (!result[categoryKey]) {
                    result[categoryKey] = {
                         categoryId: categoryKey,
                         categoryName: product.categ_id[1], // Assuming the category name is in the second position of the tuple
                         salesCount: 0,
                    };
               }
               // Count sales only if the product is associated with a category
               if (product.categ_id) {
                    result[categoryKey].salesCount += 1;
               }
               return result;
          }, {});

          res.status(201).json({
               productsToReorder: Object.values(salesByCategory),
               // flatSalesData,
               saleOrderLines,
               // result: Object.values(salesByCategory),
               status: true,
          });
     } catch (error) {
          console.error("Error when try connect Odoo XML-RPC.", error);
          res.status(400).json({ error, status: false });
     }
};

exports.getAdminSalesReport = async (req, res) => {
     console.log("GET /api/getSalesReport");

     // let user = req.userData;
     // const companyId = +req.params.companyId;
     // console.log("user", user);
     try {
          await Odoo.connect();
          const startDate = req.params.startDate;
          const endDate = req.params.endDate;
          let system_Items_Sold_Count = 0;
          let system_Refunds_Amount = 0;

          const result = await Odoo.execute_kw("sale.report", "search_read", [
               ["&", ["state", "!=", "draft"], ["date", ">=", startDate], ["date", "<=", endDate]],
          ]);

          const totalRevenue = result?.map((re) => re.price_total).reduce((a, b) => a + b);

          // console.log("result", result);
          system_Items_Sold_Count = result
               ?.map((re) => re.product_uom_qty)
               .reduce((a, b) => a + b, 0);

          system_Refunds_Amount = result
               ?.filter((re) => re.refund_amount) // Adjust based on your actual field name
               .reduce((total, re) => total + re.refund_amount, 0);

          res.status(201).json({
               totalSales: result?.length,
               totalRevenue,
               itemsSoldCount: system_Items_Sold_Count,
               averageOrderSpend: totalRevenue / result?.length,
               totalRefundsAmount: system_Refunds_Amount,
               status: true,
          });
     } catch (error) {
          console.error("Error when try connect Odoo XML-RPC.", error);
          res.status(400).json({ error, status: false });
     }
};

exports.getAdminTopProducts = async (req, res) => {
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
