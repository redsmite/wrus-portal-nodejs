import express from "express";
import { getConnection } from "../db/pool.js";
const router = express.Router();

/**
 * GET /api/water-users/city-coordinates?city=CityName
 * Returns all water users for a city with valid latitude and longitude
 */
router.get("/", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City is required" });

  let conn;
  try {
    conn = await getConnection();

    // query the database
    const rows = await conn.query(
      `SELECT owner, latitude, longitude
       FROM water_users
       WHERE city = ? AND latitude IS NOT NULL AND longitude IS NOT NULL`,
      [city]
    );

    // rows should be an array
    if (!Array.isArray(rows)) {
      console.warn("Unexpected query result:", rows);
      return res.json({ data: [] });
    }

    res.json({ data: rows }); // <-- make sure data is always an array
  } catch (err) {
    console.error("Error fetching water users for map:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
