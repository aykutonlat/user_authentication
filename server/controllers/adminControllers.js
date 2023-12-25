import { User } from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const changeActivated = async (req, res) => {
  try {
    const { userId } = req.params;
    const { activated } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    if (user.role !== "user") {
      return res
        .status(403)
        .json({ message: "Only user role can be updated." });
    }
    user.activated = activated;
    await user.save();
    res.status(200).json({
      message: "User activated status updated.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
