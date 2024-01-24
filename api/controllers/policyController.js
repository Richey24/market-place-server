const Policy = require("../../model/Policy");
const { successResponder, errorResponder } = require("../../utils/http_responder");

exports.getPolicyBySiteId = async (req, res) => {
     const { siteId } = req.query;

     try {
          if (!siteId) {
               return errorResponder(res, 400, "Site ID is required");
          }

          const sitePolicies = await Policy.findOne({ site_id: siteId });

          if (!sitePolicies) {
               return errorResponder(res, 404, "Site not found or no policies exist");
          }

          return successResponder(res, sitePolicies.policies, 200, "successfull");
     } catch (error) {
          return errorResponder(res, error?.code, error?.message);
     }
};

exports.createPolicy = async (req, res) => {
     try {
          const { siteId, policy_type, content } = req.body;

          if (!siteId) {
               return errorResponder(res, 400, "Site ID is required");
          }

          let sitePolicies = await Policy.findOne({ site_id: siteId });

          if (!sitePolicies) {
               sitePolicies = new Policy({
                    site_id: siteId,
                    policies: [],
               });
          }

          if (!Policy.schema.path("policies.0.policy_type").enumValues.includes(policy_type)) {
               return errorResponder(res, 400, "Invalid policy_type value");
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

          return successResponder(res, {}, 201, "Policy created successfully");
     } catch (error) {
          return errorResponder(res, error?.code, error?.message);
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

          return successResponder(res, {}, 201, "Policy updated successfully");
     } catch (error) {
          return errorResponder(res, error?.code, error?.message);
     }
};

exports.getPolicyByType = async (req, res) => {
     try {
          const { siteId, policy_type } = req.query;

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

          return successResponder(res, matchingPolicy, 200, "successfully");
     } catch (error) {
          return errorResponder(res, error?.code, error?.message);
     }
};
