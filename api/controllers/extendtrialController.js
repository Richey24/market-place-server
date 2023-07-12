const Company = require("../../model/Company");
const User = require("../../model/User");
const { sendTrialExtensionEmail } = require("../../config/helpers");

exports.extendTrial = async (req, res) => {
     const companyId = req.params.companyId;

     Company.findById(companyId)
          .then((company) => {
               if (!company) {
                    console.log("Company not found");
                    return;
               }

               // Retrieve the trial end date from the company
               const trialEndDate = company.trial_end_date;

               // Add 7 days to the trial end date
               const newTrialEndDate = new Date(trialEndDate);
               newTrialEndDate.setDate(newTrialEndDate.getDate() + 7);

               // Update the trial_end_date field in the company model
               company.trial_end_date = newTrialEndDate;

               // Save the updated company document
               company.save();
               
               // get the user and send the trial extension email
               const user = User.findById(company.user_id);
               sendTrialExtensionEmail(user.name, user.email, newTrialEndDate);

               res.status(201).json({ new_trial_end_date: newTrialEndDate });
          })
          .then((updatedCompany) => {
               if (updatedCompany) {
                    console.log("Company trial end date updated:", updatedCompany);
               }
          })
          .catch((error) => {
               console.error("Error updating company:", error);
          });
};
