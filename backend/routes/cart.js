import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getCartItems,
  insertCartItem,
  updateCartItemQuantity,
  deleteCartItem,
} from "../models/cart.js";

const router = express.Router();

router.post("/items", authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId;

  const pid = Number(productId);
  const qty = Number(quantity);
  if (!Number.isInteger(pid) || pid < 1) {
    return res
      .status(400)
      .json({ error: "Product ID must be a positive integer" });
  }

  if (!Number.isInteger(qty) || qty <= 0)
    return res.status(400).json({ error: "Quantity must be positive integer" });

  try {
    const cartItem = await insertCartItem(userId, pid, qty);
    res.status(201).json(cartItem);
  } catch (err) {
    if (err.code === "23503") {
      return res.status(404).json({ error: "Product not found" });
    }
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/items", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const items = await getCartItems(userId);
    const totalPrice =
      Math.round(
        items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100,
      ) / 100;
    res.status(200).json({ items, totalPrice });
  } catch (err) {
    console.error("Error fetching cart items: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/items/:productId", authenticateToken, async (req, res) => {
  const { newQuantity } = req.body;
  const productId = parseInt(req.params.productId);

  const quantity = Number(newQuantity);
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res
      .status(400)
      .json({ error: "Quantity must be a positive integer" });
  }
  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  const userId = req.user.userId;

  try {
    const updated = await updateCartItemQuantity(userId, productId, quantity);
    if (!updated) return res.status(404).json({ error: "Cart item not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/items/:productId", authenticateToken, async (req, res) => {
  const productId = parseInt(req.params.productId);
  if (isNaN(productId) || productId < 1) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  const userId = req.user.userId;

  try {
    const deleted = await deleteCartItem(userId, productId);
    if (!deleted) return res.status(404).json({ error: "Cart item not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
