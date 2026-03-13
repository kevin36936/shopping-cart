import { getCartItems, deleteAllFromCartItem } from "../models/cart.js";
import { createOrder as insertOrder, addOrderItems } from "../models/order.js";
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
