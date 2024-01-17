const billingModel = require("../model/Billing");

const { NotFoundError } = require("../utils/error");

class BillingService {
     async updateBillingAccount(id, payload) {
          const billing = await billingModel.findOneAndUpdate({ _id }, payload);

          if (!billing) {
               throw new NotFoundError("There is no billing account with this id");
          }

          return billing;
     }

     async updateBillingAccountByEmail(email, payload) {
          const billing = await billingModel.findOneAndUpdate({ email }, payload);

          if (!billing) {
               throw new NotFoundError("There is no billing account with this email");
          }

          return billing;
     }
}

module.exports = new BillingService();
