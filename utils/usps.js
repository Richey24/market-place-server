const axios = require("axios");
const xml2js = require("xml2js");

async function getShippingRates(carrierId, shipTo, shipFrom, packageDetails) {
     const options = {
          method: "POST",
          url: "https://api.shipengine.com/v1/rates",
          headers: {
               "API-Key": "TEST_rgvT6i2zH3byzk3hFn4dxDJtH/Sf0bVwACxEowF8bvM",
               "Content-Type": "application/json",
          },
          data: {
               rate_options: {
                    carrier_ids: [carrierId],
               },
               shipment: {
                    validate_address: "no_validation",
                    ship_to: shipTo,
                    ship_from: shipFrom,
                    packages: [packageDetails],
               },
          },
     };

     try {
          const response = await axios(options);
          // console.log("response");
          return response.data;
     } catch (error) {
          console.error("Error:", error.response.data);
     }
}

// getShippingRates(carrierId, shipTo, shipFrom, packageDetails)
//      .then((data) => console.log("this", data))
//      .catch((error) => console.error("i typed this error", error));

// const USPS_USERNAME = "imarketplace";
// const USPS_PASSWORD = "Hab0glab0tribin";

// async function calculate(package11) {
//      const url = "https://secure.shippingapis.com/shippingapi.dll";

//      let package = {
//           weightPounds: 0.5,
//           weightOunces: 1,
//           length: 9.5,
//           width: 4.5,
//           height: 0.25,
//           originZip: "20001",
//           destinationZip: "94101",
//      };

//      console.log("package", package);
//      const xmlRequest = `<AddressValidateRequest USERID="69B00IMARK557"><Revision>1</Revision><Address><Address1>Suite 6100</Address1><Address2>185 Berry St</Address2><City>San Francisco</City><State>CA</State><Zip5>94556</Zip5><Zip4></Zip4>\</Address></AddressValidateRequest>`;

//      const encodedRequest = encodeURIComponent(xmlRequest);
//      const fullUrl = `${url}?API=Verify&xml=${encodedRequest}`;

//      try {
//           const response = await axios.get(fullUrl);
//           console.log("USPS API Response:", response.data);

//           const result = await xml2js.parseStringPromise(response.data);

//           if (result.Error) {
//                throw new Error(result.Error.Description[0]);
//           }
//           // Parse the result to extract the rate
//           return result.RateV4Response.Package[0].Postage[0].Rate[0];
//      } catch (error) {
//           throw new Error("USPS API request failed: " + error.message);
//      }
// }

module.exports = {
     calculate: getShippingRates,
};
