const Company = require("../../model/Company");

const updateCompany = async (req, res) => {
     try {
          const id = req.params.id;
          const data = req.body;
          if (!id) {
               return res.status(400).json({ message: "Send Company ID" });
          }
          await Company.findOneAndUpdate({ company_id: id }, data);
          res.status(200).json({ message: "success" });
     } catch (error) {
          return res.status(500).json({ error });
     }
};

const updateBrandColor = async (req, res) => {
     const { brandColor } = req.body;
     const user = req.userData;

     if (!brandColor) {
          return res.status(400).send({ message: "brandColor is required" });
     }

     try {
          const company = await Company.findById(companyId);
          if (!company) {
               return res.status(404).send({ message: "Company not found" });
          }

          company.brandColor = brandColor;
          await company.save();

          res.status(200).send({
               message: "Brand colors updated successfully",
               brandColor: company.brandColor,
          });
     } catch (error) {
          res.status(500).send({ message: "Error updating brand colors", error: error.message });
     }
};

const findCompanyByCompanyIdAndPopulateUser = async (companyId) => {
     try {
          const company = await Company.findOne({ company_id: companyId })
               .populate("user_id")
               .exec();

          if (!company) return null;

          // The user data will be populated in the 'user_id' field
          return company;
     } catch (error) {
          throw error;
     }
};

const findCompaniesAndPopulateUser = async () => {
     try {
          const companies = await Company.find({}).populate("user_id").exec();

          if (!companies) return null;

          // The user data will be populated in the 'user_id' field
          return companies;
     } catch (error) {
          throw error;
     }
};
module.exports = {
     updateCompany,
     findCompanyByCompanyIdAndPopulateUser,
     findCompaniesAndPopulateUser,
     updateBrandColor,
};
