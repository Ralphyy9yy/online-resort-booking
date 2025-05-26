import { Router } from "express";
import { createConnection } from "mysql2/promise";

const router = Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "", // your DB password
  database: "easystay",
};

router.get("/summary", async (req, res) => {
  let connection;
  try {
    connection = await createConnection(dbConfig);

    // 1. Total bookings count
    const [[{ total_bookings }]] = await connection.execute(
      "SELECT COUNT(*) AS total_bookings FROM bookings"
    );

    // 2. Total revenue: sum price * quantity for confirmed bookings
    const [[{ total_revenue }]] = await connection.execute(`
      SELECT IFNULL(SUM(r.price * br.quantity), 0) AS total_revenue
      FROM bookings b
      JOIN booking_rooms br ON b.booking_id = br.booking_id
      JOIN rooms r ON br.room_id = r.room_id
      WHERE b.status = 'confirmed'
    `);

    // 3. Bookings grouped by status
    const [bookingsByStatus] = await connection.execute(
      "SELECT status, COUNT(*) AS count FROM bookings GROUP BY status"
    );

    // 4. Bookings per month with revenue (last 12 months)
    const [bookingsPerMonth] = await connection.execute(`
      SELECT
        DATE_FORMAT(b.booking_date, '%Y-%m') AS month,
        COUNT(DISTINCT b.booking_id) AS count,
        IFNULL(SUM(r.price * br.quantity), 0) AS revenue
      FROM bookings b
      JOIN booking_rooms br ON b.booking_id = br.booking_id
      JOIN rooms r ON br.room_id = r.room_id
      WHERE b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY month
      ORDER BY month
    `);

    const [frequentlyBookedRooms] = await connection.execute(`
      SELECT 
        rt.room_type_name AS room_name,
        SUM(br.quantity) AS count
      FROM booking_rooms br
      JOIN rooms r ON br.room_id = r.room_id
      JOIN roomtypes rt ON r.room_type_id = rt.room_type_id
      GROUP BY rt.room_type_name
      ORDER BY count DESC
      LIMIT 5
    `);

    await connection.end();

    res.json({
      total_bookings,
      total_revenue,
      bookings_by_status: bookingsByStatus,
      bookings_per_month: bookingsPerMonth,
      frequently_booked_rooms: frequentlyBookedRooms,
    });
  } catch (error) {
    if (connection) await connection.end();
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
