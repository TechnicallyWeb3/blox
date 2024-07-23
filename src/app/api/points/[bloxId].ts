import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Define the API handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { bloxId } = req.query;

  if (req.method === 'GET') {
    // Validate that bloxId is provided
    if (typeof bloxId !== 'string') {
      return res.status(400).json({ error: 'Invalid bloxId' });
    }

    try {
      // Connect to the database
      const connection = await pool.getConnection();
      try {
        // Query to get total points for the given bloxId
        const [rows] = await connection.execute(
          `SELECT SUM(amount) AS totalPoints
           FROM points
           WHERE blox_id = ?`,
          [bloxId]
        );

        const totalPoints = rows[0]?.totalPoints || 0;
        res.status(200).json({ totalPoints });
      } finally {
        // Release the connection back to the pool
        connection.release();
      }
    } catch (error) {
      console.error('Error fetching points data:', error);
      res.status(500).json({ error: 'Error fetching points data' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}