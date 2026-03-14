import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getProfile, changePassword } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authenticateToken, getProfile);

router.post("/change-password", authenticateToken, changePassword);

export default router;
