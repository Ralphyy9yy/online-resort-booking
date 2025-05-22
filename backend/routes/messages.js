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

// In your Express router
router.delete('/messages/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await createConnection(dbConfig);

    // Check if message exists
    const [rows] = await connection.query('SELECT id FROM messages WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Delete the message
    await connection.query('DELETE FROM messages WHERE id = ?', [id]);
    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Failed to delete message:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  } finally {
    if (connection) await connection.end();
  }
});

  export default router;