import { NextApiRequest, NextApiResponse } from 'next';
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

const generateReferralLink = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { bloxId } = req.body;

    if (!bloxId) {
        return res.status(400).json({ error: 'Missing bloxId' });
    }

    try {
        const referralCode = Math.random().toString(36).substr(2, 8).toUpperCase();

        await pool.query('CALL setReferralCode(?, ?, ?)', [bloxId, referralCode, true]);

        res.status(200).json({ referralCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default generateReferralLink;