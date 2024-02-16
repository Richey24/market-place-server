const { successResponder, errorResponder } = require("../../utils/http_responder");
const User = require("../../model/User");
const paymentService = require("../../services/payment.service");

exports.createPaymentIntents = async (req, res) => {
     const { amount, connectedAccountId, orderId, userId, siteId, type } = req.body;

     try {
          if (type === "direct_charges") {
               const payment = await paymentService.createDirectChargePaymentIntents({
                    amount,
                    connectedAccountId,
                    orderId,
                    userId,
                    siteId,
               });

               return successResponder(res, payment, 201, "Payment successFull");
          }

          const payment = await paymentService.createPaymentIntents({
               amount,
               connectedAccountId,
               orderId,
               userId,
               siteId,
          });

          return successResponder(res, payment, 201, "Payment successFull");
     } catch (error) {
          errorResponder(res, error?.code, error?.message);
     }
};

exports.generateAccountLink = async (req, res) => {
     try {
          const user = await User.findOne({ _id: req.query.userId });

          const links = await paymentService.generateAccountLink({
               stripeConnectedAccountId: user.stripeConnectedAccountId,
          });
          return successResponder(res, links, 200, "successFull");
     } catch (error) {
          return errorResponder(res, error.code || 500, error.message);
     }
};

exports.checkConnectedAccountStatus = async (req, res) => {
     const userId = req.query.userId;

     try {
          const account = await paymentService.retriveConnectAccount({
               stripeConnectedAccountId: req.query.stripeConnectedAccountId,
          });

          if (account.details_submitted && account.charges_enabled) {
               await User.updateOne(
                    { _id: userId },
                    {
                         $set: { isStripeConnectedAccountVerified: true },
                    },
               );
               return successResponder(res, account, 200, "successFull");
          }
          return successResponder(res, {}, 400, "error");
     } catch (error) {
          return errorResponder(res, error.code || 500, error.message);
     }
};

exports.connectExternalAccount = async (req, res) => {
     try {
          const {
               type,
               accountHolderName,
               accountHolderType,
               routingNumber,
               accountNumber,
               stripeConnectedAccountId,
          } = req.body;

          const account = await paymentService.connectExternalAccount({
               type: type,
               country: "US",
               currency: "usd",
               routing_number: routingNumber,
               account_number: accountNumber,
               account_holder_name: accountHolderName,
               account_holder_type: accountHolderType,
               stripeConnectedAccountId,
          });
          return successResponder(res, account, 200, "success");
     } catch (error) {
          return errorResponder(res, error.code || 500, error?.message);
     }
};

exports.getAllExternalAccounts = async (req, res) => {
     try {
          const { stripeConnectedAccountId } = req.query;

          const externalAccounts = await paymentService.getAllExternalAccounts({
               connectedAccountId: stripeConnectedAccountId,
          });
          return successResponder(res, externalAccounts, 200, "success");
     } catch (error) {
          return errorResponder(res, error.code || 500, error?.message);
     }
};

exports.deleteExternalAccount = async (req, res) => {
     try {
          const { accountId, payoutMethodId } = req.params;

          const deletedPayoutMethod = await paymentService.deleteExternalAccount({
               payoutMethodId,
               connectedAccountId: accountId,
          });
          return successResponder(
               res,
               deletedPayoutMethod,
               200,
               "Payout method deleted successfully",
          );
     } catch (error) {
          return errorResponder(res, error.code || 500, error?.message);
     }
};

exports.updatePaymentMethod = async (req, res) => {
     try {
          const { accountId, bankAccountId, data } = req.body;

          const payoutMethod = await paymentService.updatePaymentMethod({
               connectedAccountId: accountId,
               bankAccountId,
               data,
          });

          return successResponder(res, payoutMethod, 200, "Payout method updated successfully");
     } catch (error) {
          return errorResponder(res, error.code || 500, error?.message);
     }
};
