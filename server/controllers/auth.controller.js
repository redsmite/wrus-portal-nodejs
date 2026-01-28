import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getConnection } from "../db/pool.js";

/* ======================
   REGISTER
====================== */
export async function register(req, res) {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  let conn;
  try {
    conn = await getConnection();

    // check if user exists
    const existing = await conn.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // insert user
    await conn.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES (?, ?, ?)`,
      [username, email || null, passwordHash]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (conn) conn.release();
  }
}

/* ======================
   LOGIN
====================== */
export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  let conn;
  try {
    conn = await getConnection();

    const users = await conn.query(
      "SELECT id, username, password_hash, role, is_active FROM users WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({ message: "Account disabled" });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (conn) conn.release();
  }
}
