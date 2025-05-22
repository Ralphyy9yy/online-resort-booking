import { Router } from "express";
import mysql from "mysql2/promise";

const router = Router();

// Database configuration and pool creation
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",       // Put your DB password here
  database: "easystay",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function to query the database
async function query(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// GET /api/roomtypes - list all room types
router.get("/", async (req, res) => {
  try {
    const rows = await query(
      "SELECT room_type_id, room_type_name, description FROM roomtypes"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching room types:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
