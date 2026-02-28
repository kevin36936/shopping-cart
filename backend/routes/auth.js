import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {findUserByEmail, createUser, findUserForLogin} from "../models/auth.js"
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
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({ error: "Email already registered" });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await createUser(email, hashedPassword);

        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
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
        const user = await findUserForLogin(email)
        if (!user) {
            return res.status(401).json({error: "Invalid credentials"});
        }

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