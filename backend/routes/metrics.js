import { Router } from "express";
import { createConnection } from "mysql2/promise";

const router = Router();

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "easystay",
};

// Metrics endpoint
router.get("/metrics", async (req, res) => {
  let connection;
  try {
    connection = await createConnection(dbConfig);

    const [[{ totalBookings }]] = await connection.query(
      "SELECT COUNT(*) AS totalBookings FROM bookings"
    );
    const [[{ pendingBookings }]] = await connection.query(
      "SELECT COUNT(*) AS pendingBookings FROM bookings WHERE status='pending'"
    );

    const [[{ cancelledBookings }]] = await connection.query(
      "SELECT COUNT(*) AS cancelledBookings FROM bookings WHERE status = 'cancelled'"
    );

    const [[{ upcomingBookings }]] = await connection.query(
      "SELECT COUNT(*) AS upcomingBookings FROM bookings WHERE start_date > NOW() AND status = 'confirmed'"
    );

    res.json({ totalBookings, pendingBookings, cancelledBookings, upcomingBookings });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  } finally {
    if (connection) await connection.end();
  }
});

router.get('/bookings/cancelled', async (req, res) => {
  let connection;
  try {
    connection = await createConnection(dbConfig);

    const [rows] = await connection.query(`
      SELECT 
        b.booking_id,
        CONCAT(g.first_name, ' ', g.last_name) AS guest_name,
        rt.room_type_name,
        DATE_FORMAT(b.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(b.end_date, '%Y-%m-%d') AS end_date,
        b.status,
        r.price
      FROM bookings b
      LEFT JOIN guest g ON b.guest_id = g.id
      LEFT JOIN booking_rooms br ON b.booking_id = br.booking_id
      LEFT JOIN rooms r ON br.room_id = r.room_id
      LEFT JOIN roomtypes rt ON r.room_type_id = rt.room_type_id
      WHERE b.status = 'cancelled'
      ORDER BY b.start_date DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching cancelled bookings:', error);
    res.status(500).json({ error: 'Failed to fetch cancelled bookings' });
  } finally {
    if (connection) await connection.end();
  }
});


// Recent bookings endpoint
router.get("/recent-bookings", async (req, res) => {
  let connection;
  try {
    connection = await createConnection(dbConfig);

    const [rows] = await connection.query(
      `SELECT
        b.booking_id,
        CONCAT(g.first_name, ' ', g.last_name) AS guest_name,
        rt.room_type_name,
        b.start_date,
        b.end_date,
        b.booking_date,
        b.status
      FROM bookings b
      LEFT JOIN guest g ON b.guest_id = g.id
      LEFT JOIN booking_rooms br ON b.booking_id = br.booking_id
      LEFT JOIN rooms r ON br.room_id = r.room_id
      LEFT JOIN roomtypes rt ON r.room_type_id = rt.room_type_id
      ORDER BY b.booking_date DESC
      LIMIT 5`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching recent bookings:", error);
    res.status(500).json({ error: "Failed to fetch recent bookings" });
  } finally {
    if (connection) await connection.end();
  }
});

// Messages endpoint
router.get("/messages", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const offset = (page - 1) * limit;

  let connection;
  try {
    connection = await createConnection(dbConfig);

    // Count total matching messages for pagination
    const [countResult] = await connection.query(
      `SELECT COUNT(*) AS total FROM messages WHERE name LIKE ? OR email LIKE ?`,
      [`%${search}%`, `%${search}%`]
    );
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Fetch paginated messages matching search
    const [rows] = await connection.query(
      `SELECT id, name, email, message, created_at
       FROM messages
       WHERE name LIKE ? OR email LIKE ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [`%${search}%`, `%${search}%`, limit, offset]
    );

    res.json({
      messages: rows,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  } finally {
    if (connection) await connection.end();
  }
});


// Rooms endpoint
router.get("/rooms", async (req, res) => {
  let connection;
  try {
    connection = await createConnection(dbConfig);

    const [rows] = await connection.query(`
      SELECT 
        r.room_id,
        r.price,
        r.capacity,
        r.leftRoom,
        rt.room_type_name
      FROM rooms r
      JOIN roomtypes rt ON r.room_type_id = rt.room_type_id
      ORDER BY r.room_id ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching rooms with types:", err);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    if (connection) await connection.end();
  }
});

// Bookings endpoint
router.get('/bookings', async (req, res) => {
  let connection;
  try {
    connection = await createConnection(dbConfig);

    const [rows] = await connection.query(`
    SELECT
    b.booking_id,
    CONCAT(g.first_name, ' ', g.last_name) AS guest_name,
    GROUP_CONCAT(DISTINCT rt.room_type_name ORDER BY rt.room_type_name SEPARATOR ', ') AS room_types,
    DATE_FORMAT(b.start_date, '%Y-%m-%d') AS start_date,
    DATE_FORMAT(b.end_date, '%Y-%m-%d') AS end_date,
    b.status,
    SUM(r.price * br.quantity) AS total_price,
    DATE_FORMAT(b.booking_date, '%Y-%m-%d %H:%i:%s') AS booking_date
FROM bookings b
LEFT JOIN guest g ON b.guest_id = g.id
LEFT JOIN booking_rooms br ON b.booking_id = br.booking_id
LEFT JOIN rooms r ON br.room_id = r.room_id
LEFT JOIN roomtypes rt ON r.room_type_id = rt.room_type_id
GROUP BY
    b.booking_id,
    g.first_name,
    g.last_name,
    b.start_date,
    b.end_date,
    b.status,
    b.booking_date
ORDER BY b.booking_date DESC;

    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  } finally {
    if (connection) await connection.end();
  }
});



router.post('/logout', (req, res) => {
  // If you use sessions:
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // Clear cookie if you use cookie sessions
      return res.status(200).json({ message: 'Logout successful' });
    });
  } else {
    // If you use JWT or stateless auth, just respond success
    res.status(200).json({ message: 'Logout successful' });
  }
});

