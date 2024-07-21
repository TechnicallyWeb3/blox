import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request JSON
    const { blox_id } = await request.json();

    // Validate the blox_id
    if (!blox_id) {
      return NextResponse.json({ error: 'Blox ID is required' }, { status: 400 });
    }

    // Create a connection to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost', // Use environment variables
      user: process.env.DB_USER || 'root',
      database: process.env.DB_NAME || 'blox_db',
      password: process.env.DB_PASSWORD || '1223Cale', // Use environment variables
    });

    // Generate a unique referral code
    const referralCode = crypto.randomBytes(6).toString('hex');

    // Insert referral code into the database
    await connection.execute(
      'INSERT INTO referrals (blox_id, referral_code, expires_at) VALUES (?, ?, ?)',
      [blox_id, referralCode, new Date(Date.now() + 24 * 60 * 60 * 1000)] // Expires in 24 hours
    );

    // Close the database connection
    await connection.end();

    // Construct the referral link
    const referralLink = `http://localhost:3000/app/page?referral_code=${referralCode}`;
    return NextResponse.json({ referralLink });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}