const { generateKeyPair } = require("crypto");
const crypto = require("crypto");

const algorithm = "aes-256-cbc";

class DevService {
     encrypt = (text, secretKey) => {
          try {
               const iv = crypto.randomBytes(16);
               const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, "hex"), iv);
               let encrypted = cipher.update(text);
               encrypted = Buffer.concat([encrypted, cipher.final()]);
               return iv.toString("hex") + ":" + encrypted.toString("hex");
          } catch (error) {
               throw new Error("Encryption failed");
          }
     };

     decrypt = (text, secretKey) => {
          try {
               let textParts = text.split(":");
               const iv = Buffer.from(textParts.shift(), "hex");
               const encryptedText = Buffer.from(textParts.join(":"), "hex");
               const decipher = crypto.createDecipheriv(
                    algorithm,
                    Buffer.from(secretKey, "hex"),
                    iv,
               );
               let decrypted = decipher.update(encryptedText);
               decrypted = Buffer.concat([decrypted, decipher.final()]);
               return decrypted.toString();
          } catch (error) {
               throw new Error("Decryption failed");
          }
     };
     generateSecretKey = () => {
          return crypto.randomBytes(32).toString("hex");
     };
     verifyAccessToken = (token, secretKey) => {
          try {
               const decryptedToken = this.decrypt(token, secretKey);
               // Further validation logic can be added here if necessary
               return decryptedToken;
          } catch (error) {
               throw new Error("Access token verification failed");
          }
     };
}

module.exports = new DevService();
