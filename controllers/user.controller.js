const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../utils/generateOTP");
const nodemailer = require("nodemailer");
const moment = require("moment");
const cloudinary = require("../utils/cloudinary");
const User = require("../models/user.model");

exports.register = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const { name, password, email, phoneNumber, category } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const otp = OTP.generateOTP();

    const newUser = new userModel({
      name,
      password: hashedPassword,
      email,
      phoneNumber,
      category,
      otp,
      otpExpiry: moment().add(30, "minutes").toDate(),
      userImageUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    await newUser.save();

    // Send OTP to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: req.body.email,
      subject: "OTP",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Failed to send OTP." });
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "OTP sent to your email." });
      }
    });

    res.status(201).json({
      status: "success",
      newUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);

      if (result) {
        const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET);
        res.status(200).json({
          status: "success",
          user,
          token,
        });
      } else {
        res
          .status(400)
          .json({ status: "fail", error: "username of password not correct" });
      }
    } else {
      res.status(400).json({ status: "fail", error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", error });
  }
};

// verify
exports.verify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({
      email,
      otp,
      otpExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or invalid OTP." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    user.verified = true;
    user.otp = "";
    await user.save();

    res.status(200).json({ message: "User verified successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to verify OTP." });
  }
};

// forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = OTP.generateOTP();

    // Send resetToken to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: req.body.email,
      subject: "Reset OTP",
      text: `Your OTP is: ${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Failed to send OTP." });
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "OTP sent to your email." });
      }
    });

    user.resetToken = resetToken;
    user.resetTokenExpiry = moment().add(30, "minutes").toDate();
    await user.save();

    res.status(200).json({ message: "Reset token sent successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to send reset token." });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    const user = await userModel.findOne({
      email,
      resetToken,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid reset token or token expired." });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    user.password = hashedPassword;
    user.resetToken = "";
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset password." });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "logout successfully",
  });
};

exports.getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
