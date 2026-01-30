import mariadb from "mariadb";
import dotenv from "dotenv";

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectionLimit: 5,
  connectTimeout: 5000,
  // ⚠️ Important: convert BIGINT to string
  supportBigNumbers: true,
  bigNumberStrings: true
});

export async function getConnection() {
  try {
    const conn = await pool.getConnection();
    return conn;
  } catch (err) {
    console.error("❌ MariaDB connection error:", err.message);
    throw err;
  }
}

export default pool;
