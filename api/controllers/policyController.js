const Policy = require("../../model/Policy");

exports.createPolicy = async (req, res) => {
     const { siteId, policy_type, content } = req.body;

     try {
          if (!siteId) {
               return res.status(400).json({ error: "Site ID is required in the request body" });
          }

          let sitePolicies = await Policy.findOne({ site_id: siteId });

          if (!sitePolicies) {
               sitePolicies = new Policy({
                    site_id: siteId,
                    policies: [],
               });
          }

          const existingPolicy = sitePolicies.policies.find(
               (policy) => policy.policy_type === policy_type,
          );

          if (existingPolicy) {
               return res.status(400).json({ error: "Policy with the same type already exists" });
          }

          sitePolicies.policies.push({
               policy_type: policy_type,
               content: content,
          });

          await sitePolicies.save();

          return res.status(201).json({ message: "Policy created successfully" });
     } catch (error) {
          console.error("Error creating policy:", error);
          return res.status(500).json({ error: "Internal server error" });
     }
};

exports.updatePolicy = async (req, res) => {
     const { siteId, policy_type, content } = req.body;

     try {
          if (!siteId) {
               return res.status(400).json({ error: "Site ID is required in the request body" });
          }

          let sitePolicies = await Policy.findOne({ site_id: siteId });

          if (!sitePolicies) {
               return res.status(404).json({ error: "Site not found or no policies exist" });
          }

          const existingPolicy = sitePolicies.policies.find(
               (policy) => policy.policy_type === policy_type,
          );

          if (!existingPolicy) {
               return res.status(404).json({ error: "Policy not found" });
          }

          existingPolicy.content = content;

          await sitePolicies.save();

          return res.status(200).json({ message: "Policy updated successfully" });
     } catch (error) {
          console.error("Error updating policy:", error);
          return res.status(500).json({ error: "Internal server error" });
     }
};
