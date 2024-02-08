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
     findCompaniesAndPopulateUser
};
