import { Router } from 'express';
import pool from '../config/db.js';
const router = Router();

router.post('/', async (req, res) => {
    const { guest, checkIn, checkOut, rooms } = req.body;

    if (!guest.firstName || !guest.lastName || !guest.email || !guest.mobile) {
        return res.status(400).json({ error: 'All guest information is required.' });
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
        return res.status(400).json({ error: 'Check-out date must be after the check-in date.' });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Insert Guest Info
        const [guestResult] = await conn.query(
            'INSERT INTO guest (first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?)',
            [guest.firstName, guest.lastName, guest.email, guest.mobile || null]
        );
        const guestId = guestResult.insertId;

        // 2. Insert Booking Info
        const [bookingResult] = await conn.query(
            'INSERT INTO bookings (guest_id,room_id, check_in, check_out, status) VALUES (?, ?, ?, ?)',
            [guestId, checkIn, checkOut, 'confirmed']
        );
        const bookingId = bookingResult.insertId;

        // 3. Insert Each Room and Update leftRoom for each room
        for (const room of rooms) {
            // Check room availability
            const [updateResult] = await conn.query(
                'UPDATE rooms SET leftRoom = leftRoom - ? WHERE room_id = ? AND leftRoom >= ?',
                [room.quantity, room.id, room.quantity]
            );

            if (updateResult.affectedRows === 0) {
                throw new Error(`Not enough rooms available for room ID ${room.id}`);
            }

            // 4. Insert room booking details into booking_rooms
            await conn.query(
                'INSERT INTO booking_rooms (booking_id, room_id, quantity) VALUES (?, ?, ?)',
                [bookingId, room.id, room.quantity]
            );
        }

        await conn.commit();
        res.status(201).json({ message: 'Booking successful!' });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ error: 'Failed to complete booking' });
    } finally {
        conn.release();
    }
});



export default router;
