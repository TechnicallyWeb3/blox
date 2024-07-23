import { getConnection } from './mysql';

interface User {
  user_index: number;
  blox_id: string;
  dynamic_id: string;
  total_points: number;
}

interface Referral {
  blox_id: string;
  referrer_id: string;
  direct_referrals: number;
  indirect_referrals: number;
}

interface Code {
  referral_code: string;
  blox_id: string;
  code_active: boolean;
}

interface Point {
  id: number;
  blox_id: string;
  timestamp: string;
  amount: number;
  issuer: string;
  reason: string;
}

async function fetchData(bloxId: string) {
  const connection = await getConnection();

  // Fetch user data
  const [users] = await connection.execute<User[]>('SELECT * FROM users WHERE blox_id = ?', [bloxId]);

  // Fetch referral data
  const [referrals] = await connection.execute<Referral[]>('SELECT * FROM referrals WHERE blox_id = ?', [bloxId]);

  // Fetch codes data
  const [codes] = await connection.execute<Code[]>('SELECT * FROM codes WHERE blox_id = ?', [bloxId]);

  // Fetch points data
  const [points] = await connection.execute<Point[]>('SELECT * FROM points WHERE blox_id = ?', [bloxId]);

  await connection.end();

  return {
    users: JSON.parse(JSON.stringify(users)),
    referrals: JSON.parse(JSON.stringify(referrals)),
    codes: JSON.parse(JSON.stringify(codes)),
    points: JSON.parse(JSON.stringify(points)),
  };
}

export default fetchData;