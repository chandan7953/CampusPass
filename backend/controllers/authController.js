const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken = require("../utils/generateToken");

const { generateOTP } = require("../services/otpService");

const { sendEmail } = require("../services/emailService");

const apiResponse = require("../utils/apiResponse");

const ApiError = require("../utils/ApiError");

const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, mobile, password } = req.body;
    const role = "student";
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      role,
    });

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    res.status(201).json(
      apiResponse(201, "User registered successfully", {
        token,
        user,
      }),
    );
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    res.status(200).json(
      apiResponse(200, "Login successful", {
        token,
        user,
      }),
    );
  } catch (error) {
    next(error);
  }
};


const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const otp = generateOTP();

    user.otp = otp;

    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(
      email,
      "CampusPass OTP Verification",
      `<h2>Your OTP is ${otp}</h2>`,
    );

    res.status(200).json(apiResponse(200, "OTP sent successfully"));
  } catch (error) {
    next(error);
  }
};


const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    user.isVerified = true;

    user.otp = null;

    user.otpExpiry = null;

    await user.save();

    res.status(200).json(apiResponse(200, "OTP verified successfully"));
  } catch (error) {
    next(error);
  }
};

// ======================
// FORGOT PASSWORD
// ======================

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const otp = generateOTP();

    user.otp = otp;

    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(email, "Reset Password OTP", `<h2>Your OTP is ${otp}</h2>`);

    res.status(200).json(apiResponse(200, "Password reset OTP sent"));
  } catch (error) {
    next(error);
  }
};

// ======================
// RESET PASSWORD
// ======================

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      throw new ApiError(400, "Invalid OTP");
    }

    user.password = await bcrypt.hash(password, 10);

    user.otp = null;

    user.otpExpiry = null;

    await user.save();

    res.status(200).json(apiResponse(200, "Password reset successful"));
  } catch (error) {
    next(error);
  }
};

// ======================
// CURRENT USER
// ======================

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res
      .status(200)
      .json(apiResponse(200, "User fetched successfully", user));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
