import { getCartItems, deleteAllFromCartItem } from "../models/cart.js";
import {
  createOrder as insertOrder,
  addOrderItems,
  getOrdersWithItems,
} from "../models/order.js";
import pool from "../pool.js";

export const createOrder = async (req, res) => {
  const userId = req.user.userId;
  const { paymentIntentId } = req.body;
  const client = await pool.connect();
  try {
    await client.query("begin");
    const items = await getCartItems(userId, client);
    if (items.length == 0) {
      await client.query("ROLLBACK");
      client.release();
      return res.status(400).json({ error: "cart is empty" });
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await insertOrder(
      userId,
      total,
      "paid",
      paymentIntentId,
      client,
    );
    await addOrderItems(order.id, items, client);
    await deleteAllFromCartItem(userId, client);
    await client.query("commit");
    res.json({ orderId: order.id });
  } catch (err) {
    await client.query("rollback");
    console.error(err);
    res.status(500).json({ error: "Order creation failed" });
  } finally {
    client.release();
  }
};

export const getUserOrders = async (req, res) => {
  const userId = req.user.userId;
  try {
    const rows = await getOrdersWithItems(userId);
    if (!rows || rows.length === 0) {
      return res.json([]);
    }
    const ordersMap = new Map();
    for (const row of rows) {
      const orderId = row.order_id;

      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          id: orderId,
          totalAmount: row.total_amount,
          status: row.status,
          createdAt: row.created_at,
          items: [],
        });
      }

      ordersMap.get(orderId).items.push({
        productId: row.product_id,
        quantity: row.quantity,
        priceAtTime: row.price_at_time,
      });
    }

    const orders = Array.from(ordersMap.values());
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve order history" });
  }
};
