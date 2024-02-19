const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const {
     reminderJob,
     scheduleUserDisablingCronJob,
     publishServiceItemsCronJob,
     sendSalesReport,
     sendEmailsToUsers,
     disableExpiredAds,
     deleteEvent,
     clearOldToken,
} = require("./config/helpers");
const webpush = require("web-push");
const Visitor = require("./model/Visitor");
const Odoo = require("./config/odoo.connection");

//configure database and mongoose
mongoose
     .connect(process.env.MONGO_URL, { useNewUrlParser: true })
     .then(() => {
          console.log("Database is connected");
     })
     .catch((err) => {
          console.log({ database_error: err });
     });
// db configuaration ends here

const vapidKeys = {
     privateKey: "DJW3lZPIc64kptJOrrwFIvoEPDoRlOUBi5zYBq2nexo",
     publicKey:
          "BNW__qlZf6FZ3zCZL8H_JzDe051M2dCs-yaXWT9lc1CreFNlQYJ0oLNihj0AgraCKrOLAltz8MX7E3jLt9xUnD4",
};
webpush.setVapidDetails("https://chat.ishop.black/", vapidKeys.publicKey, vapidKeys.privateKey);

//registering cors
app.use(cors());
app.use(
     express.json({
          limit: "5mb",
          verify: (req, res, buf) => {
               req.rawBody = buf.toString();
          },
     }),
);
app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));
// //configure body parser
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
//configure body-parser ends here

app.use(morgan("dev")); // configire morgan

// Middleware to track unique visitors, record the visited site URL, and maintain an array of visited pages
// app.use((req, res, next) => {
//      const identifier = req.ip; // Use IP address as an identifier, you can customize this based on your needs
//      const visitedSite = req.hostname; // Store the visited site URL
//      const visitedPage = req.originalUrl; // Store the visited page URL

//      // Check if the visitor with the same identifier already exists
//      Visitor.findOne({ identifier }, (err, existingVisitor) => {
//           if (err) {
//                console.error(err);
//                return next();
//           }

//           // If the visitor does not exist, save the new visitor
//           if (!existingVisitor) {
//                const newVisitor = new Visitor({
//                     identifier,
//                     visitedSite,
//                     visitedPages: [visitedPage],
//                });
//                newVisitor.save((err) => {
//                     if (err) {
//                          console.error(err);
//                     }
//                });
//           } else {
//                // If the visitor exists, update the array of visited pages
//                existingVisitor.visitedPages.push(visitedPage);
//                existingVisitor.save((err) => {
//                     if (err) {
//                          console.error(err);
//                     }
//                });
//           }

//           next();
//      });
// });

// define first route
app.get("/", (req, res) => {
     console.log("Hello MEVN Soldier");
     res.status(201).json({ message: "working" });
});

app.get("/odoo/test", async (req, res) => {
     try {
          await Odoo.connect();
          res.status(200).json({ error: "Odoo is working", status: true });
     } catch (error) {
          res.status(500).json({ error: "Odoo is down", status: false });
     }
});

reminderJob();
scheduleUserDisablingCronJob();
publishServiceItemsCronJob();
const items = [{ name: "Product1", price: 80, quantity: 4 }];
sendSalesReport(175, { orderId: "1234", items });
sendEmailsToUsers();
disableExpiredAds();
deleteEvent();
// clearOldToken()

const adminRouter = require("./api/routes/admin");
const userRouter = require("./api/routes/user");
const categoryRouter = require("./api/routes/category");
const productRouter = require("./api/routes/product");
const shoppingCart = require("./api/routes/cart");
const wishlistRouter = require("./api/routes/wishlists");
const onboardingRouter = require("./api/routes/onboarding");
const promotionRouter = require("./api/routes/promotion");
const themeRouter = require("./api/routes/theme");
const advertRouter = require("./api/routes/advert");
const contactUsRouter = require("./api/routes/contact-us");
const imageRouter = require("./api/routes/image");
const siteRouter = require("./api/routes/site");
const tagRouter = require("./api/routes/tag");
const orderRouter = require("./api/routes/order");
const dashboardRouter = require("./api/routes/dashbaord");
const mainCategoryRouter = require("./api/routes/mainCategory");
const popularProduct = require("./api/routes/popular");
const serviceRoute = require("./api/routes/service");
// const shipmentRoute = require("./api/routes/carrier");
const statRoute = require("./api/routes/stat");
const complainRoute = require("./api/routes/complain");
const companyRoute = require("./api/routes/company");
const visitorRoute = require("./api/routes/visitors");
const policyRouter = require("./api/routes/policy");
const paymentRouter = require("./api/routes/payment");
const { errorResponder } = require("./utils/http_responder");
const carrier = require("./api/routes/carrier");
const calenderRouter = require("./api/routes/calender");
const stripeRouter = require("./api/routes/stripe");
const eventRouter = require("./api/routes/event");
const boardRouter = require("./api/routes/board");
const pluginRouter = require("./api/routes/plugin");

const freelancePaymentRouter = require("./api/routes/freelancePayment");

// const errorHandler = require("./config/errorHandler");

// //for error handling
// app.use(errorHandler)

app.use("/api/admin/auth", adminRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", userRouter);
app.use("/api/user", userRouter);
app.use("/api/site", siteRouter);
app.use("/api/plugins", pluginRouter);
app.use("/api/tags", tagRouter);
app.use("/api/orders", orderRouter);
app.use("/api/dashboard", dashboardRouter);
// app.use("/api/shipment", shipmentRoute);
app.use("/api/visitor", visitorRoute);
app.use("/api/policy", policyRouter);
app.use("/api/carrier", carrier);
app.use("/api/stripe", stripeRouter);
app.use("/api/company", companyRoute);
app.use("/api/event", eventRouter);
app.use("/api/calender", calenderRouter);
app.use("/api/board", boardRouter);
app.use("/api/freelancer/payment", freelancePaymentRouter);

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);

app.use("/api/carts", shoppingCart);
app.use("/api/wishlists", wishlistRouter);

app.use("/api/onboarding", onboardingRouter);
app.use("/api/promotions", promotionRouter);
app.use("/api/themes", themeRouter);
app.use("/api/showcase", advertRouter);
app.use("/api/contact-us", contactUsRouter);
app.use("/api/main/category", mainCategoryRouter);
app.use("/api/main/popular", popularProduct);
app.use("/api/service", serviceRoute);
app.use("/api/stat", statRoute);
app.use("/api/complain", complainRoute);
app.use("/api/payment", paymentRouter);
app.use("/image", imageRouter);
app.use("/api/checkout", stripeRouter);

// Catch-all error handling middleware
app.use((error, _request, response, _next) => {
     console.error("Error caught:", error);

     const statusCode = error?.code || 500;
     const message = error?.message || "SERVER ERROR";

     // Respond with an error message and status code.
     return errorResponder(response, statusCode, message);
});

app.listen(PORT, () => {
     console.log(`App is running on ${PORT}`);
});
