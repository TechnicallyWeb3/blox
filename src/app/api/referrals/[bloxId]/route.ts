import { NextResponse } from 'next/server';
import { getConnection } from '../../mysql';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bloxId = searchParams.get('bloxId');

  if (!bloxId) {
    return NextResponse.json({ error: 'Missing Blox ID' }, { status: 400 });
  }

  try {
    const connection = await getConnection();
    const [users] = await connection.execute('SELECT * FROM users WHERE blox_id = ?', [bloxId]);
    const [referrals] = await connection.execute('SELECT * FROM referrals WHERE blox_id = ?', [bloxId]);
    const [codes] = await connection.execute('SELECT * FROM codes WHERE blox_id = ?', [bloxId]);
    const [points] = await connection.execute('SELECT * FROM points WHERE blox_id = ?', [bloxId]);

    await connection.end();

    return NextResponse.json({
      users: JSON.parse(JSON.stringify(users)),
      referrals: JSON.parse(JSON.stringify(referrals)),
      codes: JSON.parse(JSON.stringify(codes)),
      points: JSON.parse(JSON.stringify(points)),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching referral data' }, { status: 500 });
  }
}