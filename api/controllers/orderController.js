// var Odoo = require("async-odoo-xmlrpc");
const { sendPurchaseEmail, sendSalesReport } = require("../../config/helpers");
const Odoo = require("../../config/odoo.connection");
const User = require("../../model/User");
const { addOrder } = require("../../services/order.service");
const { getProductById } = require("../../services/product.service");

exports.getOrdersByCompanyId = async (req, res) => {
     console.log("GET /api/orders");
     // let user = req.userData;
     const companyId = +req.params.companyId;
     // console.log("user", user);
     try {
          await Odoo.connect();
          const orderIds = await Odoo.execute_kw(
               "sale.order",
               "search",
               [[["company_id", "=", companyId]]],
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

          res.status(201).json({ orders: ordersWithDetails, status: true });
     } catch (error) {
          console.error("Error when try connect Odoo XML-RPC.", error);
          res.status(400).json({ error, status: false });
     }
};

exports.getOrdersByPartner = async (req, res) => {
     // res.status(200).json({ order: "dddff", status: true });
     try {
          await Odoo.connect();

          const partnerId = +req.params?.partner_id;
          const orderIds = await Odoo.execute_kw("sale.order", "search", [
               [
                    ["partner_id", "=", partnerId],
                    ["state", "=", "draft"],
               ],
          ]);

          if (orderIds.length === 0) {
               return res.status(404).json({ message: "Order not found", status: false });
          }

          const [firstOrderId] = orderIds;
          const [order] = await Odoo.execute_kw("sale.order", "read", [
               [firstOrderId],
               [
                    "id",
                    "partner_id",
                    "order_line",
                    "company_id",
                    "name",
                    "state",
                    "amount_total",
                    "date_order",
                    "x_tracking_id",
                    "x_carrier",
               ],
          ]);

          const orderLines = await Odoo.execute_kw("sale.order.line", "search_read", [
               [["order_id", "=", order.id]],
               [
                    "id",
                    "order_id",
                    "company_id",
                    "currency_id",
                    "order_partner_id",
                    "state",
                    "product_id",
                    "product_template_id",
                    "product_custom_attribute_value_ids",
                    "name",
                    "product_uom_qty",
                    "price_unit",
                    "discount",
                    "price_subtotal",
                    "warehouse_id",
                    "qty_to_deliver",
                    "x_variant",
                    "x_images",
                    // "product_qty",
               ],
          ]);
          order.order_lines = orderLines;

          // Map product details (images) back to order lines
          order.order_lines.forEach(async (line) => {
               if (line.x_images) line.x_images = JSON.parse(line.x_images);
               else if (!line?.x_images) {
                    const productData = await Odoo.execute_kw("product.template", "search_read", [
                         [["id", "=", line?.product_template_id?.[0]]],
                         ["x_images"],
                    ]);
                    line.x_images = JSON.parse(productData[0]?.x_images);
               }
          });

          return res.status(200).json({ order, status: true });
     } catch (error) {
          console.error("Error when trying to connect to Odoo XML-RPC.", error);
          res.status(400).json({ error, status: false });
     }
};

exports.getOrderHistoryByPartner = async (req, res) => {
     console.log("GET /api/orders");

     try {
          await Odoo.connect();

          const partnerId = +req.params?.partner_id;

          const orderIds = await Odoo.execute_kw(
               "sale.order",
               "search",
               [
                    [
                         ["partner_id", "=", partnerId],
                         // ["state", "=", "draft"],
                    ],
               ],
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

          return res.status(201).json({ orders: ordersWithDetails, status: true });
     } catch (error) {
          console.error("Error when try connect Odoo XML-RPC.", error);
          res.status(400).json({ error, status: false });
     }
};

exports.createOrder = async (req, res) => {
     try {
          await Odoo.connect();

          const productData = req.body.products;
          const partner_id = +req.body.partner_id;
          const companyId = req.body.companyId;

          const orderLines = productData.map(
               ({ productId, qty, price_unit, product_attribute, x_images }) => [
                    0,
                    0,
                    {
                         product_id: productId,
                         product_uom_qty: qty,
                         price_unit,
                         x_images: x_images ? JSON.stringify(x_images) : null,
                         ...(product_attribute && {
                              x_variant: JSON.stringify(product_attribute),
                         }),
                    },
               ],
          );

          // console.log("orderLines", orderLines);
          // Ensure the products belong to the same company
          // Update the products' company to match the sale order's company
          const productIds = productData.map(({ productId }) => productId);
          await Odoo.execute_kw("product.product", "write", [
               productIds,
               { company_id: companyId },
          ]);

          const orderData = {
               partner_id,
               company_id: companyId,
               order_line: orderLines,
          };

          // console.log("orderData", orderData);
          const orderId = await Odoo.execute_kw("sale.order", "create", [orderData]);
          console.log("Order created successfully. Order ID:", orderId);

          // const items = productData.map(({ productId, qty, price_unit }) => ({
          //      name: productId,
          //      price: price_unit,
          //      quantity: qty,
          // }));
          const items = await Promise.all(
               productData.map(async ({ productId, qty, price_unit }) => {
                    // Get product details using getProductById
                    const productDetails = await getProductById(productId);
                    // Extract product name from product details
                    const productName = productDetails.display_name || productId;
                    return {
                         name: productName,
                         price: price_unit,
                         quantity: qty,
                    };
               }),
          );
          const orderDetails = {
               orderId,
               items,
          };
          sendSalesReport(companyId, orderDetails);

          return res.status(201).json({ orderId, status: true });
     } catch (error) {
          console.log("Error", error);
          res.status(400).json({ error, status: false });
     }
};

exports.getOrderById = async (req, res) => {
     try {
          await Odoo.connect();
          const orderId = +req.params.orderId;

          // Fetch the order data by calling the 'sale.order' model and 'read' method with the order ID.
          // const orderData = await Odoo.execute_kw("sale.order", "read", [[["id", "=", orderId]]]);
          // console.log("orderData", orderData);

          const orders = await Odoo.execute_kw("sale.order", "read", [
               orderId,
               [
                    "id",
                    "partner_id",
                    "order_line",
                    "company_id",
                    "name",
                    "state",
                    "amount_total",
                    "date_order",
                    "partner_id",
                    "partner_shipping_id",
                    // "shipping_address_field1",
                    // "shipping_address",
                    // "delivery_method",
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
          const orderLines = ordersWithDetails[0]?.order_lines || [];

          const productIds = orderLines.map((id) => id?.product_template_id?.[0]).filter(Boolean);

          const productDetailsPromises = productIds.map((id) => getProductById(id));
          const productDetails = await Promise.all(productDetailsPromises);
          const images = productDetails.flatMap(
               (info) => info?.map((data) => data?.x_images) || [],
          );
          const updatedOrderLines = orderLines.map((orderLine, index) => {
               const imageIndex = index % images.length; // Calculate index to loop through images array
               return {
                    ...orderLine,
                    x_images: JSON.parse(images[imageIndex]), // Assign corresponding array of images to x_images field
               };
          });
          const updatedOrder = { ...ordersWithDetails[0], order_lines: updatedOrderLines };
          console.log(updatedOrder);
          if (orders.length > 0) {
               return res.status(200).json({ order: [updatedOrder], status: true });
          } else {
               return res.status(404).json({ message: "Order not found", status: false });
          }
     } catch (error) {
          // Handle any errors that may occur during the process.
          console.log("Error", error);
          res.status(500).json({ error, status: false });
     }
};

exports.addProductToOrder = async (req, res) => {
     try {
          await Odoo.connect();

          const orderId = req.body.orderId;
          const productId = req.body.productId;
          const qty = req.body.qty;
          const companyId = req.body.companyId;
          const x_images = req.body?.x_images;

          await Odoo.execute_kw("product.product", "write", [productId, { company_id: companyId }]);

          const orderLineId = await Odoo.execute_kw("sale.order.line", "create", [
               {
                    order_id: orderId,
                    product_id: productId,
                    product_uom_qty: qty,
                    company_id: companyId,
                    price_unit: req.body.price_unit,
                    x_images: x_images ? JSON.stringify(x_images) : null,
                    ...(req.body.product_attribute && {
                         x_variant: JSON.stringify(req.body.product_attribute),
                    }),
               },
          ]);

          return res.status(201).json({ orderId, orderLineId, status: true });
     } catch (error) {
          console.log("Error", error);
          res.status(400).json({ error, status: false });
     }
};

exports.removeProductFromOrderLine = async (req, res) => {
     try {
          await Odoo.connect();

          const orderLineIdToRemove = +req.params.id; // Replace with the actual order line ID to remove
          // Delete the order line associated with the product
          const result = await Odoo.execute_kw("sale.order.line", "unlink", [
               [orderLineIdToRemove],
          ]);

          if (result) {
               console.log("Order line removed successfully.");
               res.status(200).json({ status: true, message: "Order line removed successfully." });
          } else {
               console.error("Failed to remove order line.");
               res.status(500).json({ status: false, message: "Failed to remove order line." });
          }
     } catch (error) {
          console.error("Error when trying to connect to Odoo XML-RPC.", error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.updateProductToOrderLine = async (req, res) => {
     try {
          await Odoo.connect();

          const orderLineIdToUpdate = +req.params.id; // Replace with the actual order line ID to update
          const newQuantity = req.body.qty; // Replace with the new quantity for the product

          // Update the product quantity for the order line
          const result = await Odoo.execute_kw("sale.order.line", "write", [
               [orderLineIdToUpdate],
               { product_uom_qty: +newQuantity },
          ]);

          console.log("result", result, req.body.qty);

          if (result) {
               console.log("Product quantity updated successfully.");
               res.status(200).json({
                    status: true,
                    message: "Product quantity updated successfully.",
               });
          } else {
               console.error("Failed to update product quantity.");
               res.status(500).json({
                    status: false,
                    message: "Failed to update product quantity.",
               });
          }
     } catch (error) {
          console.error("Error when trying to connect to Odoo XML-RPC.", error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.changeOrderStatus = async (req, res) => {
     try {
          const { orderId, newStatus } = req.body;

          if (!orderId || !newStatus) {
               return res.status(400).json({ error: "Invalid input data", status: false });
          }

          // Connect to Odoo
          await Odoo.connect();

          // Update the order status
          const result = await Odoo.execute_kw("sale.order", "write", [
               [+orderId],
               { state: newStatus },
          ]);

          if (result) {
               console.log("Order status updated successfully. Order ID:", orderId);
               return res
                    .status(200)
                    .json({ status: true, message: "Order status updated successfully." });
          } else {
               console.error("Failed to update order status.");
               return res
                    .status(500)
                    .json({ status: false, message: "Failed to update order status." });
          }
     } catch (error) {
          console.error("Error changing order status:", error.message);
          return res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.addDeliveryDetailsToOrder = async (req, res) => {
     try {
          const { orderId, deliveryPartnerId } = req.body;

          if (!orderId || !deliveryPartnerId) {
               return res.status(400).json({ error: "Invalid input data", status: false });
          }

          // Connect to Odoo
          await Odoo.connect();

          // Update the order's partner_shipping_id to set the delivery details
          const result = await Odoo.execute_kw("sale.order", "write", [
               [+orderId],
               { partner_shipping_id: +deliveryPartnerId },
          ]);

          if (result) {
               console.log("Delivery details added to the order successfully. Order ID:", orderId);
               return res.status(200).json({
                    status: true,
                    message: "Delivery details added to the order successfully.",
               });
          } else {
               console.error("Failed to update delivery details for the order.");
               return res.status(500).json({
                    status: false,
                    message: "Failed to update delivery details for the order.",
               });
          }
     } catch (error) {
          console.error("Error adding delivery details to the order:", error);
          return res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.updateOrderTrackingId = async (req, res) => {
     console.log("POST /api/updateOrderTrackingId");

     try {
          await Odoo.connect();

          const orderId = req.body.orderId; // Assuming the order ID is sent in the request body
          const trackingId = req.body.trackingId; // Assuming the new tracking ID is sent in the request body

          // Check if orderId and trackingId are provided
          if (!orderId || !trackingId) {
               return res
                    .status(400)
                    .json({ error: "Order ID and tracking ID are required.", status: false });
          }

          // Update order with the new tracking ID
          const updatedOrder = await Odoo.execute_kw("sale.order", "write", [
               [orderId],
               {
                    x_tracking_id: trackingId,
               },
          ]);

          if (updatedOrder) {
               res.status(200).json({
                    message: "Order tracking ID updated successfully.",
                    status: true,
               });
          } else {
               res.status(404).json({ error: "Order not found.", status: false });
          }
     } catch (error) {
          console.error("Error when trying to connect Odoo XML-RPC.", error);
          res.status(500).json({ error, status: false });
     }
};

exports.updateOrderCarrier = async (req, res) => {
     console.log("POST /api/updateOrderTrackingId");

     try {
          await Odoo.connect();

          const orderId = +req.body.orderId; // Assuming the order ID is sent in the request body
          const carrier = req.body.carrier; // Assuming the new tracking ID is sent in the request body

          // Check if orderId and trackingId are provided
          if (!orderId || !carrier) {
               return res
                    .status(400)
                    .json({ error: "Order ID and tracking ID are required.", status: false });
          }

          // Update order with the new tracking ID
          const updatedOrder = await Odoo.execute_kw("sale.order", "write", [
               [orderId],
               {
                    x_carrier: carrier,
               },
          ]);

          if (updatedOrder) {
               res.status(200).json({
                    message: "Order Carrier updated successfully.",
                    status: true,
               });
          } else {
               res.status(404).json({ error: "Order not found.", status: false });
          }
     } catch (error) {
          console.error("Error when trying to connect Odoo XML-RPC.", error);
          res.status(500).json({ error, status: false });
     }
};

exports.getOrderAddress = async (req, res) => {
     try {
          const { partnerID, addressID } = req.body;
          if (!partnerID || !addressID) {
               return res.status(400).json({ message: "send address id" });
          }
          await Odoo.connect();
          const partnerAddresses = await Odoo.execute_kw("res.partner", "search_read", [
               [["parent_id", "=", partnerID]],
               [
                    "name",
                    "street",
                    "city",
                    "zip",
                    "country_id",
                    "state_id",
                    "type",
                    "phone",
                    "email",
               ], // Fields you want to retrieve
          ]);
          const shippingAddress = partnerAddresses.find((add) => add.id === addressID);
          res.status(200).json(shippingAddress);
     } catch (error) {
          console.error("Error when trying to connect Odoo XML-RPC.", error);
          res.status(500).json({ error, status: false });
     }
};
