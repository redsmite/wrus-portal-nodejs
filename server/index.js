import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getConnection } from "./db/pool.js";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import permitsRoutes from "./routes/permits.routes.js";
import waterUsersRoutes from "./routes/waterUsers.routes.js";
import dashboardHomeRoutes from "./routes/dashboardHome.routes.js";
import dashboardTargetRoutes from "./routes/dashboardTarget.routes.js";
import permitteeStatisticsRoutes from "./routes/permitteeStatistics.routes.js";
import totalUsersRoutes from "./routes/dashboard/totalUsers.routes.js";
import totalPermitsRoutes from "./routes/dashboard/totalPermits.routes.js";
import waterUsersGroupedRouter from "./routes/waterUsersGrouped.js";
import waterUsersBarangaysRouter from './routes/waterUsersBarangays.js';
import waterUsersViewMapRouter from './routes/waterUsersViewMap.js';
import mapCityCoordinatesRouter from './routes/mapCityCoordinates.routes.js';
import mapBarangayCoordinatesRouter from './routes/mapBarangayCoordinates.routes.js';

dotenv.config();

const app = express();

/* ======================
   Middleware
====================== */
app.use(
  cors({
    origin: "http://localhost:5173", // React dev server
    credentials: true,
  })
);
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
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/permits", permitsRoutes);
app.use("/api/water-users", waterUsersRoutes);
app.use("/api/dashboard/home", dashboardHomeRoutes);
app.use("/api/dashboard/target", dashboardTargetRoutes);
app.use("/api/dashboard/permittee-statistics", permitteeStatisticsRoutes);
app.use("/api/dashboard/total-users", totalUsersRoutes);
app.use("/api/dashboard/total-permits", totalPermitsRoutes);
app.use('/api/water-users/grouped', waterUsersGroupedRouter);
app.use('/api/water-users/barangays', waterUsersBarangaysRouter);
app.use('/api/water-users/view-map', waterUsersViewMapRouter);
app.use('/api/water-users/city-coordinates', mapCityCoordinatesRouter);
app.use('/api/water-users/barangay-coordinates', mapBarangayCoordinatesRouter);

app.get("/favicon.ico", (req, res) => res.status(204));

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
