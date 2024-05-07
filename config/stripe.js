const Stripe = require("stripe");
const stripeClient = new Stripe(process.env.STRIPE_KEY);

module.exports = stripeClient;
