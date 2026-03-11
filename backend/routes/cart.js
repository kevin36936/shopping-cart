import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/items", authenticateToken, getCart);
router.post("/items", authenticateToken, addCartItem);
router.patch("/items/:productId", authenticateToken, updateCartItem);
router.delete("/items/:productId", authenticateToken, removeCartItem);
router.delete("/items", authenticateToken, clearCart);

export default router;
