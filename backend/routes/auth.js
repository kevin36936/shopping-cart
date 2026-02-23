import express from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "../pool.js";
import "dotenv/config"

const router = express.Router();

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
        const existingUser = await pool.query(
            "select id from users where email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: "Email already registered" });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await pool.query(
            "Insert into users (email, password_hash) values ($1, $2) returning id, email, created_at",
            [email, hashedPassword]
        );

        const token = jwt.sign(
            { userId: newUser.rows[0].id, email: newUser.rows[0].email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User registered successfully",
            user: newUser.rows[0],
            token
        });
    }
    catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: "Email and password are required"});
    }

    try {
        const result = await pool.query(
            "select id, email, password_hash from users where email = $1",
            [email]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({error: "Invalid credentials"});
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(password, user.password_hash)

        if(!validPassword) {
            return res.status(401).json({error: "Invalid credentials"});
        }

        const token = jwt.sign(
            {userId: user.id, email:user.email},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email
            },
            token
        });
    } catch(err) {
        console.error("Login error:", err);
        res.status(500).json({error: "Internal server error"});
    }
});


export default router;