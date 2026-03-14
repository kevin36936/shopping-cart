import pool from "../pool.js";

export async function findUserById(userId, client = pool) {
  const result = await client.query(
    `select id, email, created_at from users where id = $1`,
    [userId],
  );
  return result.rows[0] || null;
}

export async function findUserWithPasswordById(userId, client = pool) {
  const result = await client.query(
    `
    select * from users where id = $1`,
    [userId],
  );
  return result.rows[0] || null;
}

export async function updatePassword(userId, newHashedPassword, client = pool) {
  const result = await client.query(
    `update users
    set password_hash = $1
    where id = $2
    returning id, email`,
    [newHashedPassword, userId],
  );
  return result.rows[0] || null;
}
