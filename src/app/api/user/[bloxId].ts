import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from 'mysql'; // Assuming you're using a MySQL client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { bloxId } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await query(`
        SELECT dynamic_id, blox_id, total_points
        FROM users
        WHERE blox_id = ?
      `, [bloxId]);

      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}