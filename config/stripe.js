const Stripe = require("stripe");
const stripeClient = new Stripe(process.env.STRIPE_SK);

module.exports = stripeClient;
