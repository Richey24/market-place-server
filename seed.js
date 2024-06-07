// Import required packages
const mongoose = require("mongoose");
const User = require("./model/User");
const Service = require("./model/Service");
const { default: algoliasearch } = require("algoliasearch");
const { serviceNav, ecommerceNav } = require("./utils/navigation");
const { sendAdminMessage } = require("./config/helpers");
const paymentService = require("./services/payment.service");
const Odoo = require("./config/odoo.connection");
require("dotenv").config();
const PORT = process.env.PORT || 4000;

mongoose
     .connect(process.env.MONGO_URL, { useNewUrlParser: true })
     .then(() => {
          console.log("Database is connected");
          addNav();
     })
     .catch((err) => {
          console.log({ database_error: err });
     });

const addNav = async () => {
     try {
          // [
          //      "igzclothingz@gmail.com",
          //      "otho432@gmail.com",
          //      "richardmcfall@dmvcleaningsolutions.com",
          //      "iconicgraphicz@gmail.com",
          //      "tobiasbrowninc@gmail.com",
          //      "4sumkoko@gmail.com",
          //      "maritaferg@gmail.com",
          //      "lshmws46@gmail.com",
          //      "kimberlsw@gmail.com",
          //      "tcynay08@gmail.com",
          //      "merchunlimtd@gmail.com",
          //      "msclbrooks.62@gmail.com",
          //      "glover1199@gmail.com",
          //      "harrispeter749@gmail.com",
          //      "harrispeter435@gmail.com",
          //      "ccriderrr@gmail.com",
          //      "redplanetphotography@photographer.net",
          //      "kinsharry58@gmail.com",
          //      "nevershedtears4u1@gmail.com",
          //      "thetrueblking@gmail.com"
          // ]
          sendAdminMessage("uahomorejoice@gmail.com", "Rejoice", "testing the new email")
          // await Odoo.connect();
          // [59, 37, 27, 26].forEach(async (id) => {
          //      const orderLines = await Odoo.execute_kw(
          //           "sale.order.line",
          //           "search_read",
          //           [[["order_id", "=", id]]],
          //           {
          //                fields: ["product_id", "product_uom_qty", "price_unit"],
          //           },
          //      );
          //      console.log(orderLines);
          // })
          // await Odoo.execute_kw("sale.order.line", "unlink", [[Number(108)]]);

          // const products = await Odoo.execute_kw("product.template", "search_read", [
          //      [
          //           // ["product_tag_ids.name", "=", tagName],
          //           ["standard_price", "=", 20],
          //           ["company_id", "=", 2],
          //      ],
          //      [
          //           "id",
          //           "name",
          //           "display_name",
          //           "list_price",
          //           "product_tag_ids",
          //           "standard_price",
          //           "x_brand_gate_id"
          //      ],
          // ]);
          // console.log(products);
          // await Odoo.execute_kw("product.template", "unlink", [[Number(2870)]]);
          // let vendorConnectedAccount = await paymentService.createConnectedAccount({
          //      email: "thetrueblking@gmail.com",
          // });

          // await User.updateOne(
          //      { _id: "6662d51aca0c1c37489cdcf0" },
          //      {
          //           $set: { stripeConnectedAccountId: vendorConnectedAccount.id },
          //      },
          // );
          console.log("worked");
     } catch (error) {
          console.log(error);
     }
};

// Invoke the seeder function
// testing basit errors caused by his M1 PRO
