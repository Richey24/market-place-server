const ServiceOrder = require("../../model/ServiceOrder");

// POST a new service order
exports.create = async (req, res) => {
     // Destructuring the request body to match the schema

     try {
          const { service, customer, price } = req.body;

          const newOrder = new ServiceOrder({
               service,
               customer,
               price,
          });

          const savedOrder = await newOrder.save();
          res.status(201).json({ savedOrder, status: true });
     } catch (err) {
          res.status(400).json({ message: err.message });
     }
};

exports.getCustomerOrders = async (req, res) => {
     try {
          const orders = await ServiceOrder.find({ customer: req.params.customerId })
               .populate("service")
               .populate("customer");

          res.json({ orders, status: true });
     } catch (err) {
          res.status(500).json({ message: err.message });
     }
};

exports.getAllOrders = async (req, res) => {
     try {
          const orders = await ServiceOrder.find().populate("service").populate("customer");

          res.json({ orders, status: true });
     } catch (err) {
          res.status(500).json({ message: err.message });
     }
};

exports.getOrderedServices = async (req, res) => {
     try {
          const customerId = req.params.customerId;
          const orders = await ServiceOrder.find({ customer: customerId }).populate("service");
          const services = orders.map((order) => order.service);

          res.json({ services, status: true });
     } catch (err) {
          res.status(500).json({ message: err.message });
     }
};
