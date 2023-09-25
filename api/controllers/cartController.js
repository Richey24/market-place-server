const ShoppingCart = require("../../model/ShopingCart");

/** * This function retrieve the user shopping cart*/
exports.getCart = async (req, res) => {
     try {
          let user = req.params.userId;
          const cart = await ShoppingCart.find({ userId: user._id });
          if (cart && cart.length === 0) {
               return res.status(201).json({ data: null });
          }
          res.status(201).json({ data: cart });
     } catch (error) {
          res.status(400).json({ error, status: false });
     }
};

/*** This function creates a new shopping cart for the user */
exports.createCart = async (req, res) => {
     try {
          console.log("add to shopping cart");
          const shoppingCart = new ShoppingCart({
               userId: req.body.userId,
               companyId: req.body.companyId,
               items: [req.body.items],
          });
          let cart = await shoppingCart.save();
          res.status(201).json({ cart, status: true });
     } catch (error) {
          console.log(error);
          res.status(400).json({ error, status: false });
     }
};

exports.updateCart = async (req, res) => {};

exports.updateCartItem = async (req, res) => {
     await ShoppingCart.findByIdAndUpdate(
          req.body.cartId,
          {
               userId: req.body.userId,
               items: [req.body.items],
          },
          (err, data) => {
               if (err) {
                    return res.status(201).json({ message: "Something went wrong" });
               } else {
                    return res.status(201).json({ message: "Item Added", status: true });
               }
          },
     );
};

exports.addItemToCart = async (req, res) => {};

exports.deleteCart = async (req, res) => {};

exports.removeCartItem = async (req, res) => {};
