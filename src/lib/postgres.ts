import 'server-only';
import { Pool } from 'pg';

function createPool(): Pool {
  // Support DATABASE_URL as override, otherwise use individual env vars
  if (process.env.DATABASE_URL) {
    return new Pool({ connectionString: process.env.DATABASE_URL });
  }

  return new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB || 'pro-yousri',
  });
}

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

let pool: Pool;

if (process.env.NODE_ENV === 'development') {
  // In development, reuse pool across HMR reloads
  if (!global._pgPool) {
    global._pgPool = createPool();
  }
  pool = global._pgPool;
} else {
  pool = createPool();
}

export default pool;
