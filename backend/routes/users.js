import express from "express";
import {authenticateToken} from "../middleware/auth.js"
import pool from "../pool.js"

const router = express.Router();

router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            "select id, email, created_at from users where id = $1",
            [userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({error: "User not found"});
        }

        res.json({user: result.rows[0]});
    } catch (err) {
        console.error("Profile error:", err);
        res.status(500).json({error: "Internal server error"});
    }
})

export default router;