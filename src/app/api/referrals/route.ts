import type { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function POST(req: NextRequest) {
  const { dynamic_id } = await req.json();

  if (!dynamic_id) {
    return NextResponse.json({ error: 'Dynamic ID is required' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();

    // Fetch referral count and total points
    const [rows] = await connection.query(
      `SELECT 
        COALESCE((SELECT COUNT(*) FROM referrals WHERE referrer_id = u.blox_id), 0) AS direct_referrals,
        COALESCE((SELECT COUNT(*) FROM referrals AS r2 
                  JOIN referrals AS r1 ON r1.blox_id = r2.referrer_id 
                  WHERE r1.referrer_id = u.blox_id), 0) AS indirect_referrals,
        COALESCE(u.total_points, 0) AS total_points
      FROM users u
      WHERE u.dynamic_id = ?`,
      [dynamic_id]
    );

    connection.release();

    if (Array.isArray(rows) && rows.length > 0) {
      const result = rows[0] as { direct_referrals: number; indirect_referrals: number; total_points: number };

      return NextResponse.json({
        directReferrals: result.direct_referrals,
        indirectReferrals: result.indirect_referrals,
        totalPoints: result.total_points
      });
    } else {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching referral data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}