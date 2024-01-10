const stripe = require("../../model/Stripe");
const User = require("../../model/User");
const Company = require("../../model/Company");

exports.stripeCheckout = async (req, res) => {
     try {
          const { amount, currency, source, description } = req.body;

          const paymentIntent = await stripe.paymentIntents.create({
               amount,
               currency,
               source,
               description,
          });

          res.status(200).json({ clientSecret: paymentIntent.client_secret });
     } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
     }
};

const stripeSession = async (req) => {
     try {
          const session = await stripe.checkout.sessions.create({
               mode: "payment",
               payment_method_types: ["card"],
               line_items: [
                    {
                         price: "price_1OVEIDH56ySuleg3AnmtX3o0",
                         quantity: 1,
                    },
               ],
               success_url: "http://localhost:5173/promotions/ads",
               cancel_url: "http://localhost:5173/cancel",
          });
          return session;
     } catch (e) {
          return e;
     }
};

exports.createSubscriptionCheckoutSession = async (req, res) => {
     const { customerId } = req.body;

     try {
          const company = await Company.findOne({ user_id: customerId });

          if (!company) {
               return res.status(404).json({ error: "Company not found for the given user ID" });
          }

          const session = await stripeSession(req);

          company.adsSubscription = {
               sessionId: session.id,
               subscriptionId: null,
               status: null,
               currentPeriodEnd: null,
          };

          await company.save();

          return res.json({ session });
     } catch (error) {
          res.send(error);
     }
};

exports.adsCallback = async (req, res) => {
     const payload = req.body;
     const sig = req.headers["stripe-signature"];
     let event;

     try {
          event = stripe.webhooks.constructEvent(payload, sig, process.env.endpointSecret);
     } catch (err) {
          console.log(err);
          return res.status(400).send(`Webhook Error: ${err.message}`);
     }

     switch (event.type) {
          case "checkout.session.completed": {
               const session = event.data.object;
               if (session.payment_status === "paid") {
                    const expiryDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

                    // Update company subscription information
                    Company.adsSubscription = {
                         sessionId: session.id,
                         subscriptionId: session.subscription,
                         status: "active",
                         currentPeriodEnd: expiryDate,
                    };
                    await Company.save();
               }
               break;
          }
          case "checkout.session.async_payment_succeeded": {
               const session = event.data.object;
               const expiryDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

               // Update company subscription information
               Company.adsSubscription = {
                    sessionId: session.id,
                    subscriptionId: session.subscription,
                    status: "active",
                    currentPeriodEnd: expiryDate,
               };
               await Company.save();
               // Logger logic if needed
               break;
          }
          case "invoice.payment_succeeded": {
               const invoice = event.data.object;
               const expiryDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

               // Update company subscription information
               Company.adsSubscription = {
                    sessionId: invoice.subscription,
                    subscriptionId: invoice.subscription,
                    status: "active",
                    currentPeriodEnd: expiryDate,
               };
               await Company.save();

               break;
          }
     }
};
