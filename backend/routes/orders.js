import express from "express";
import { createOrder, getUserOrders } from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/orders", authenticateToken, createOrder);
router.get("/orders", authenticateToken, getUserOrders);

export default router;
