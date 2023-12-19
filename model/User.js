const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { USER_ROLE } = require("../schemas/user.schema");

const currentDate = new Date();

const userSchema = mongoose.Schema({
     firstname: {
          type: String,
          required: [true, "Please Include your first name"],
     },
     tour: {
          type: String,
     },
     lastname: {
          type: String,
          required: [true, "Please include your last Name"],
     },

     email: {
          type: String,
          required: [true, "Please Include your email"],
     },
     currentSiteType: {
          type: String,
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
     suspensionEndDate: {
          type: Date,
          default: null,
     },
     role: {
          type: String,
          default: USER_ROLE.USER,
          enum: [USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.VENDOR],
          required: [true, "Please include user role"],
     },
     password: {
          type: String,
          required: [true, "Please Include your password"],
     },
     onboarded: {
          type: Boolean,
          default: false,
     },
     phone: {
          type: Number,
     },
     partner_id: {
          type: Number,
     },
     rated: {
          type: Array,
          default: [],
     },
     order_products: {
          type: Array,
          default: [],
     },
     suspensionCount: {
          type: Number,
          default: 0,
     },
     banReason: {
          type: String,
     },
     suspensionReasons: {
          type: [String],
          default: [],
     },
     partner_ids: [
          {
               id: { type: Number },
               domain: { type: String },
          },
     ],
     created_at: {
          type: Date,
          default: Date.now,
     },
     company: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
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

userSchema.pre("save", async function () {
     const user = this;
     if (user.isModified("password")) {
          user.password = await bcrypt.hash(user.password, 8);
     }

     var token = jwt.sign(
          { _id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email },
          "secret",
     );

     user.tokens = user.tokens.concat({ token });
     return token;
});

//this function generates an auth token for the user
userSchema.methods.generateAuthToken = async function (domain) {
     const user = this;
     var token = jwt.sign(
          {
               _id: user._id,
               firstname: user.firstname,
               lastname: user.lastname,
               email: user.email,
               onboarded: user.onboarded,
               partner_id: user?.partner_ids?.find((partner) => partner?.domain === domain)?.id,
          },
          "secret",
     );

     user.tokens = user.tokens.concat({ token });
     await user.save();

     return token;
};

//this method search for a user by email and password.
userSchema.statics.findByCredentials = async (email, password) => {
     const user = await User.findOne({ email });
     // console.log(user);
     if (!user) {
          return false;
     }

     const isPasswordMatch = await bcrypt.compare(password, user.password);
     if (!isPasswordMatch) {
          return false;
     }
     return user;
};

userSchema.statics.getUsers = async () => {
     const users = await User.find({}).populate("role");
     if (!users) {
          return false;
     }
     return users;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
