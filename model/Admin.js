const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ADMIN_ROLE } = require("../schemas/Admin.schema");

const adminSchema = mongoose.Schema({
     firstname: {
          type: String,
          required: [true, "Please Include your first name"],
     },
     lastname: {
          type: String,
          required: [true, "Please Include your last name"],
     },
     email: {
          type: String,
          required: [true, "Please Include your email"],
     },
     adminId: {
          type: String,
          // required: [true, "Please Include your admin Id"],
     },
     chatID: {
          type: String,
     },
     image: {
          type: String,
     },
     status: {
          type: String,
          enum: ["active", "suspended", "banned"],
          default: "active",
     },
     browser: {
          type: String,
     },
     device: {
          type: String,
     },
     lastLogin: {
          type: String,
     },
     password: {
          type: String,
     },
     created_at: {
          type: Date,
          default: Date.now,
     },
     role: {
          type: String,
          default: ADMIN_ROLE.BasicAdmin,
          enum: [
               ADMIN_ROLE.BasicAdmin,
               ADMIN_ROLE.OperationsAdmin,
               ADMIN_ROLE.SuperAdmin,
               ADMIN_ROLE.CustomerCare,
               ADMIN_ROLE.EditorAdmin,
          ],
          required: [true, "Please include user role"],
     },
     tokens: [
          {
               token: {
                    type: String,
                    required: true,
               },
          },
     ],
});

adminSchema.pre("save", async function () {
     const user = this;
     if (user.isModified("password")) {
          user.password = await bcrypt.hash(user.password, 12);
     }

     var token = jwt.sign(
          {
               _id: user._id,
               firstname: user.firstname,
               lastname: user.lastname,
               adminId: user.adminId,
               email: user.email,
          },
          "adminsecret",
     );

     user.tokens = user.tokens.concat({ token });
     return token;
});

adminSchema.methods.generateAuthToken = async function () {
     const user = this;
     var token = jwt.sign(
          {
               _id: user._id,
               firstname: user.firstname,
               lastname: user.lastname,
               adminId: user.adminId,
               email: user.email,
          },
          "adminsecret",
          { expiresIn: "24h" },
     );
     user.tokens = user.tokens.concat({ token });
     await user.save();

     return token;
};

adminSchema.statics.findByCredentials = async (email, password) => {
     const user = await Adminuser.findOne({ email });

     if (!user) {
          return false;
     }

     const isPasswordMatch = await bcrypt.compare(password, user.password);

     if (!isPasswordMatch) {
          return false;
     }
     return user;
};
adminSchema.statics.getUsers = async () => {
     const users = await Adminuser.find({}).populate("role");
     if (!users) {
          return false;
     }
     return users;
};

const Adminuser = mongoose.model("Adminuser", adminSchema);
module.exports = Adminuser;
