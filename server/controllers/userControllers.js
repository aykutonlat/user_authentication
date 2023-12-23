import { User } from "../models/userModel.js";

import {
  generateAccessToken,
  generateRefreshToken,
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
    const token = generateAccessToken({ email });
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
