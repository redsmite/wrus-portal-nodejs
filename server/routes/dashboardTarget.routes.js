import express from "express";
import { getConnection } from "../db/pool.js";

const router = express.Router();

// GET /api/dashboard/target
router.get("/", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const year = new Date().getFullYear();

    const rows = await conn.query(
      "SELECT target FROM dashboard_targets WHERE year = ? LIMIT 1",
      [year]
    );

    if (rows.length > 0) {
      res.json({ target: rows[0].target });
    } else {
      res.json({ target: 0 }); // default if no row exists
    }
  } catch (err) {
    console.error("❌ Fetch dashboard target error:", err);
    res.status(500).json({ message: "Failed to fetch target", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// POST /api/dashboard/target
router.post("/", async (req, res) => {
  const { target } = req.body;
  if (!target || isNaN(target)) {
    return res.status(400).json({ message: "Invalid target value" });
  }

  let conn;
  try {
    conn = await getConnection();
    const year = new Date().getFullYear();

    // Check if row exists
    const rows = await conn.query(
      "SELECT id FROM dashboard_targets WHERE year = ? LIMIT 1",
      [year]
    );

    if (rows.length > 0) {
      // Update existing
      await conn.query("UPDATE dashboard_targets SET target = ? WHERE year = ?", [target, year]);
    } else {
      // Insert new
      await conn.query("INSERT INTO dashboard_targets (year, target) VALUES (?, ?)", [year, target]);
    }

    res.json({ message: "Target updated successfully", target });
  } catch (err) {
    console.error("❌ Save dashboard target error:", err);
    res.status(500).json({ message: "Failed to save target", error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
