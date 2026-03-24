import 'server-only';
import pool from './postgres';

let tableReady = false;

async function ensureTable() {
  if (tableReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL
    )
  `);
  tableReady = true;
}

export async function readData<T>(key: string, fallback?: T): Promise<T> {
  try {
    await ensureTable();
    const result = await pool.query('SELECT value FROM content WHERE key = $1', [key]);
    if (result.rows.length === 0) {
      if (fallback !== undefined) {
        await writeData(key, fallback);
        return fallback;
      }
      throw new Error(`Data not found: ${key}`);
    }
    return result.rows[0].value as T;
  } catch (err) {
    // During build time the DB is unavailable — return fallback so the build succeeds
    if (fallback !== undefined) {
      console.warn(`[db] Could not read "${key}", using fallback:`, (err as Error).message);
      return fallback;
    }
    throw err;
  }
}

export async function writeData(key: string, data: unknown): Promise<void> {
  await ensureTable();
  await pool.query(
    `INSERT INTO content (key, value) VALUES ($1, $2::jsonb)
     ON CONFLICT (key) DO UPDATE SET value = $2::jsonb`,
    [key, JSON.stringify(data)]
  );
}
