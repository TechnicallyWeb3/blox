import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Set up the MySQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1223Cale',
    database: 'blox_db',
});

export async function POST(req: NextRequest) {
  try {
    const { dynamic_id, blox_id, referral_code } = await req.json();

    // Log received data for debugging
    console.log('Received data:', { dynamic_id, blox_id, referral_code });

    if (!dynamic_id || !blox_id) {
      throw new Error('dynamic_id and blox_id are required');
    }

    // Call the stored procedure
    const connection = await pool.getConnection();
    const [results] = await connection.query('CALL addUser(?, ?, ?)', [dynamic_id, blox_id, referral_code]);
    connection.release();

    // Log query results for debugging
    console.log('Query results:', results);

    return NextResponse.json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Error adding user:', error);

    // Provide more details in the error response
    return NextResponse.json({ error: 'Error adding user', details: error.message }, { status: 500 });
  }
}