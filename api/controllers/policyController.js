const Policy = require("../../model/Policy");

exports.getPolicyBySiteId = async (req, res) => {
     const { siteId } = req.body;

     try {
          if (!siteId) {
               return res.status(400).json({ error: "Site ID is required in the request body" });
          }

          const sitePolicies = await Policy.findOne({ site_id: siteId });

          if (!sitePolicies) {
               return res.status(404).json({ error: "Site not found or no policies exist" });
          }

          return res.status(200).json({ policies: sitePolicies.policies });
     } catch (error) {
          console.error("Error getting policy:", error);
          return res.status(500).json({ error: "Internal server error" });
     }
};

exports.createPolicy = async (req, res) => {
     try {
          const { siteId, policy_type, content } = req.body;

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

          if (!Policy.schema.path("policies.0.policy_type").enumValues.includes(policy_type)) {
               return res.status(400).json({ error: "Invalid policy_type value" });
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

exports.getPolicyByType = async (req, res) => {
     try {
          const { siteId, policy_type } = req.body;

          if (!siteId || !policy_type) {
               return res
                    .status(400)
                    .json({ error: "Site ID and Policy Type are required in the request body" });
          }

          const sitePolicies = await Policy.findOne({ site_id: siteId });

          if (!sitePolicies) {
               return res.status(404).json({ error: "Site not found or no policies exist" });
          }

          const matchingPolicy = sitePolicies.policies.find(
               (policy) => policy.policy_type === policy_type,
          );

          if (!matchingPolicy) {
               return res.status(404).json({ error: "Policy not found for the specified type" });
          }

          return res.status(200).json({ policy: matchingPolicy });
     } catch (error) {
          console.error("Error getting policy by type:", error);
          return res.status(500).json({ error: "Internal server error" });
     }
};
