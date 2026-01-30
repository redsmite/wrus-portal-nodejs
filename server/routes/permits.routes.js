import express from "express";
import { getConnection } from "../db/pool.js";

const router = express.Router();

/**
 * GET all permits
 * Client-side pagination will be handled in React
 */
router.get("/", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const rows = await conn.query(`
      SELECT
        Permit,
        Grantee,
        Location,
        Source,
        Type,
        Latitude,
        Longitude,
        Purpose,
        Date_App
      FROM permits
      ORDER BY Date_App DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ Fetch permits error:", err);
    res.status(500).json({
      message: "Failed to fetch permits",
      error: err.message
    });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
