import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getConnection } from "./db/pool.js";


dotenv.config();

const app = express();

/* ======================
   Middleware
====================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   Health Check
====================== */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Express + MariaDB API running 🚀"
  });
});

app.get("/api/db-test", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const rows = await conn.query("SELECT 1 AS test");
    res.json({ success: true, rows });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  } finally {
    if (conn) conn.release();
  }
});

/* ======================
   Routes
====================== */
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);

/* ======================
   404 Handler
====================== */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ======================
   Server
====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
