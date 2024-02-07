const mongoose = require("mongoose");

// const items = [{ name: "Product1", price: 80, quantity: 4 }];
// {
//      orderId: "1234", items;
// }
const orderEmailSchema = mongoose.Schema({
     email: { type: String, required: true },
     orders: [
          {
               orderId: { type: String },
               items: [
                    {
                         name: String,
                         price: Number,
                         quantity: Number,
                    },
               ],
          },
     ],
     status: { type: String, default: "Pending" },
});

const OrderEmail = mongoose.model("OrderEmail", orderEmailSchema);
module.exports = OrderEmail;
