import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: NextRequest) {
  try {
    const { dynamic_id } = await request.json();

    if (!dynamic_id) {
      return NextResponse.json({ error: 'Dynamic ID is required' }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'blox_db',
      password: '1223Cale', // Ensure you use environment variables for sensitive data
    });

    // Generate new Blox ID
    const [rows] = await connection.execute('SELECT MAX(blox_id) AS max_id FROM users');
    const maxId = rows[0]?.max_id || 0;
    const newBloxId = maxId + 1;

    // Check if the user already exists
    const [existingUserRows] = await connection.execute('SELECT blox_id FROM users WHERE dynamic_id = ?', [dynamic_id]);

    if (existingUserRows.length > 0) {
      // If user exists, update the record if necessary
      await connection.execute('UPDATE users SET modified_date = NOW() WHERE dynamic_id = ?', [dynamic_id]);
    } else {
      // If user does not exist, create a new record
      await connection.execute('INSERT INTO users (dynamic_id, blox_id) VALUES (?, ?)', [dynamic_id, newBloxId]);
    }

    await connection.end();
    return NextResponse.json({ message: 'User ID saved successfully', blox_id: newBloxId });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}