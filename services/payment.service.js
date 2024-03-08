const stripeClient = require("../config/stripe");
const paymentModel = require("../model/Payment");
const { NotFoundError, PermissionError, ServerError } = require("../utils/error");

class PaymentService {
     async createConnectedAccount(payload) {
          try {
               const account = await stripeClient.accounts.create({
                    type: "express",
                    email: payload.email,
                    // country: payload.country,
                    capabilities: {
                         card_payments: {
                              requested: true,
                         },
                         transfers: {
                              requested: true,
                         },
                         ideal_payments: {
                              requested: true,
                         },
                    },
               });
               return account;
          } catch (error) {
               throw new ServerError(
                    error?.message ||
                         error?.raw?.message ||
                         "Error creating a stripe connected account",
                    error?.raw?.statusCode || error?.statusCode,
                    error?.raw?.code,
               );
          }
     }

     async createPaymentIntents(payload) {
          const { amount, connectedAccountId, orderId, userId, siteId, metadata } = payload;
          console.log({
               amount: (amount + this.calculateApplicationFee(amount)) * 100, //amount + service charges and Convert to cents
               currency: "usd",
               transfer_data: {
                    amount: amount * 100,
                    destination: connectedAccountId, // ID of the connected account
               },
               automatic_payment_methods: {
                    enabled: true,
               },
               metadata: metadata,
          });
          try {
               const paymentIntent = await stripeClient.paymentIntents.create({
                    metadata,
                    amount: (amount + this.calculateApplicationFee(amount)) * 100, //amount + service charges and Convert to cents
                    currency: "usd",
                    transfer_data: {
                         amount: amount * 100,
                         destination: connectedAccountId, // ID of the connected account
                    },
                    automatic_payment_methods: {
                         enabled: true,
                    },
               });

               const paymentRecipt = await this.createPaymentRecept({
                    amount: paymentIntent.amount,
                    currency: paymentIntent.currency,
                    paymentIntentId: paymentIntent.id,
                    status: paymentIntent.status,
                    captureMethod: paymentIntent.capture_method,
                    confirmationMethod: paymentIntent.confirmation_method,
                    clientSecret: paymentIntent.client_secret,
                    connectedAccountId: connectedAccountId,
                    orderId: orderId,
                    buyer: userId,
                    site: siteId,
               });

               console.log({ paymentRecipt, paymentIntent });
               // Handle successful payment
               return { clientSecret: paymentIntent.client_secret };
          } catch (error) {
               console.log({ et: error });
               // Handle payment failure
               throw new ServerError(
                    error?.message ||
                         error?.raw?.message ||
                         "An error occured while creating payment intent",
                    error?.raw?.statusCode || error?.statusCode,
                    error?.raw?.code,
               );
          }
     }
     async createDirectChargePaymentIntents(payload) {
          const { amount, connectedAccountId, orderId, userId, siteId, metadata } = payload;

          try {
               const paymentIntent = await stripeClient.paymentIntents.create(
                    {
                         amount: amount * 100, //amount + service charges and Convert to cents
                         currency: "usd",

                         automatic_payment_methods: {
                              enabled: true,
                         },
                         metadata,
                    },
                    {
                         stripeAccount: connectedAccountId, // Direct charge to the connected account
                    },
               );

               const paymentRecipt = await this.createPaymentRecept({
                    amount: paymentIntent.amount,
                    currency: paymentIntent.currency,
                    paymentIntentId: paymentIntent.id,
                    status: paymentIntent.status,
                    captureMethod: paymentIntent.capture_method,
                    confirmationMethod: paymentIntent.confirmation_method,
                    clientSecret: paymentIntent.client_secret,
                    connectedAccountId: connectedAccountId,
                    orderId: orderId,
                    buyer: userId,
                    site: siteId,
               });

               console.log({ paymentRecipt });
               // Handle successful payment
               return { clientSecret: paymentIntent.client_secret };
          } catch (error) {
               console.log({ et: error });
               // Handle payment failure
               throw new ServerError(
                    error?.message ||
                         error?.raw?.message ||
                         "An error occured while creating payment intent",
                    error?.raw?.statusCode || error?.statusCode,
                    error?.raw?.code,
               );
          }
     }

     // async createPaymentLinks(payload) {
     //      const paymentLink = await stripeClient.paymentLinks.create({
     //           line_items: payload.products,
     //           transfer_data: {
     //                destination: payload.connectedAccountId,
     //           },
     //      });
     // }

