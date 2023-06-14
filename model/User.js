const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
     firstname: {
          type: String,
          required: [true, "Please Include your first name"],
     },

     lastname: {
          type: String,
          required: [true, "Please include your last Name"],
     },

     email: {
          type: String,
          required: [true, "Please Include your email"],
     },

     status: {
          type: Boolean,
          default: 1,
     },
     role: {
          type: String,
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
userSchema.methods.generateAuthToken = async function () {
     const user = this;
     var token = jwt.sign(
          {
               _id: user._id,
               firstname: user.firstname,
               lastname: user.lastname,
               email: user.email,
               onboarded: user.onboarded,
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
     console.log(user);
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
