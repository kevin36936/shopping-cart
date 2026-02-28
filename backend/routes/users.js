import express from "express";
import {authenticateToken} from "../middleware/auth.js"
import {findUserById} from "../models/users.js"

const router = express.Router();

router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await findUserById(userId);

        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        res.json({user});
    } catch (err) {
        console.error("Profile error:", err);
        res.status(500).json({error: "Internal server error"});
    }
})

export default router;