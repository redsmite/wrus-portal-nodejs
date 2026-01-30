import express from "express";
import { getConnection } from "../db/pool.js";

const router = express.Router();

/**
 * GET /api/water-users/grouped
 * Returns water users count grouped by city
 */
router.get("/", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const rows = await conn.query(`
      SELECT city, COUNT(*) AS num_users
      FROM water_users
      GROUP BY city
      ORDER BY city
    `);

    res.json(rows || []);
  } catch (err) {
    console.error("❌ Fetch grouped cities error:", err.message);
    res.status(500).json({ message: "Failed to fetch grouped cities", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
