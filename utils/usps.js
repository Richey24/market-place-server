const axios = require("axios");
const xml2js = require("xml2js");

const USPS_USERNAME = "7JROBAN607837";
const USPS_PASSWORD = "4056CJ96JM1144N";

async function calculate(package11) {
     const url = "http://production.shippingapis.com/ShippingAPI.dll";

     let package = {
          weightPounds: 0.5,
          weightOunces: 1,
          length: 9.5,
          width: 4.5,
          height: 0.25,
          originZip: "20001",
          destinationZip: "94101",
     };

     console.log("package", package);
     const xmlRequest = `
    <RateV4Request USERID="${USPS_USERNAME}" PASSWORD="${USPS_PASSWORD}">
        <Revision>2</Revision>
        <Package ID="1ST">
            <Service>PRIORITY</Service>
            <ZipOrigination>10022</ZipOrigination> <!-- Replace with actual sender ZIP code -->
            <ZipDestination>${package.destinationZip}</ZipDestination>
            <Pounds>${package.weightPounds}</Pounds>
            <Ounces>${package.weightOunces}</Ounces>
            <Container>RECTANGULAR</Container>
            <Size>LARGE</Size>
            <Width>${package.width}</Width>
            <Length>${package.length}</Length>
            <Height>${package.height}</Height>
        </Package>
    </RateV4Request>
    `;

     const encodedRequest = encodeURIComponent(xmlRequest);
     const fullUrl = `${url}?API=RateV4&XML=${encodedRequest}`;

     try {
          const response = await axios.get(fullUrl);
          console.log("USPS API Response:", response.data);

          const result = await xml2js.parseStringPromise(response.data);

          if (result.Error) {
               throw new Error(result.Error.Description[0]);
          }
          // Parse the result to extract the rate
          return result.RateV4Response.Package[0].Postage[0].Rate[0];
     } catch (error) {
          throw new Error("USPS API request failed: " + error.message);
     }
}

module.exports = { calculate };
