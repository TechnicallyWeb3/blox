import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const getReferralData = async (bloxId: string) => {
    try {
        const [rows] = await pool.query('SELECT * FROM referrals WHERE bloxId = ?', [bloxId]);
        return rows[0] || null; // Assuming the result is an array and we need the first item
    } catch (error) {
        throw new Error('Error fetching referral data');
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { bloxId } = req.query;

    if (typeof bloxId !== 'string') {
        return res.status(400).json({ error: 'Invalid bloxId' });
    }

    if (req.method === 'GET') {
        try {
            const data = await getReferralData(bloxId);
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json({ error: 'Referral data not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}