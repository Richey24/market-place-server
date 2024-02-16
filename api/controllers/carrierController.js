const Carrier = require("../../model/Carrier");
const EasyPost = require("@easypost/api");
const Company = require("../../model/Company");
const { calculate } = require("../../utils/usps");

const apiKey = "EZTK6cc52423aac2476eaea1c12cb94bb368qQqcaeAXfzOxo0hmKf7aJA";
const easyPost = new EasyPost(apiKey);

exports.getCarriers = async (req, res) => {
     try {
          const carriers = await Carrier.find();
          res.json({ carriers, status: true });
     } catch (error) {
          console.error("Error fetching carriers:", error);
          res.status(500).json({ error: "Internal Server Error", status: true });
     }
};

exports.createCarrier = async (req, res) => {
     try {
          const newCarrier = await Carrier.create(req.body);
          res.json({ status: true, newCarrier, message: "Carrier Created Succesfully" });
     } catch (error) {
          console.error("Error creating carrier:", error);
          res.status(500).json({ error: "Internal Server Error" });
     }
};

exports.selectCarrierByCompanyId = async (req, res) => {
     try {
          const { companyId } = req.params;
          const { selectedCarriers } = req.body;

          // Assuming selectedCarriers is an array of carrier IDs
          const updatedVendor = await Company.findByIdAndUpdate(
               companyId,
               { selectedCarriers: selectedCarriers },
               { new: true },
          ).populate("selectedCarriers");

          res.json({ status: true, vendor: updatedVendor });
     } catch (error) {
          console.error("Error updating selected carriers:", error);
          res.status(500).json({ status: false, error: "Internal Server Error" });
     }
};

exports.getCarriersByCompanyId = async (req, res) => {
     try {
          const { companyId } = req.params;
          const { selectedCarriers } = req.body;

          // Assuming selectedCarriers is an array of carrier IDs
          const updatedVendor = await Company.findByIdAndUpdate(
               companyId,
               { $addToSet: { selectedCarriers: { $each: selectedCarriers } } },
               { new: true },
          ).populate("selectedCarriers");

          res.json({ status: true, vendor: updatedVendor });
     } catch (error) {
          console.error("Error updating selected carriers:", error);
          res.status(500).json({ status: false, error: "Internal Server Error" });
     }
};

exports.calculateShippings = async (req, res) => {
     const package = req.body?.package;
     const carrier = req.body;

     console.log("here", package);
     if (!package) {
          return res.status(400).send({ error: "Carrier and package information are required." });
     }

     try {
          const rate = await calculate(package);
          console.log("rate", rate);
          res.json({ carrier, rate });
     } catch (error) {
          res.status(500).send({ error: error.message });
     }
};
