import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
dotenv.config();
import contactRoutes from './routes/contact.js';
import bookingRoutes from './routes/booking.js';
import metricRoutes from './routes/metrics.js';
import paymentRoutes from './routes/payment.js';
import messages from './routes/messages.js';
import room from './models/Room.js';
import roomtypes from './routes/roomRoutes.js';
import reportRoutes from './routes/reports.js';
const app = express();
const PORT = process.env.PORT || 5000;

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json()); // to parse the body of incoming requests

// Serve static files (images) from the 'src/assets' folder
app.use('/assets', express.static(path.resolve('src/assets')));

// JWT Generator
const generateJwtToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
  };
  const secret = process.env.JWT_SECRET || 'your-jwt-secret';
  const options = { expiresIn: '1h' };

  return jwt.sign(payload, secret, options);
};

// Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM admins WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare the entered password with the stored hash
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Password comparison failed' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Password matched, generate a JWT token
      const token = generateJwtToken(user);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    });
  });
});

// Dashboard Route (protected)
app.get('/api/dashboard', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Token is valid, respond with user data (you could also query user data from DB)
    res.json({
      message: 'Welcome to the dashboard',
      user: decoded,
    });
  });
});

// Fetch Rooms Route with room types joined and images processed
// Fetch Rooms Route without image column
app.get('/api/rooms', (req, res) => {
  const query = `
    SELECT 
      r.room_id,
      r.room_type_id,
      rt.room_type_name AS name,
      r.price,
      r.capacity,
      r.leftRoom AS available_rooms,
      rt.description
    FROM 
      rooms r
    JOIN 
      roomtypes rt ON r.room_type_id = rt.room_type_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // No need to process image anymore
    res.json(results);
  });
});


// Add Booking Route
app.post('/api/bookings', (req, res) => {
  const { guest, checkIn, checkOut, rooms } = req.body;

  if (!guest || !checkIn || !checkOut || !rooms || rooms.length === 0) {
    return res.status(400).json({ message: 'Missing required booking information' });
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ error: 'Database transaction error' });
    }

    // 1. Insert guest
    const insertGuestQuery = `
      INSERT INTO guest (first_name, last_name, email, phone_number)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertGuestQuery, [guest.firstName, guest.lastName, guest.email, guest.mobile], (err, guestResult) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: 'Failed to insert guest' });
        });
      }

      const guestId = guestResult.insertId;

      // 2. Insert booking (one per guest)
      const insertBookingQuery = `
        INSERT INTO bookings (guest_id, start_date, end_date, status_id)
        VALUES (?, ?, ?, 1)
      `;

      db.query(insertBookingQuery, [guestId, checkIn, checkOut], (err, bookingResult) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Failed to insert booking' });
          });
        }

        const bookingId = bookingResult.insertId;

        // 3. Insert each room into booking_rooms
        const roomOps = rooms.map(room => {
          return new Promise((resolve, reject) => {
            // Check room availability
            db.query('SELECT leftRoom FROM rooms WHERE room_id = ?', [room.id], (err, results) => {
              if (err) return reject(err);
              const available = results[0]?.leftRoom || 0;

              if (available < room.quantity) {
                return reject(new Error(`Not enough availability for room ID ${room.id}`));
              }

              // Insert into booking_rooms
              const insertBookingRoomQuery = `
                INSERT INTO booking_rooms (booking_id, room_id, quantity)
                VALUES (?, ?, ?)
              `;
              db.query(insertBookingRoomQuery, [bookingId, room.id, room.quantity], (err) => {
                if (err) return reject(err);

                // Update leftRoom
                db.query(
                  'UPDATE rooms SET leftRoom = leftRoom - ? WHERE room_id = ?',
                  [room.quantity, room.id],
                  (err) => {
                    if (err) return reject(err);
                    resolve();
                  }
                );
              });
            });
          });
        });

        Promise.all(roomOps)
          .then(() => {
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: 'Commit failed' });
                });
              }

              res.status(201).json({ message: 'Booking successful', bookingId });
            });
          })
          .catch((err) => {
            db.rollback(() => {
              console.error(err);
              res.status(400).json({ error: err.message });
            });
          });
      });
    });
  });
});



// Get all booking statuses
app.get('/api/booking-statuses', (req, res) => {
  const query = 'SELECT * FROM bookingstatus';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});
  
{/*Contact Us Route*/}
app.use('/api/contact', contactRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', metricRoutes);
app.use('/api', paymentRoutes);
app.use('/api', messages);
app.use('/api', room);
app.use('/api/roomtypes', roomtypes);
app.use('/api/reports', reportRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
