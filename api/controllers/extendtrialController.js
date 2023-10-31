const Company = require("../../model/Company");
const User = require("../../model/User");
const { sendTrialExtensionEmail } = require("../../config/helpers");

const sentTrialExtensions = new Set();

exports.extendTrial = async (req, res) => {
     const companyId = req.query.companyId;

     try {
          if (sentTrialExtensions.has(companyId)) {
               return res.status(400).json({ error: "Trial already extended for this company" });
          }

          const company = await Company.findById(companyId);

          if (!company) {
               return res.status(404).json({ error: "Company not found" });
          }

          const trialEndDate = company.trial_end_date;
          const newTrialEndDate = new Date(trialEndDate);
          newTrialEndDate.setDate(newTrialEndDate.getDate() + 7);

          company.trial_end_date = newTrialEndDate;
          await company.save();

          const user = await User.findById(company.user_id);

          if (user) {
               sendTrialExtensionEmail(user.name, user.email, newTrialEndDate);
          }

          // Mark the extension as sent for this company
          sentTrialExtensions.add(companyId);

          return res.status(201).json({ new_trial_end_date: newTrialEndDate });
     } catch (error) {
          console.error("Error extending trial:", error);
          return res.status(500).json({ error: "Internal server error" });
     }
};
