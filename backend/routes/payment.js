  import { Router } from "express";
  import { createConnection } from 'mysql2/promise';

  const router = Router();

  const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'easystay',
  };

  router.post('/payment', async (req, res) => {
    const { paymentMethod, bookingDetails } = req.body;

    if (!paymentMethod || !bookingDetails) {
      return res.status(400).json({ message: 'Missing paymentMethod or bookingDetails' });
    }

    const { bookingId, amount } = bookingDetails;
    const amountNum = Number(amount);

    if (!bookingId || !amountNum || isNaN(amountNum)) {
      return res.status(400).json({ message: 'bookingId and valid amount are required in bookingDetails' });
    }

    const allowedPaymentMethods = ['gcash', 'paypal', 'cash'];
    const normalizedPaymentMethod = paymentMethod.toLowerCase();
    if (!allowedPaymentMethods.includes(normalizedPaymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    let connection;

    try {
      connection = await createConnection(dbConfig);
  
      // For now, simulate a transaction ID for testing
      const paymentStatus = normalizedPaymentMethod === 'cash' ? 'pending' : 'completed';
      const transactionId = 'SIMULATED-' + Date.now();

      // Insert payment record with status 'pending' and simulated transactionId
      const [result] = await connection.query(
        `INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id) VALUES (?, ?, ?, ?, ?)`,
        [bookingId, amountNum, normalizedPaymentMethod, paymentStatus, transactionId]
      );

      const paymentId = result.insertId;

      // Simulate payment processing by updating status to 'completed'
      await connection.query(
        `UPDATE payments SET status = ? WHERE payment_id = ?`,
        ['completed', paymentId]
      );

      // *** NEW: Update booking status to 'confirmed' after successful payment ***
      if(paymentStatus === 'completed'){
      await connection.query(
        `UPDATE bookings SET status = ? WHERE booking_id = ?`,
        ['confirmed', bookingId]
      );
    }
    await connection.commit();
      res.status(200).json({
        message: 'Payment processed successfully',
        paymentId,
        transactionId,
        status: paymentStatus,
      });
    } catch (error) {
      if(connection) await connection.rollback();
      console.error('Payment processing error:', error);
      res.status(500).json({ message: 'Payment processing failed' });
    } finally {
      if (connection) await connection.end();
    }
  });

  // GET /api/payments - fetch all payments
  router.get("/payments", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const bookingId = req.query.booking_id || "";
    const status = req.query.status || "";
    const method = req.query.method || "";
    const sortField = req.query.sortField || "payment_date";
    const sortOrder = req.query.sortOrder === "asc" ? "ASC" : "DESC";

    const offset = (page - 1) * limit;

    let connection;
    try {
      connection = await createConnection(dbConfig);

      // Validate sortField to prevent SQL injection (whitelist)
      const validSortFields = [
        "payment_id",
        "booking_id",
        "amount",
        "payment_method",
        "status",
        "transaction_id",
        "payment_date",
      ];
      const orderByField = validSortFields.includes(sortField) ? sortField : "payment_date";

      // Build WHERE clauses dynamically
      const whereClauses = [];
      const params = [];

      if (bookingId) {
        whereClauses.push("booking_id = ?");
        params.push(bookingId);
      }
      if (status) {
        whereClauses.push("status = ?");
        params.push(status);
      }
      if (method) {
        whereClauses.push("payment_method = ?");
        params.push(method);
      }

      const whereSql = whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";

      // Count total matching payments
      const [countResult] = await connection.query(
        `SELECT COUNT(*) AS total FROM payments ${whereSql}`,
        params
      );
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      // Fetch paginated payments
      const [rows] = await connection.query(
        `SELECT payment_id, booking_id, amount, payment_method, status, transaction_id, payment_date
        FROM payments
        ${whereSql}
        ORDER BY ${orderByField} ${sortOrder}
        LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      res.json({
        payments: rows,
        totalPages,
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    } finally {
      if (connection) await connection.end();
    }
  });
  export default router;
