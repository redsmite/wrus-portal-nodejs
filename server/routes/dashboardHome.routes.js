import express from "express";
import { getConnection } from "../db/pool.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const rows = await conn.query(`
      SELECT year_conducted, COUNT(*) AS total
      FROM water_users
      GROUP BY year_conducted
      ORDER BY year_conducted DESC
    `);

    res.json(rows || []);
  } catch (err) {
    console.error("❌ Dashboard home summary error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard summary", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
