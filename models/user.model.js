const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userImageUrl: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
  category: {
    type: String,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  resetToken: {
    type: String,
    default: "",
  },
  resetTokenExpiry: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
