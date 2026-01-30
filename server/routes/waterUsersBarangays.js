import express from "express";
import { getConnection } from "../db/pool.js";

const router = express.Router();

/**
 * GET /api/water-users/barangays?city=CityName
 * Returns barangays for a specific city with user counts
 */
router.get("/", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ message: "City parameter is required" });

  let conn;
  try {
    conn = await getConnection();

    const rows = await conn.query(
      `
      SELECT barangay, COUNT(*) AS num_users
      FROM water_users
      WHERE city = ?
      GROUP BY barangay
      ORDER BY barangay
      `,
      [city]
    );

    res.json(rows || []);
  } catch (err) {
    console.error("❌ Fetch barangays error:", err.message);
    res.status(500).json({ message: "Failed to fetch barangays", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
