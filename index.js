const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const { reminderJob, scheduleUserDisablingCronJob } = require("./config/helpers");

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

//registering cors
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));
// //configure body parser
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
//configure body-parser ends here

app.use(morgan("dev")); // configire morgan

// define first route
app.get("/", (req, res) => {
     console.log("Hello MEVN Soldier");
     res.status(201).json({ message: "working" });
});

reminderJob();
scheduleUserDisablingCronJob();

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
const mainCategoryRouter = require("./api/routes/mainCategory");
const popularProduct = require("./api/routes/popular");
const serviceRoute = require("./api/routes/service");
const statRoute = require("./api/routes/stat");

// const errorHandler = require("./config/errorHandler");

// //for error handling
// app.use(errorHandler)

app.use("/api/auth", userRouter);
app.use("/api/user", userRouter);
app.use("/api/site", siteRouter);
app.use("/api/tags", tagRouter);
app.use("/api/orders", orderRouter);

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);

app.use("/api/carts", shoppingCart);
app.use("/api/wishlists", wishlistRouter);

app.use("/api/onboarding", onboardingRouter);
app.use("/api/promotions", promotionRouter);
app.use("/api/themes", themeRouter);
app.use("/api/advert", advertRouter);
app.use("/api/contact-us", contactUsRouter);
app.use("/api/main/category", mainCategoryRouter)
app.use("/api/main/popular", popularProduct)
app.use("/api/service", serviceRoute)
app.use("/api/stat", statRoute);
app.use("/image", imageRouter);

app.listen(PORT, () => {
     console.log(`App is running on ${PORT}`);
});
