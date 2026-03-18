import 'server-only';
import clientPromise from './mongodb';

const DB_NAME = 'pro-yousri';
const COLLECTION = 'content';

export async function readData<T>(key: string, fallback?: T): Promise<T> {
  const client = await clientPromise;
  const doc = await client.db(DB_NAME).collection(COLLECTION).findOne({ _key: key });
  if (!doc) {
    if (fallback !== undefined) {
      await writeData(key, fallback);
      return fallback;
    }
    throw new Error(`Data not found: ${key}`);
  }
  return doc.value as T;
}

export async function writeData(key: string, data: unknown): Promise<void> {
  const client = await clientPromise;
  await client.db(DB_NAME).collection(COLLECTION).replaceOne(
    { _key: key },
    { _key: key, value: data },
    { upsert: true }
  );
}
