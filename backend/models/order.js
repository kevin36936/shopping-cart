import pool from "../pool.js";

export async function createOrder(
  userId,
  total,
  status,
  paymentIntentId,
  client = pool,
) {
  const result = await client.query(
    `insert into orders (user_id, total_amount, status, stripe_payment_intent_id)
         values ($1, $2, $3, $4) returning id
        `,
    [userId, total, status, paymentIntentId],
  );
  return result.rows[0] || null;
}

export async function addOrderItems(orderId, items, client = pool) {
  const values = [];
  const placeholders = items
    .map((item, index) => {
      const offset = index * 4;
      values.push(orderId, item.product_id, item.quantity, item.price);
      return `($${offset + 1},$${offset + 2},$${offset + 3},$${offset + 4})`;
    })
    .join(", ");
  const result = await client.query(
    `insert into order_items (order_id, product_id, quantity, price_at_time)
    values ${placeholders}`,
    values,
  );
  return result.rows || null;
}

export async function getOrdersWithItems(userID, client = pool) {
  const result = await client.query(
    `select
     o.id as order_id,
    o.total_amount,
    o.status,
    o.created_at,
    oi.product_id,
    oi.quantity,
    oi.price_at_time
    from orders o join order_items oi
    on o.id = oi.order_id
    where o.user_id = $1
    order by o.created_at desc`,
    [userID],
  );
  return result.rows || null;
}
