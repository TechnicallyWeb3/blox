import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: Request) {
  try {
    const { dynamic_id, wallet_address } = await request.json();

    // Function to generate a new Blox ID as an incrementing integer
    async function generateBloxId(): Promise<number> {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'blox_db',
        password: '1223Cale', // Ensure you use environment variables for sensitive data
      });

      // Get the current max Blox ID
      const [rows] = await connection.execute('SELECT MAX(blox_id) AS max_id FROM users');
      const maxId = rows[0]?.max_id || 0;

      await connection.end();

      return maxId + 1;
    }

    // Generate Blox ID
    const bloxId = await generateBloxId();

    // Return the generated Blox ID
    return NextResponse.json({ blox_id: bloxId });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}