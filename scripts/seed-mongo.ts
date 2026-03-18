/**
 * One-time migration script: seeds MongoDB with the existing JSON data files.
 * Run once after setting up your MongoDB Atlas cluster:
 *
 *   MONGODB_URI="mongodb+srv://..." npx ts-node --skip-project scripts/seed-mongo.ts
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { MongoClient } from 'mongodb';

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
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI environment variable is not set.');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to MongoDB.');

  const db = client.db('pro-yousri');
  const collection = db.collection('content');

  for (const key of DATA_KEYS) {
    const filePath = join(process.cwd(), 'data', `${key}.json`);
    try {
      const raw = readFileSync(filePath, 'utf-8');
      const value = JSON.parse(raw);
      await collection.replaceOne(
        { _key: key },
        { _key: key, value },
        { upsert: true }
      );
      console.log(`  ✓ Seeded: ${key}`);
    } catch {
      console.warn(`  ✗ Skipped: ${key}.json (file not found or invalid JSON)`);
    }
  }

  // Create unique index on _key for fast lookups
  await collection.createIndex({ _key: 1 }, { unique: true });
  console.log('  ✓ Index created on _key');

  await client.close();
  console.log('\nSeeding complete. MongoDB is ready.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
