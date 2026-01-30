import express from "express";
import { getConnection } from "../../db/pool.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const [totals] = await conn.query(`
      SELECT 
        COUNT(CASE WHEN remarks IS NOT NULL THEN 1 END) AS numbers_visited,
        COUNT(*) AS total_permits,
        ROUND(
          COUNT(CASE WHEN remarks IS NOT NULL THEN 1 END) / COUNT(*) * 100, 
          2
        ) AS percentage
      FROM permits
    `);

    res.json([totals]);

  } catch (err) {
    console.error("❌ Fetch permittee totals error:", err);
    res.status(500).json({
      message: "Failed to fetch permittee totals",
      error: err.message
    });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
