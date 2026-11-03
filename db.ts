import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/twnetwork?schema=public'
});

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}
