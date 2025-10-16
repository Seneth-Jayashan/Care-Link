// controllers/adminController.js

import User from "../models/User.js";

/**
 * @desc    Get all users in the system
 * @route   GET /api/admin/users
 * @access  Private (Admin role)
 */
export const getAllUsers = async (req, res) => {
  try {
    // Find all users and exclude their password hashes from the result
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Update a user's active status
 * @route   PATCH /api/admin/users/:userId/status
 * @access  Private (Admin role)
 */
export const updateUserStatus = async (req, res) => {
  const { active } = req.body;

  if (typeof active !== "boolean") {
    return res.status(400).json({ msg: 'Invalid "active" status provided.' });
  }

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.active = active;
    await user.save();

    res.json({
      msg: `User has been ${active ? "activated" : "deactivated"}.`,
      user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
