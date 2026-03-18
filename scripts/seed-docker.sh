#!/bin/bash
# =================================================
# Seed MongoDB with data from JSON files
# Run ONCE after first deploy to populate the database
#
# Usage (from your VPS):
#   docker compose exec app sh /app/scripts/seed-docker.sh
# =================================================

echo "Seeding MongoDB from JSON files..."

node -e "
const { readFileSync } = require('fs');
const { join } = require('path');
const { MongoClient } = require('mongodb');

const keys = ['admin','home','about','services','portfolio','contact','footer','pages','site','languages','messages'];

(async () => {
  const client = await new MongoClient(process.env.MONGODB_URI).connect();
  const col = client.db('pro-yousri').collection('content');

  for (const k of keys) {
    try {
      const val = JSON.parse(readFileSync(join('/app/data', k + '.json'), 'utf-8'));
      await col.replaceOne({ _key: k }, { _key: k, value: val }, { upsert: true });
      console.log('  ✓ Seeded:', k);
    } catch (e) {
      console.warn('  ✗ Skipped:', k, e.message);
    }
  }

  await col.createIndex({ _key: 1 }, { unique: true });
  console.log('  ✓ Index created');
  await client.close();
  console.log('\\nDone! MongoDB is ready.');
})();
"
