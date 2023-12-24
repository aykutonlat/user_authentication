import { User } from "../models/userModel.js";

import {
  decodeAccessToken,
  decodeRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../helpers/tokenHelper.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../helpers/sendMailHelper.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide all fields.",
      });
    }
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }
    const existingUserUsername = await User.findOne({ username });
    if (existingUserUsername) {
      return res.status(400).json({
        message: "Username already exists.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    const token = generateAccessToken(user);
    const sendMail = await sendVerificationEmail(email, token);
    if (!sendMail) {
      return res
        .status(500)
        .json({ message: "Error sending verification email." });
    }
    return res.status(201).json({
      message: "User created.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating user.",
    });
  }
};

export const verifiedMail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({
        message: "Please provide token.",
      });
    }
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({
        message:
          "Invalid or expired token. Please request a new verification email.",
        resendEmail: true,
      });
    }
    const user = await User.findOne(decoded.email);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    if (user.emailVerified === true) {
      return res.status(400).json({
        message: "Email already verified.",
      });
    }
    user.emailVerified = true;
    await user.save();
    return res.status(200).json({
      message: "Email verified.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error verifying email.",
    });
  }
};

export const resendVerifiedMail = async (req, res) => {
  try {
    let email;
    const { token } = req.params;
    if (token) {
      const decoded = verifyAccessToken(token);
      if (!decoded || !decoded.email) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }
      email = decoded.email;
    } else {
      email = req.body.email;
      if (!email) {
        return res.status(400).json({ message: "Please provide email." });
      }
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified." });
    }
    const newToken = generateAccessToken(email);
    const sendMail = await sendVerificationEmail(email, newToken);
    if (!sendMail) {
      return res
        .status(500)
        .json({ message: "Error sending verification email." });
    }
    return res.status(200).json({ message: "Verification email sent." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error resending verification email." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(400).json({ message: "Please provide all fields." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    return res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        registrationDate: user.registrationDate,
        activated: user.activated,
        status: user.status,
        profileImageUrl: user.profileImageUrl,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide email." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const token = generateAccessToken(user);
    const sendMail = await sendPasswordResetEmail(email, token);
    if (!sendMail) {
      return res
        .status(500)
        .json({ message: "Error sending password reset email." });
    }
    return res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error sending password reset email." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Please provide token." });
    }
    if (!password) {
      return res.status(400).json({ message: "Please provide password." });
    }
    const verified = verifyAccessToken(token);
    if (!verified) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    const decoded = decodeAccessToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    const user = await User.findOne({ email: decoded.payload.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password reset." });
  } catch (error) {
    return res.status(500).json({ message: "Error resetting password." });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Please provide refresh token." });
    }
    const decoded = decodeRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    const user = await User.findOne({ email: decoded.payload.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    const accessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error); // Hata loglaması ekleyin
    return res.status(500).json({ message: "Error refreshing token." });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { oldpassword, newpassword } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Please provide token." });
    }
    if (!oldpassword) {
      return res.status(400).json({ message: "Please provide old password." });
    }
    if (!newpassword) {
      return res.status(400).json({ message: "Please provide new password." });
    }
    const verified = verifyAccessToken(token);
    if (!verified) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    const decoded = decodeAccessToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    const user = await User.findOne({ email: decoded.payload.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const isMatch = await bcrypt.compare(oldpassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password changed." });
  } catch (error) {
    return res.status(500).json({ message: "Error changing password." });
  }
};
