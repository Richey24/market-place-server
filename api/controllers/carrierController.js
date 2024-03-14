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
     const { shipTo, shipFrom, package } = req.body;

     // console.log("here", package);
     // Usage example
     const carrierId = "se-6244031";
     // const shipTo = {
     //      name: "The President",
     //      phone: "222-333-4444",
     //      company_name: "",
     //      address_line1: "1600 Pennsylvania Avenue NW",
     //      city_locality: "Washington",
     //      state_province: "DC",
     //      postal_code: "20500",
     //      country_code: "US",
     //      address_residential_indicator: "no",
     // };
     // const shipFrom = {
     //      name: "ShipEngine Team",
     //      phone: "222-333-4444",
     //      company_name: "ShipEngine",
     //      address_line1: "4301 Bull Creek Road",
     //      city_locality: "Austin",
     //      state_province: "TX",
     //      postal_code: "78731",
     //      country_code: "US",
     //      address_residential_indicator: "no",
     // };
     // const packageDetails = {
     //      package_code: "package",
     //      weight: {
     //           value: 6,
     //           unit: "ounce",
     //      },
     // };
     if (!package) {
          return res.status(400).send({ error: "Carrier and package information are required." });
     }

     try {
          const rate = await calculate(carrierId, shipTo, shipFrom, package);

          // console.log("rate", rate);
          res.json({ rate, status: true });
     } catch (error) {
          res.status(500).send({ error: error.message });
     }
};
