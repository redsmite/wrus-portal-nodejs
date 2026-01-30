import express from "express";
import { getConnection } from "../db/pool.js"; // your MariaDB pool
const router = express.Router();

/**
 * GET /api/water-users/view-map?city=CityName&barangay=BarangayName
 * Returns all water users in a specific barangay with valid latitude & longitude
 */
router.get("/", async (req, res) => {
  const { city, barangay } = req.query;

  if (!city || !barangay) {
    return res.status(400).json({ error: "City and Barangay are required" });
  }

  let conn;
  try {
    conn = await getConnection();
    // mariadb package returns rows directly, no destructuring
    const rows = await conn.query(
      `SELECT owner, latitude, longitude
       FROM water_users
       WHERE city = ? AND barangay = ? AND latitude IS NOT NULL AND longitude IS NOT NULL`,
      [city, barangay]
    );

    res.json({ data: rows }); // this will now include all 6 rows
  } catch (err) {
    console.error("Error fetching water users for barangay map:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    if (conn) conn.release();
  }
});


export default router;
