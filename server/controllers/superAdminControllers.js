import { User } from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "superadmin" } });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeActivated = async (req, res) => {
  try {
    const { userId } = req.params;
    const { activated } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.activated = activated;
    await user.save();
    res.status(200).json({ message: "User activation status updated." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.role = newRole;
    await user.save();
    res.status(200).json({ message: "User role updated." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.remove();
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
