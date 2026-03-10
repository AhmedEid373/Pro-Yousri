import 'server-only';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export function readData<T>(filename: string, fallback?: T): T {
  const filePath = path.join(dataDir, filename);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    if (fallback !== undefined) return fallback;
    throw new Error(`Failed to read data file: ${filename}`);
  }
}

export function writeData(filename: string, data: unknown): void {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
