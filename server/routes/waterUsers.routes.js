import express from "express";
import { getConnection } from "../db/pool.js";

const router = express.Router();

/**
 * GET /api/water-users
 * Server-side pagination: page & pageSize
 */
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  const search = req.query.search || ""; // ⚡ search term

  let conn;
  try {
    conn = await getConnection();

    // Count total records (with search)
    const totalRows = await conn.query(
      `SELECT COUNT(*) AS count 
       FROM water_users
       WHERE owner LIKE ? OR CONCAT(street, ', ', barangay, ', ', city) LIKE ?`,
      [`%${search}%`, `%${search}%`]
    );
    const total = totalRows[0].count;

    // Fetch page data (with search)
    const rows = await conn.query(
      `
      SELECT 
        owner,
        CONCAT(street, ', ', barangay, ', ', city) AS location,
        latitude,
        longitude,
        type,
        remarks
      FROM water_users
      WHERE owner LIKE ? OR CONCAT(street, ', ', barangay, ', ', city) LIKE ?
      ORDER BY owner
      LIMIT ? OFFSET ?
    `,
      [`%${search}%`, `%${search}%`, pageSize, offset]
    );

    res.json({
      data: rows || [],
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      totalRecords: total
    });
  } catch (err) {
    console.error("❌ Fetch water users error:", err);
    res.status(500).json({ message: "Failed to fetch water users", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
