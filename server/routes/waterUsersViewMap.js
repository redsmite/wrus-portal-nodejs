import express from "express";
import { getConnection } from "../db/pool.js";

const router = express.Router();

/**
 * GET /api/water-users
 * Optional query: ?barangay=<barangay>
 */
router.get("/", async (req, res) => {
  const { barangay } = req.query;

  if (!barangay) {
    return res.status(400).json({ message: "Barangay parameter is required" });
  }

  let conn;
  try {
    conn = await getConnection();

    const rows = await conn.query(
      `SELECT owner, street, latitude, longitude 
       FROM water_users 
       WHERE barangay = ? 
       ORDER BY owner`,
      [barangay]
    );

    res.json(rows || []);
  } catch (err) {
    console.error("❌ Failed to fetch water users by barangay:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
