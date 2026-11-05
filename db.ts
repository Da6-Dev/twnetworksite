import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const dbSslEnv = process.env.DB_SSL?.trim().toLowerCase();
const isSslExplicitlyDisabled = dbSslEnv === 'false' || dbSslEnv === '0';
const isSslExplicitlyEnabled = dbSslEnv === 'true' || dbSslEnv === '1';
const useSSL = isSslExplicitlyEnabled || (isProduction && !isSslExplicitlyDisabled);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/twnetwork?schema=public',
  max: Number(process.env.DB_POOL_MAX) || 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {})
});

pool.on('error', (err) => {
  console.error('❌ [DB POOL] Erro inesperado em cliente inativo do banco:', err?.message || err);
});

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}

