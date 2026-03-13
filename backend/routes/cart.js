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

router.get("/cart/items", authenticateToken, getCart);
router.post("/cart/items", authenticateToken, addCartItem);
router.patch("/cart/items/:productId", authenticateToken, updateCartItem);
router.delete("/cart/items/:productId", authenticateToken, removeCartItem);
router.delete("/cart/items", authenticateToken, clearCart);

export default router;
