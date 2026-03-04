import pool from "../pool.js";

export const getAllProducts = async () => {
  const result = await pool.query("select * from products");
  return result.rows;
};
