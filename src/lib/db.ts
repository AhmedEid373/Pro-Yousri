import 'server-only';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

type ModelName =
  | 'siteConfig'
  | 'homeContent'
  | 'aboutContent'
  | 'servicesContent'
  | 'portfolioContent'
  | 'contactContent'
  | 'footerContent'
  | 'languagesConfig'
  | 'pagesContent'
  | 'messagesContent'
  | 'adminConfig';

const fileToModel: Record<string, ModelName> = {
  'site.json': 'siteConfig',
  'home.json': 'homeContent',
  'about.json': 'aboutContent',
  'services.json': 'servicesContent',
  'portfolio.json': 'portfolioContent',
  'contact.json': 'contactContent',
  'footer.json': 'footerContent',
  'languages.json': 'languagesConfig',
  'pages.json': 'pagesContent',
  'messages.json': 'messagesContent',
  'admin.json': 'adminConfig',
};

export async function readData<T>(filename: string, fallback?: T): Promise<T> {
  const model = fileToModel[filename];
  if (!model) throw new Error(`Unknown data file: ${filename}`);

  const record = await (prisma[model] as any).findUnique({ where: { id: 1 } });

  if (!record) {
    if (fallback !== undefined) {
      await writeData(filename, fallback);
      return fallback;
    }
    throw new Error(`No data found for: ${filename}`);
  }

  return record.data as T;
}

export async function writeData(filename: string, data: unknown): Promise<void> {
  const model = fileToModel[filename];
  if (!model) throw new Error(`Unknown data file: ${filename}`);

  await (prisma[model] as any).upsert({
    where: { id: 1 },
    create: { id: 1, data },
    update: { data },
  });
}
