const mongoose = require("mongoose");

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
                    required: [true, "Policy Type is required"],
               },
               content: {
                    type: String,
                    required: [true, "Policy Description is required"],
               },
          },
     ],
});

const Policy = mongoose.model("Policy", policySchema);
module.exports = Policy;
