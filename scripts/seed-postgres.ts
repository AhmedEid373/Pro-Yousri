/**
 * One-time migration script: seeds PostgreSQL with the existing JSON data files.
 * Run once after setting up your PostgreSQL database:
 *
 *   POSTGRES_HOST="..." POSTGRES_USER="..." POSTGRES_PASSWORD="..." POSTGRES_DB="pro-yousri" npx ts-node --skip-project scripts/seed-postgres.ts
 *
 * Or with a connection string:
 *   DATABASE_URL="postgresql://user:pass@host:5432/pro-yousri" npx ts-node --skip-project scripts/seed-postgres.ts
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { Client } from 'pg';

const DATA_KEYS = [
  'admin',
  'home',
  'about',
  'services',
  'portfolio',
  'contact',
  'footer',
  'pages',
  'site',
  'languages',
  'messages',
];

async function seed() {
  const client = process.env.DATABASE_URL
    ? new Client({ connectionString: process.env.DATABASE_URL })
    : new Client({
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB || 'pro-yousri',
      });

  await client.connect();
  console.log('Connected to PostgreSQL.');

  // Create table if it doesn't exist
  await client.query(`
    CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL
    )
  `);
  console.log('  ✓ Table "content" ready');

  for (const key of DATA_KEYS) {
    const filePath = join(process.cwd(), 'data', `${key}.json`);
    try {
      const raw = readFileSync(filePath, 'utf-8');
      const value = JSON.parse(raw);
      await client.query(
        `INSERT INTO content (key, value) VALUES ($1, $2::jsonb)
         ON CONFLICT (key) DO UPDATE SET value = $2::jsonb`,
        [key, JSON.stringify(value)]
      );
      console.log(`  ✓ Seeded: ${key}`);
    } catch {
      console.warn(`  ✗ Skipped: ${key}.json (file not found or invalid JSON)`);
    }
  }

  await client.end();
  console.log('\nSeeding complete. PostgreSQL is ready.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
