import { NextResponse } from 'next/server';
import { getConnection } from '../mysql';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const connection = await getConnection();

    const [users] = await connection.execute('SELECT * FROM users WHERE dynamic_id = ?', [userId]);
    const [referrals] = await connection.execute('SELECT * FROM referrals WHERE blox_id = ?', [userId]);
    const [codes] = await connection.execute('SELECT * FROM codes WHERE blox_id = ?', [userId]);
    const [points] = await connection.execute('SELECT * FROM points WHERE blox_id = ?', [userId]);

    await connection.end();

    return NextResponse.json({
      users,
      referrals,
      codes,
      points,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}