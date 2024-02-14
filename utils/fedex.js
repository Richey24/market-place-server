const axios = require("axios");
const xml2js = require("xml2js");

async function calculate(package) {
     const url = "https://wsbeta.fedex.com:443/web-services"; // Test URL

     const xmlRequest = `
    <RateRequest xmlns="http://fedex.com/ws/rate/v13">
        <WebAuthenticationDetail>
            <UserCredential>
                <Key>YOUR_DEVELOPER_KEY</Key>
                <Password>YOUR_DEVELOPER_PASSWORD</Password>
            </UserCredential>
        </WebAuthenticationDetail>
        <ClientDetail>
            <AccountNumber>YOUR_ACCOUNT_NUMBER</AccountNumber>
            <MeterNumber>YOUR_METER_NUMBER</MeterNumber>
        </ClientDetail>
        <TransactionDetail>
            <CustomerTransactionId>Rate Request</CustomerTransactionId>
        </TransactionDetail>
        <Version>
            <ServiceId>crs</ServiceId>
            <Major>13</Major>
            <Intermediate>0</Intermediate>
            <Minor>0</Minor>
        </Version>
        <RequestedShipment>
            <ShipTimestamp>${new Date().toISOString()}</ShipTimestamp>
            <DropoffType>REGULAR_PICKUP</DropoffType>
            <ServiceType>FEDEX_GROUND</ServiceType>
            <PackagingType>YOUR_PACKAGING</PackagingType>
            <Shipper>
                <Address>
                    <StreetLines>Sender Address Line 1</StreetLines>
                    <City>Sender City</City>
                    <StateOrProvinceCode>Sender State Code</StateOrProvinceCode>
                    <PostalCode>Sender Postal Code</PostalCode>
                    <CountryCode>Sender Country Code</CountryCode>
                </Address>
            </Shipper>
            <Recipient>
                <Address>
                    <StreetLines>Recipient Address Line 1</StreetLines>
                    <City>Recipient City</City>
                    <StateOrProvinceCode>Recipient State Code</StateOrProvinceCode>
                    <PostalCode>Recipient Postal Code</PostalCode>
                    <CountryCode>Recipient Country Code</CountryCode>
                    <Residential>false</Residential>
                </Address>
            </Recipient>
            <ShippingChargesPayment>
                <PaymentType>SENDER</PaymentType>
                <Payor>
                    <ResponsibleParty>
                        <AccountNumber>YOUR_ACCOUNT_NUMBER</AccountNumber>
                    </ResponsibleParty>
                </Payor>
            </ShippingChargesPayment>
            <PackageCount>1</PackageCount>
            <RequestedPackageLineItems>
                <SequenceNumber>1</SequenceNumber>
                <GroupPackageCount>1</GroupPackageCount>
                <Weight>
                    <Units>LB</Units>
                    <Value>${package.weight}</Value>
                </Weight>
                <Dimensions>
                    <Length>${package.length}</Length>
                    <Width>${package.width}</Width>
                    <Height>${package.height}</Height>
                    <Units>IN</Units>
                </Dimensions>
            </RequestedPackageLineItems>
        </RequestedShipment>
    </RateRequest>
    `;

     try {
          const response = await axios.post(url, xmlRequest, {
               headers: { "Content-Type": "text/xml" },
          });

          const result = await xml2js.parseStringPromise(response.data);
          return result.RateReply.RateReplyDetails[0].RatedShipmentDetails[0].ShipmentRateDetail[0]
               .TotalNetCharge[0].Amount[0];
     } catch (error) {
          throw new Error("FedEx API request failed: " + error.message);
     }
}

module.exports = { calculate };
