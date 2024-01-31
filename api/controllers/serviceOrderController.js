const Service = require("../../model/Service");
const ServiceOrder = require("../../model/ServiceOrder");
const User = require("../../model/User");

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
               .populate({
                    path: "service",
                    populate: { path: "userId" },
               })
               .populate("customer");

          res.json({ orders, status: true });
     } catch (err) {
          res.status(500).json({ message: err.message });
     }
};

exports.getAllOrders = async (req, res) => {
     try {
          const orders = await ServiceOrder.find()
               .populate({
                    path: "service",
                    populate: { path: "userId" },
               })
               .populate("customer");

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

exports.getOneServiceOrder = async (req, res) => {
     const orderId = req.params.orderId;

     if (!orderId) {
          return res.status(400).json({ message: "Order ID is required", status: false });
     }

     try {
          const order = await ServiceOrder.findById(orderId).populate("service");

          if (!order) {
               return res.status(404).json({ message: "Service order not found", status: false });
          }

          res.status(200).json({ order, status: true });
     } catch (err) {
          res.status(500).json({ message: "Server error: " + err.message });
     }
};


exports.getOrderedServicesByVendors = async (req, res) => {
     try {
          let user = req.userData;
          if (!user) {
               return res.status(400).json({ message: "Send user id", status: false });
          }

          const services = await Service.find({ userId: user?._id }).exec();

          const orders = await ServiceOrder.find({
               service: { $in: services.map((service) => service._id) },
          }).populate("service");

          res.json({ orders, status: true });
     } catch (err) {
          res.status(500).json({ message: err.message });
     }
};

exports.addToWishlist = async (req, res) => {
     const { userId, serviceId } = req.body;

     try {
          const user = await User.findById(userId);
          if (!user) {
               return res.status(404).json({ message: "User not found", status: false });
          }

          // Check if the service is already in the user's wishlist
          const isServiceInWishlist = user.serviceWishlist.includes(serviceId);
          if (isServiceInWishlist) {
               return res
                    .status(200)
                    .json({ message: "Service already in wishlist", status: false });
          }

          // If service is not in wishlist, add it
          user.serviceWishlist.push(serviceId);
          await user.save();
          res.status(200).json({ message: "Service added to wishlist", status: true });
     } catch (err) {
          res.status(500).json({
               message: "An error occurred while adding to wishlist",
               status: false,
               error: err.message,
          });
     }
};

exports.getWishlist = async (req, res) => {
     try {
          const userId = req.params.userId;

          const user = await User.findById(userId).populate("serviceWishlist").exec();

          if (!user) {
               return res.status(404).send("User not found");
          }

          res.json({ wishlist: user.serviceWishlist, status: true });
     } catch (err) {
          res.status(500).send(err.message);
     }
};
