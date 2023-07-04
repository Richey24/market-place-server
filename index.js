const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

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

//configure body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//configure body-parser ends here

app.use(morgan("dev")); // configire morgan

// define first route
app.get("/", (req, res) => {
  console.log("Hello MEVN Soldier");
  res.status(201).json({ message: 'working' });
});

const userRouter = require("./api/routes/user");
const categoryRouter = require("./api/routes/category");
const productRouter = require("./api/routes/product");
const shoppingCart = require("./api/routes/cart");
const wishlistRouter = require("./api/routes/wishlists");
const onboardingRouter = require("./api/routes/onboarding");
const promotionRouter = require('./api/routes/promotion');
const themeRouter = require('./api/routes/theme')
const advertRouter = require('./api/routes/advert')
// const errorHandler = require("./config/errorHandler");

// //for error handling
// app.use(errorHandler)

app.use("/api/auth", userRouter);
app.use("/api/user", userRouter);

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);

app.use("/api/carts", shoppingCart);
app.use("/api/wishlists", wishlistRouter);

app.use("/api/onboarding", onboardingRouter);
app.use("/api/promotions", promotionRouter);
app.use('/api/themes', themeRouter);
app.use('/api/advert', advertRouter);


app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
