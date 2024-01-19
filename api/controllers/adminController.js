const Adminuser = require("../../model/Admin");
const jwt = require("jsonwebtoken");
const UAParser = require("ua-parser-js");
const { sendAdminWelcomeMail, sendAdminResetPasswordMail } = require("../../config/helpers");

exports.register = async (req, res) => {
     const { email, firstname, lastname, role, url } = req.body;
     try {
          const existingUser = await Adminuser.findOne({ email });
          if (existingUser)
               return res
                    .status(409)
                    .json({ message: "User already exist with this email", status: "409" });

          const adminId = generateAdminId();
          const newUser = new Adminuser({
               email,
               firstname,
               lastname,
               role,
               adminId: adminId,
          });
          console.log(newUser);
          const data = await newUser.save();
          const token = await newUser.generateAuthToken();
          sendAdminWelcomeMail(email, firstname, adminId, token, url);
          res.status(201).json({ user: data, token, status: "201" });
     } catch (error) {
          res.status(400).json({ error, status: "400" });
     }
};

exports.login = async (req, res) => {
     const { email, password } = req.body;
     try {
          const userAgent = req.headers["user-agent"];
          const parser = new UAParser(userAgent);
          const browserInfo = parser.getBrowser();
          const deviceName = parser.getDevice();
          const existingUser = await Adminuser.findByCredentials(email, password);
          if (!existingUser)
               return res.status(401).json({
                    error: "Login failed! Check authenthication credentails",
                    status: "401",
               });
          existingUser.browser = browserInfo.name;
          existingUser.device = deviceName.model;
          existingUser.lastLogin = new Date();
          await existingUser.save();
          const userWithoutPassword = {
               _id: existingUser._id,
               firstname: existingUser.firstname,
               lastname: existingUser.lastname,
               email: existingUser.email,
               adminId: existingUser?.adminId,
               image: existingUser?.image,
               role: existingUser?.role,
          };
          const token = await existingUser.generateAuthToken();
          res.status(201).json({ user: userWithoutPassword, token, status: "201" });
     } catch (error) {
          console.log(error);
          res.status(400).json({ error, status: "400" });
     }
};
exports.updateAdminDetails = async (req, res) => {
     try {
          const updatedUserData = {
               firstname: req.body?.firstname,
               lastname: req.body.lastname,
               email: req.body.email,
               image: req.body?.image,
               role: req.body?.role,
          };

          // Assuming you have a User model and a method like `updateUserById` to update a user by ID
          const updatedUser = await Adminuser.findByIdAndUpdate(
               req?.userData?._id ?? req.body.userId,
               updatedUserData,
               {
                    new: true,
               },
          );

          // Omit password from the updated user object before sending the response
          const userWithoutPassword = {
               _id: updatedUser._id,
               firstname: updatedUser.firstname,
               lastname: updatedUser.lastname,
               email: updatedUser.email,
               role: updatedUser.role,
          };

          res.status(200).json({ user: userWithoutPassword, status: "200" });
     } catch (error) {
          console.log("Error updating Admin details:", error);
          res.status(400).json({ error, status: "400" });
     }
};

exports.resetPassword = async (req, res) => {
     try {
          const { token, newPassword } = req.body;
          const decoded = jwt.verify(token, "adminsecret");
          const user = await Adminuser.findById(decoded._id);

          if (!user) {
               return res.status(404).json({ message: "User not found", status: "404" });
          }

          user.password = newPassword;
          await user.save();

          res.status(200).json({ message: "Password updated successfully", status: "200" });
     } catch (error) {
          console.error("Error updating password:", error);
          res.status(500).json({ error, status: "500" });
     }
};

exports.forgotPassword = async (req, res) => {
     try {
          const email = req.body.email;
          const url = req.body.url;
          const check = await Adminuser.findOne({ email: email });
          if (!check) {
               return res.status(401).json({ message: "No user found with email", status: "401" });
          }
          const token = jwt.sign(
               {
                    _id: check._id,
               },
               "adminsecret",
          );
          sendAdminResetPasswordMail(email, check.firstname, check.adminId, token, url);
          res.status(200).json({ message: "Reset Password Emaill Sent", status: "200" });
     } catch (error) {
          res.status(500).json({ error, status: "500" });
     }
};
exports.getAllUsers = async (req, res) => {
     try {
          const users = await Adminuser.find().select("-password -tokens");
          res.status(200).json({
               status: "200",
               user: users,
          });
     } catch (error) {
          console.error("Error fetching users:", error);
          res.status(500).json({ message: "Internal server error", status: "500" });
     }
};
exports.getSingleUser = async (req, res) => {
     try {
          const userId = req.params.userId;
          console.log("userid", userId);
          const user = await Adminuser.findById(userId).select("-password -tokens");
          if (!user) {
               return res.status(404).json({ message: "User not found", status: "404" });
          }
          res.status(200).json({
               status: "200",
               user: user,
          });
     } catch (error) {
          console.error("Error fetching single user:", error);
          res.status(500).json({ message: "Internal server error", status: "500" });
     }
};

// function generateRandomPassword() {
//      const randomPassword = Math.random().toString(36).slice(-8);
//      return randomPassword;
// }
function generateAdminId() {
     const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // String of uppercase letters
     const digits = "0123456789"; // String of digits
     const characters = letters + digits; // Combine letters and digits

     let adminId = "";

     for (let i = 0; i < 8; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          adminId += characters.charAt(randomIndex);
     }

     return adminId;
}
