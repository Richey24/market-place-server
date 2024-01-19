const mongoose = require("mongoose");

const policyTypes = [
     "PRIVACY_POLICY",
     "TERMS_AND_CONDITION",
     "SHIPPING_POLICY",
     "REFUND_POLICY",
     "RETURN_POLICY",
     "GRIEVANCE_REDRESSAL",
];

const policySchema = mongoose.Schema({
     site_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Site",
          required: [true, "Site ID is required"],
     },
     policies: [
          {
               policy_type: {
                    type: String,
                    enum: policyTypes,
                    required: [true, "Policy Type is required"],
               },
               content: {
                    type: String,
                    default: "No Policy Provided",
               },
          },
     ],
});

const Policy = mongoose.model("Policy", policySchema);
module.exports = Policy;
