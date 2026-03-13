import pool from "../pool.js";

export async function findUserById(userId, client = pool) {
  const result = await client.query(
    `select id, email, created_at from users where id = $1`,
    [userId],
  );
  return result.rows[0] || null;
}