router.get('/guests', async (req, res) => {
  let connection;
  try {
    connection = await createConnection(dbConfig);
    const [rows] = await connection.query(`
      SELECT 
        id,
        first_name,
        last_name,
        email,
        phone_number
      FROM guest
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching guests:", error);
    res.status(500).json({ error: "Failed to fetch guests" });  
  } finally {
    if (connection) await connection.end();
  }
});

// Update booking status
router.put('/bookings/:id', async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  if (!['confirmed', 'cancelled', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  let connection;
  try {
    connection = await createConnection(dbConfig);

    const [result] = await connection.query(
      'UPDATE bookings SET status = ? WHERE booking_id = ?',
      [status, bookingId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  } finally {
    if (connection) await connection.end();
  }
});

router.post("/bookings/:bookingId/add-room", async (req, res) => {
  const bookingId = req.params.bookingId;
  const { room_type_id, quantity } = req.body;

  if (!room_type_id || !quantity || quantity < 1) {
    return res.status(400).json({ error: "Invalid room type or quantity" });
  }

  let connection;
  try {
    connection = await createConnection(dbConfig);

    // Find a room of the requested type (simplified: pick first available)
    const [rooms] = await connection.query(
      "SELECT room_id, price FROM rooms WHERE room_type_id = ? LIMIT 1",
      [room_type_id]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ error: "Room type not found" });
    }

    const room = rooms[0];

    // Check if room already in booking
    const [existing] = await connection.query(
      "SELECT quantity FROM booking_rooms WHERE booking_id = ? AND room_id = ?",
      [bookingId, room.room_id]
    );

    if (existing.length > 0) {
      // Update quantity
      const newQuantity = existing[0].quantity + quantity;
      await connection.query(
        "UPDATE booking_rooms SET quantity = ? WHERE booking_id = ? AND room_id = ?",
        [newQuantity, bookingId, room.room_id]
      );
    } else {
      // Insert new room
      await connection.query(
        "INSERT INTO booking_rooms (booking_id, room_id, quantity) VALUES (?, ?, ?)",
        [bookingId, room.room_id, quantity]
      );
    }

    res.json({ message: "Room added successfully" });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.end();
  }
});

router.put("/bookings/:bookingId/extend", async (req, res) => {
  const { bookingId } = req.params;
  const { new_end_date } = req.body;

  if (!new_end_date) {
    return res.status(400).json({ error: "New end date is required" });
  }

  let connection;

  try {
    connection = await createConnection(dbConfig);

    const newEndDateObj = new Date(new_end_date);
    if (isNaN(newEndDateObj.getTime())) {
      await connection.end();
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Fetch current end date
    const [rows] = await connection.execute(
      "SELECT end_date FROM bookings WHERE booking_id = ?",
      [bookingId]
    );

    if (rows.length === 0) {
      await connection.end();
      return res.status(404).json({ error: "Booking not found" });
    }

    const currentEndDate = new Date(rows[0].end_date);
    if (newEndDateObj <= currentEndDate) {
      await connection.end();
      return res.status(400).json({
        error: "New end date must be after the current end date",
      });
    }

    // Update booking end date
    const [result] = await connection.execute(
      "UPDATE bookings SET end_date = ? WHERE booking_id = ?",
      [new_end_date, bookingId]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking extended successfully", new_end_date });
  } catch (error) {
    if (connection) await connection.end();
    console.error("Error extending booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Revenue endpoint: sum of prices for confirmed bookings
// Revenue endpoint: total revenue from confirmed bookings
router.get('/revenue', async (req, res) => {
  let connection;
  try {
    connection = await createConnection(dbConfig);

    // Sum total_amount or calculate from price * quantity * nights if you don't have total_amount
    // Adjust field names as per your schema
    const [[{ totalRevenue }]] = await connection.query(`
      SELECT IFNULL(SUM(r.price * br.quantity * DATEDIFF(b.end_date, b.start_date)), 0) AS totalRevenue
      FROM bookings b
      JOIN booking_rooms br ON b.booking_id = br.booking_id
      JOIN rooms r ON br.room_id = r.room_id
      WHERE b.status = 'confirmed'
    `);

    res.json({ totalRevenue });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ error: 'Failed to fetch revenue' });
  } finally {
    if (connection) await connection.end();
  }
});


// Get all cancelled bookings
router.get('/bookings/cancelled', async (req, res) => {
  let connection;
  try {
    connection = await createConnection(dbConfig);

    const [rows] = await connection.query(`
      SELECT 
        b.booking_id,
        CONCAT(g.first_name, ' ', g.last_name) AS guest_name,
        rt.room_type_name,
        DATE_FORMAT(b.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(b.end_date, '%Y-%m-%d') AS end_date,
        b.status,
        r.price
      FROM bookings b
      LEFT JOIN guest g ON b.guest_id = g.id
      LEFT JOIN booking_rooms br ON b.booking_id = br.booking_id
      LEFT JOIN rooms r ON br.room_id = r.room_id
      LEFT JOIN roomtypes rt ON r.room_type_id = rt.room_type_id
      WHERE b.status = 'cancelled'
      ORDER BY b.start_date DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching cancelled bookings:', error);
    res.status(500).json({ error: 'Failed to fetch cancelled bookings' });
  } finally {
    if (connection) await connection.end();
  }
});
router.get('/upcoming', async (req, res) => {
  let connection;
  try {
    connection = await createConnection(dbConfig);

    const [rows] = await connection.query(`
      SELECT
  b.booking_id,
  b.start_date,
  b.end_date,
  b.status,
  g.first_name,
  g.last_name,
  r.room_id,
  r.price,
  r.capacity,
  r.leftRoom,
  rt.room_type_name,
  br.quantity
FROM bookings b
JOIN guest g ON b.guest_id = g.id
JOIN booking_rooms br ON b.booking_id = br.booking_id
JOIN rooms r ON br.room_id = r.room_id
JOIN roomtypes rt ON r.room_type_id = rt.room_type_id
WHERE b.start_date >= CURDATE()
  AND b.status = 'confirmed'
ORDER BY b.start_date ASC;



    `);

    // Map to include guest full name
    const upcomingBookings = rows.map(row => ({
      booking_id: row.booking_id,
      start_date: row.start_date,
      end_date: row.end_date,
      status: row.status,
      guest_name: `${row.first_name} ${row.last_name}`,
      room_type_name: row.room_type_name,
    }));

    res.json(upcomingBookings);
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error);
    res.status(500).json({ error: "Failed to fetch upcoming bookings" });
  } finally {
    if (connection) await connection.end();
  }
});



export default router;
