import express from "express";
import { getConnection } from "../../db/pool.js";

const router = express.Router();

// GET /api/dashboard/total-users
router.get("/", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const rows = await conn.query(`
      SELECT COUNT(*) AS total_users
      FROM water_users
    `);

    res.json({ total_users: rows[0].total_users });
  } catch (err) {
    console.error("❌ Total users count error:", err);
    res.status(500).json({ message: "Failed to fetch total users", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
