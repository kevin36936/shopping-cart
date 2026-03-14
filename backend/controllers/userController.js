import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findUserById,
  findUserWithPasswordById,
  updatePassword,
} from "../models/users.js";
import "dotenv/config";

export const getProfile = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
  const userId = req.user.userId;
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await findUserWithPasswordById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!oldPassword) {
      return res.status(400).json({ error: "Old password is required" });
    }
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "The password is wrong" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }
    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({ error: "New password must be different from old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const updatedUser = await updatePassword(userId, hashedPassword);

    if (!updatedUser) {
      return res.status(400).json({ error: "Password updated failed" });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(200).json({
      message: "Password updated successfully",
      user: { id: updatedUser.id, email: updatedUser.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
