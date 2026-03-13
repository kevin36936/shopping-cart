import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/orders", authenticateToken, createOrder);

export default router;
