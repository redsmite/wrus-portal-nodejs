import express from "express";
import { getConnection } from "../db/pool.js";

const router = express.Router();

/**
 * GET Permittee Statistics grouped by municipality
 */
router.get("/", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const rows = await conn.query(`
      SELECT 
        municipality AS city,
        SUM(CASE WHEN remarks IS NOT NULL THEN 1 ELSE 0 END) AS numbers_visited,
        COUNT(*) AS total_permits,
        ROUND(SUM(CASE WHEN remarks IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) AS percentage
      FROM permits
      GROUP BY municipality
      ORDER BY municipality ASC
    `);

    res.json(rows);

  } catch (err) {
    console.error("❌ Fetch permittee statistics error:", err);
    res.status(500).json({
      message: "Failed to fetch permittee statistics",
      error: err.message
    });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
