const devService = require("../../../services/dev.service");

exports.generateAccessKeys = async (req, res) => {
     const { appId } = req.body;
     if (!appId) {
          return res.status(400).send("App ID is required");
     }

     try {
          // const accessKey = uuidv4();
          const decryptionKey = devService.generateSecretKey();
          const publicKey = devService.encrypt(appId, decryptionKey);

          res.json({ appId, publicKey, secretKey: decryptionKey });
     } catch (error) {
          res.status(500).send(error.message);
     }
};

exports.decryptAccessKeys = async (req, res) => {
     const { appId, publicKey, secretKey } = req.body;

     if (!appId || !publicKey) {
          return res.status(400).send("App ID and public key are required");
     }

     // if (!accessKeysData[appId] || accessKeysData[appId].publicKey !== publicKey) {
     //      return res.status(400).send("Invalid App ID or Public Key");
     // }

     try {
          const accessKey = devService.decrypt(publicKey, secretKey);
          res.json({ appId, accessKey });
     } catch (error) {
          res.status(500).send(error.message);
     }
};
