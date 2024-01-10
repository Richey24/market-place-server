const Logger = require("../../model/Logger");
const StripeSession = require("../../model/StripeSession")
const User = require("../../model/User");

const stripe = require("stripe")(process.env.STRIPE_TEST_KEY)
const YOUR_DOMAIN = "http://localhost:5173"

exports.createVendorSubscription = async (req, res) => {
    const { email, plan, mode, id, register } = req.query
    console.log(email, plan, mode);
    if (!email || !plan || !mode) {
        return res.status(400).json({ message: "Send All Required Parameter" })
    }
    let session;
    if (mode === "service") {
        session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: plan === "monthly" ? process.env.MONTHLY_SERVICE : process.env.YEARLY_SERVICE,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: register === "yes" ? `${YOUR_DOMAIN}/billing` : `${YOUR_DOMAIN}/onboarding?success=true`,
            cancel_url: register === "yes" ? `${YOUR_DOMAIN}/billing` : `${YOUR_DOMAIN}/onboarding?success=false`,
        });
    } else if (mode === "ecommerce") {
        session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: plan === "monthly" ? process.env.MONTHLY_STORE : process.env.YEARLY_STORE,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${YOUR_DOMAIN}?success=true`,
            cancel_url: `${YOUR_DOMAIN}?success=false`,
        });
    }
    const check = await StripeSession.findOne({ email: email })
    if (check) {
        await StripeSession.findOneAndUpdate({ email: email }, { sessionID: session.id, plan: plan, userID: id })
    } else {
        await StripeSession.create({ sessionID: session.id, email: email, plan: plan, userID: id })
    }

    res.redirect(303, session.url);
}

exports.stripeVendorCallback = async (req, res) => {
    const payload = req.rawBody;
    const sig = req.headers['stripe-signature'];
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
            if (session.payment_status === 'paid') {
                const customer = await StripeSession.findOne({ sessionID: session.id })
                const expiryDate = customer.plan === "monthly" ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 12))
                const user = await User.findOneAndUpdate({ email: customer.email }, { paid: true, expiryDate: expiryDate, stripeID: session.customer, subscriptionID: session.subscription, plan: customer.plan }, { new: true })
                await Logger.create({ userID: user._id, eventType: "checkout.session.completed" })
            }
            break;
        }
        case "checkout.session.async_payment_succeeded": {
            const session = event.data.object;
            const customer = await StripeSession.findOne({ sessionID: session.id })
            const expiryDate = customer.plan === "monthly" ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 12))
            const user = await User.findOneAndUpdate({ email: customer.email }, { paid: true, expiryDate: expiryDate, stripeID: session.customer, subscriptionID: session.subscription, plan: customer.plan }, { new: true })
            await Logger.create({ userID: user._id, eventType: "checkout.session.async_payment_succeeded" })
            break;
        }
        case "invoice.payment_succeeded": {
            const invoice = event.data.object;
            const user = await User.findOne({ stripeID: invoice.customer })
            const expiryDate = user.plan === "monthly" ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 12))
            await User.findOneAndUpdate({ stripeID: invoice.customer }, { expiryDate: expiryDate })
            await Logger.create({ userID: user._id, eventType: "invoice.payment_succeeded" })
            break;
        }
        default:
            break;
    }
}

exports.cancelVendorSubscription = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ message: "id is required" })
        }
        const user = await User.findById(id)
        await stripe.subscriptions.update(user.subscriptionID, { cancel_at_period_end: true })
        await Logger.create({ userID: user._id, eventType: "subscription cancelled" })
        return res.status(200).json({ message: "subscription cancelled successfully" })
    } catch (error) {
        res.status(500).json({ message: "An error occurred" })
    }
}