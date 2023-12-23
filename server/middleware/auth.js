import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const authenicateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    if (user.status === "inactive") {
      return res.status(401).json({
        message: "User is inactive.",
      });
    }
    if (user.emailVerified === false) {
      return res.status(401).json({
        message: "Email not verified.",
      });
    }
    if (user.activated === false) {
      return res.status(401).json({
        message: "User not activated.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed.",
    });
  }
};
