const Logger = require("../../model/Logger");
const StripeSession = require("../../model/StripeSession");
const User = require("../../model/User");
const Company = require("../../model/Company");
const Advert = require("../../model/Advert");
const {
     sendSubscriptionCancelEmail,
     sendAdvertisementNotificationEmail,
} = require("../../config/helpers");

const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
const YOUR_DOMAIN = "https://dashboard.ishop.black";

exports.createVendorSubscription = async (req, res) => {
     try {
          const { email, plan, mode, id, register } = req.query;
          console.log(email, plan, mode);
          if (!email || !plan || !mode) {
               return res.status(400).json({ message: "Send All Required Parameter" });
          }
          let session;
          if (mode === "service") {
               session = await stripe.checkout.sessions.create({
                    line_items: [
                         {
                              // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                              price:
                                   plan === "monthly"
                                        ? process.env.MONTHLY_SERVICE
                                        : process.env.YEARLY_SERVICE,
                              quantity: 1,
                         },
                    ],
                    mode: "subscription",
                    success_url:
                         register === "yes"
                              ? `${YOUR_DOMAIN}/onboarding?success=true`
                              : `${YOUR_DOMAIN}/billing`,
                    cancel_url:
                         register === "yes"
                              ? `${YOUR_DOMAIN}/onboarding?success=false`
                              : `${YOUR_DOMAIN}/billing`,
               });
          } else if (mode === "ecommerce") {
               session = await stripe.checkout.sessions.create({
                    line_items: [
                         {
                              // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                              price:
                                   plan === "monthly"
                                        ? process.env.MONTHLY_STORE
                                        : process.env.YEARLY_STORE,
                              quantity: 1,
                         },
                    ],
                    mode: "subscription",
                    success_url:
                         register === "yes"
                              ? `${YOUR_DOMAIN}/onboarding?success=true`
                              : `${YOUR_DOMAIN}/billing`,
                    cancel_url:
                         register === "yes"
                              ? `${YOUR_DOMAIN}/onboarding?success=false`
                              : `${YOUR_DOMAIN}/billing`,
               });
          }
          const check = await StripeSession.findOne({ email: email });
          console.log(session);
          if (check) {
               await StripeSession.findOneAndUpdate(
                    { email: email },
                    { sessionID: session.id, plan: plan, userID: id },
               );
          } else {
               await StripeSession.create({
                    sessionID: session.id,
                    email: email,
                    plan: plan,
                    userID: id,
               });
          }

          res.redirect(303, session.url);
     } catch (error) {
          res.status(500).json({ message: "An error occurred" });
     }
};

exports.stripeVendorCallback = async (req, res) => {
     const payload = req.rawBody;
     const sig = req.headers["stripe-signature"];
     let event;

     try {
          event = stripe.webhooks.constructEvent(payload, sig, process.env.VENDOR_SECRET);
     } catch (err) {
          console.log(err);
          return res.status(400).send(`Webhook Error: ${err.message}`);
     }

     switch (event.type) {
          case "checkout.session.completed": {
               const session = event.data.object;
               if (session.mode !== "subscription") {
                    return res.status(400).json("wrong webhook");
               }
               if (session.payment_status === "paid") {
                    const customer = await StripeSession.findOne({ sessionID: session.id });
                    const expiryDate =
                         customer.plan === "monthly"
                              ? new Date(new Date().setMonth(new Date().getMonth() + 1))
                              : new Date(new Date().setMonth(new Date().getMonth() + 12));
                    const user = await User.findOneAndUpdate(
                         { email: customer.email },
                         {
                              paid: true,
                              expiryDate: expiryDate,
                              stripeID: session.customer,
                              subscriptionID: session.subscription,
                              subscriptionPlan: customer.plan,
                         },
                         { new: true },
                    );
                    await Logger.create({
                         userID: user._id,
                         eventType: "checkout.session.completed",
                    });
                    res.status(200).json({ message: "successful" });
               }
               break;
          }
          case "checkout.session.async_payment_succeeded": {
               const session = event.data.object;
               if (session.mode !== "subscription") {
                    return res.status(400).json("wrong webhook");
               }
               const customer = await StripeSession.findOne({ sessionID: session.id });
               const expiryDate =
                    customer.plan === "monthly"
                         ? new Date(new Date().setMonth(new Date().getMonth() + 1))
                         : new Date(new Date().setMonth(new Date().getMonth() + 12));
               const user = await User.findOneAndUpdate(
                    { email: customer.email },
                    {
                         paid: true,
                         expiryDate: expiryDate,
                         stripeID: session.customer,
                         subscriptionID: session.subscription,
                         subscriptionPlan: customer.plan,
                    },
                    { new: true },
               );
               await Logger.create({
                    userID: user._id,
                    eventType: "checkout.session.async_payment_succeeded",
               });
               res.status(200).json({ message: "successful" });
               break;
          }
          case "invoice.payment_succeeded": {
               const invoice = event.data.object;
               if (invoice.lines?.data[0]?.type !== "subscription") {
                    return res.status(400).json("wrong webhook");
               }
               const user = await User.findOne({ stripeID: invoice.customer });
               if (user) {
                    const expiryDate =
                         user.subscriptionPlan === "monthly"
                              ? new Date(new Date().setMonth(new Date().getMonth() + 1))
                              : new Date(new Date().setMonth(new Date().getMonth() + 12));
                    await User.findOneAndUpdate(
                         { stripeID: invoice.customer },
                         { expiryDate: expiryDate },
                    );
                    await Logger.create({
                         userID: user._id,
                         eventType: "invoice.payment_succeeded",
                    });
                    res.status(200).json({ message: "successful" });
               }
               break;
          }
          case "customer.subscription.deleted": {
               const session = event.data.object;
               const user = await User.findOne({ stripeID: session.customer });
               if (user) {
                    await User.findOneAndUpdate({ stripeID: session.customer }, { paid: false });
                    await Logger.create({
                         userID: user._id,
                         eventType: "customer.subscription.deleted",
                    });
                    res.status(200).json({ message: "successful" });
               }
          }
          default:
               break;
     }
};

