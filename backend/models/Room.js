import { Router } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const router = Router();

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'easystay',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

router.use(cors());

// Validate request fields (allow room_type_id to be null or number)
function validateRoomFields({ room_type_id, price, capacity, available_rooms }) {
  if (
    price === undefined ||
    capacity === undefined ||
    available_rooms === undefined
  ) {
    return false;
  }
  if (
    (room_type_id !== null && room_type_id !== undefined && typeof room_type_id !== 'number') ||
    typeof price !== 'number' ||
    typeof capacity !== 'number' ||
    typeof available_rooms !== 'number'
  ) {
    return false;
  }
  return true;
}

// GET /api/rooms - return leftRoom as available_rooms in response
router.get('/rooms', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.room_id, r.room_type_id, rt.room_type_name, r.price, r.capacity, r.leftRoom
      FROM rooms r
      JOIN roomtypes rt ON r.room_type_id = rt.room_type_id
      ORDER BY r.room_id
    `);

    // Map leftRoom to available_rooms and omit leftRoom from response
    const mappedRows = rows.map(({ leftRoom, ...rest }) => ({
      ...rest,
      available_rooms: leftRoom,
    }));

    res.json(mappedRows);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
});

// POST /api/rooms - map available_rooms to leftRoom for insert
router.post('/rooms', async (req, res) => {
  const { room_type_id, price, capacity, available_rooms } = req.body;

  if (!validateRoomFields({ room_type_id, price, capacity, available_rooms })) {
    return res.status(400).json({ message: 'Missing or invalid required fields' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO rooms (room_type_id, price, capacity, leftRoom) VALUES (?, ?, ?, ?)',
      [room_type_id, price, capacity, available_rooms]
    );
    res.status(201).json({ message: 'Room created', room_id: result.insertId });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Failed to create room' });
  }
});

// PUT /api/rooms/:id - map available_rooms to leftRoom for update
router.put('/rooms/:id', async (req, res) => {
  const { id } = req.params;
  const { room_type_id, price, capacity, available_rooms } = req.body;

  if (!validateRoomFields({ room_type_id, price, capacity, available_rooms })) {
    return res.status(400).json({ message: 'Missing or invalid required fields' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE rooms SET room_type_id = ?, price = ?, capacity = ?, leftRoom = ? WHERE room_id = ?',
      [room_type_id, price, capacity, available_rooms, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room updated' });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'Failed to update room' });
  }
});

// DELETE /api/rooms/:id
router.delete('/rooms/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM rooms WHERE room_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Failed to delete room' });
  }
});

export default router;
