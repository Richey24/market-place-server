const StripeSession = require("../../model/StripeSession")
const User = require("../../model/User");

const stripe = require("stripe")(process.env.STRIPE_KEY)
const YOUR_DOMAIN = "https://www.dashboard.ishop.black/subscribe"

exports.createVendorSubscription = async (req, res) => {
    const { email, plan, id } = req.query
    if (!email || !plan || !id) {
        return res.status(400).json({ message: "Send All Required Parameter" })
    }
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: plan === "monthly" ? process.env.MONTHLY : process.env.YEARLY,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    await StripeSession.create({ sessionID: session.id, email: email, plan: plan, userID: id })

    res.redirect(303, session.url);
}

exports.stripeVendorCallback = async (req, res) => {
    const payload = req.body;
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
                const user = await User.findOneAndUpdate({ email: customer.email }, { paid: true, expiryDate: expiryDate, customerID: session.customer, subscriptionID: session.subscription, plan: customer.plan }, { new: true })
                // await Logger.create({ user: user, eventType: "checkout.session.completed" })
            }
            break;
        }
        case "checkout.session.async_payment_succeeded": {
            const session = event.data.object;
            const customer = await StripeSession.findOne({ sessionID: session.id })
            const expiryDate = customer.plan === "monthly" ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 12))
            const user = await User.findOneAndUpdate({ email: customer.email }, { paid: true, expiryDate: expiryDate, customerID: session.customer, subscriptionID: session.subscription, plan: customer.plan })
            // await Logger.create({ user: user, eventType: "checkout.session.async_payment_succeeded" })
            break;
        }
        case "invoice.payment_succeeded": {
            const invoice = event.data.object;
            const user = await User.findOne({ customerID: invoice.customer })
            const expiryDate = user.plan === "monthly" ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 12))
            const theUser = await User.findOneAndUpdate({ customerID: invoice.customer }, { expiryDate: expiryDate })
            // await Logger.create({ user: theUser, eventType: "invoice.payment_succeeded" })
            break;
        }
        default:
            break;
    }
}

exports.cancelVendorSubscription = async (req, res) => {
    try {
        const id = req.userData._id
        if (!id) {
            return res.status(400).json({ message: "id is required" })
        }
        const user = await User.findById(id)
        await stripe.subscriptions.update(user.subscriptionID, { cancel_at_period_end: true })
        // await User.findByIdAndUpdate(id, { subscriptionID: "" })
        return res.status(200).json({ message: "subscription cancelled successfully" })
    } catch (error) {
        res.status(500).json({ message: "An error occurred" })
    }
}