exports.cancelVendorSubscription = async (req, res) => {
     try {
          const id = req.params.id;
          if (!id) {
               return res.status(400).json({ message: "id is required" });
          }
          const user = await User.findById(id);
          await stripe.subscriptions.update(user.subscriptionID, { cancel_at_period_end: true });
          await User.findByIdAndUpdate(id, { subCanceled: true });
          await Logger.create({ userID: user._id, eventType: "subscription cancelled" });
          return res.status(200).json({ message: "subscription cancelled successfully" });
     } catch (error) {
          res.status(500).json({ message: "An error occurred" });
     }
};

exports.updateSubscription = async (req, res) => {
     try {
          const { id } = req.query;
          if (!id) {
               return res.status(400).json({ message: "id is required" });
          }
          const user = await User.findById(id);
          const session = await stripe.billingPortal.sessions.create({
               customer: user.stripeID,
               return_url: `${YOUR_DOMAIN}/billing`,
          });
          res.redirect(303, session.url);
     } catch (error) {
          res.status(500).json({ message: "An error occurred" });
     }
};

exports.sendCancelEmail = (req, res) => {
     try {
          const { email, name, token } = req.body;
          if (!email || !name || !token) {
               return res.status(400).json({ message: "Send All required params" });
          }
          sendSubscriptionCancelEmail(email, name, token);
          return res.status(200).json({ message: "subscription cancel mail sent successfully" });
     } catch (error) {
          res.status(500).json({ message: "An error occurred" });
     }
};

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
               success_url: `${YOUR_DOMAIN}/promotions/ads?success=true`,
               cancel_url: `${YOUR_DOMAIN}/promotions/ads?success=false`,
          });
          return session;
     } catch (e) {
          return e;
     }
};

exports.createAdsCheckoutSession = async (req, res) => {
     const { customerId, advertId } = req.body;
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
               advertId: advertId,
          };

          await company.save();

          return res.json({ session });
     } catch (error) {
          res.send(error);
     }
};

exports.adsCallback = async (req, res) => {
     const payload = req.rawBody;
     const sig = req.headers["stripe-signature"];
     let event;

     try {
          event = stripe.webhooks.constructEvent(payload, sig, process.env.ADS_SECRET);
          if (event.data.object.mode !== "payment") {
               return res.status(400).json("wrong webhook");
          }
     } catch (err) {
          console.log(err);
          return res.status(400).send(`Webhook Error: ${err.message}`);
     }

     switch (event.type) {
          case "checkout.session.completed": {
               const session = event.data.object;
               if (session.payment_status === "paid") {
                    const expiryDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
                    const company = await Company.findOne({
                         "adsSubscription.sessionId": session.id,
                    });
                    const advertId = company.adsSubscription.advertId;
                    const advert = Advert.findOne({ advertId });

                    if (advertId) {
                         const advertisement = await Advert.findById(advertId);

                         if (advertisement) {
                              advertisement.status = "ACTIVE";
                              await advertisement.save();
                         }
                    }

                    company.adsSubscription = {
                         sessionId: session.id,
                         subscriptionId: session.payment_intent,
                         status: "active",
                         currentPeriodEnd: expiryDate,
                    };

                    await company.save();

                    const users = await User.find({ sales_opt_in: true });

                    for (const user of users) {
                         sendAdvertisementNotificationEmail(
                              user.email,
                              user.firstname,
                              {
                                   advertisementDetails: {
                                        productService: advert.title,
                                        description: advert.description,
                                   },
                              },
                              advert.targetUrl,
                         );
                    }
               }

               break;
          }
     }
     res.status(200).json({ message: "successful" });
};
