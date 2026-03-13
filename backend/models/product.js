import pool from "../pool.js";

export const getAllProducts = async (client = pool) => {
  const result = await client.query("select * from products");
  return result.rows;
};
