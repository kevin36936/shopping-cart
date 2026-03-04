import pool from "../pool.js";

export const getHealth = async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    database: "unknown",
  };

  try {
    await pool.query("SELECT 1");
    healthcheck.database = "connected";
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = "Database connection failed";
    healthcheck.database = "disconnected";
    res.status(503).json(healthcheck);
  }
};