     getAllExternalAccounts = async (params) => {
          try {
               const externalAccounts = await stripeClient.account.listExternalAccounts(
                    params.connectedAccountId,
               );

               return externalAccounts;
          } catch (error) {
               throw new ServerError(
                    error?.message ||
                         error?.raw?.message ||
                         "An error occured while get all external accounts",
                    error?.raw?.statusCode || error?.statusCode,
                    error?.raw?.code,
               );
          }
     };

     deleteExternalAccount = async (params) => {
          try {
               const deletedPayoutMethod = await stripeClient.account.deleteExternalAccount(
                    params.connectedAccountId,
                    params.payoutMethodId,
               );

               return deletedPayoutMethod;
          } catch (error) {
               throw new Error(
                    error?.message ||
                         error?.raw?.message ||
                         "An error occured while get all external accounts",
               );
          }
     };

     generateAccountLink = async (params) => {
          try {
               // Generate account link as needed
               const accountLink = await stripeClient.accountLinks.create({
                    account: params.stripeConnectedAccountId, // Use the connected account ID
                    refresh_url: `${process.env.CLIENT_FE_BASE_URL}/settings/editprofile`,
                    return_url: `${process.env.CLIENT_FE_BASE_URL}/settings/editprofile`,
                    type: "account_onboarding",
                    collect: "eventually_due",
               });

               return accountLink;
          } catch (error) {
               throw new ServerError(
                    error?.message || error?.raw?.message || "An error occured ",
                    error?.raw?.statusCode || error?.statusCode,
                    error?.raw?.code,
               );
          }
     };

     retriveConnectAccount = async (params) => {
          try {
               const account = await stripeClient.accounts.retrieve(
                    params.stripeConnectedAccountId,
               );

               return account;
          } catch (err) {
               return err;
          }
     };

     updatePaymentMethod = async (params) => {
          try {
               const updatedBankAccount = await stripeClient.accounts.updateExternalAccount(
                    params.connectedAccountId,
                    params.bankAccountId,
                    { ...params.data },
               );

               return updatedBankAccount;
          } catch (error) {
               throw new Error(
                    error?.message || error?.raw?.message || "Error trying to updated Bank account",
               );
          }
     };

     // checkAccountVerificationStatus = async (accountId) => {
     //      try {
     //           const account = await stripe.accounts.retrieve(accountId);

     //           // Check the verification status
     // if (account.details_submitted && account.charges_enabled) {
     //      console.log("Account is verified");
     //      return true;
     // } else {
     //      console.log("Account is not verified");
     //      return false;
     // }
     //      } catch (error) {
     //           console.error("Error retrieving account information:", error);
     //           return false;
     //      }
     // };

     connectExternalAccount = async (params) => {
          // const user = await UserDetails.findOne({ userId: params.userId });
          try {
               const externalAccount = await stripeClient.accounts.createExternalAccount(
                    params.stripeConnectedAccountId,
                    {
                         external_account: {
                              object: params.type, //bank_account or card_account
                              country: params.country, // Replace with the appropriate country code
                              currency: params.currency, // Replace with the appropriate currency code
                              account_holder_name: params.accountHolderName,
                              account_holder_type: params.accountHolderType, // Replace with 'company' if it's a business account
                              routing_number: params.routingNumber,
                              account_number: params.accountNumber,
                         },
                    },
               );
               // Perform any additional actions as needed

               return externalAccount;
          } catch (error) {
               throw new ServerError(
                    error?.message || error?.raw?.message || "An Error occured",
                    error?.raw?.statusCode || error?.statusCode,
                    error.raw.code,
               );
          }
     };

     async createPaymentRecept(payload) {
          return await paymentModel.create(payload);
     }

     async findPaymentRecept() {
          return await paymentModel.find();
     }

     /**
      * Update an advert by its ID.
      * @param {string} _id - The ID of the advert to update.
      * @param {Object} payload - The payload containing the updated advert data.
      * @returns {Promise<Object>} The updated advert object.
      */
     async updateOne(_id, payload) {
          const recipt = await paymentModel.findOneAndUpdate({ _id }, payload);

          if (!recipt) {
               throw new NotFoundError("There is no payment recipt with this id");
          }

          return recipt;
     }

     /**
      * transaction fee per transaction is 5% + $.50 cent
      * @param {number} amount
      * @returns {number}
      */
     calculateApplicationFee(amount) {
          const percentage = 5;
          const constantCash = 0.5;

          // Calculate the result
          const result = (percentage / 100) * amount;

          return Math.floor(result + constantCash);
     }
}

module.exports = new PaymentService();
