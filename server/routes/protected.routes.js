import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Only logged-in users
router.get("/user", authenticateToken, (req, res) => {
  res.json({ message: "Hello User!", user: req.user });
});

// Only admins
router.get("/admin", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Hello Admin!", user: req.user });
});

export default router;
