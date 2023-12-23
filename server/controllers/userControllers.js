import { User } from "../models/userModel.js";

import {
  decodeAccessToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} from "../helpers/tokenHelper.js";
import { sendVerificationEmail } from "../helpers/sendMailHelper.js";
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
    const token = generateAccessToken({ user });
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
      const decoded = decodeAccessToken(token);
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
    const newToken = generateAccessToken({ email });
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
