import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const dataDir = path.join(process.cwd(), 'data');

function readJson(filename: string) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf-8'));
}

async function main() {
  console.log('Seeding database from JSON files...');

  await prisma.siteConfig.upsert({
    where: { id: 1 },
    create: { id: 1, data: readJson('site.json') },
    update: { data: readJson('site.json') },
  });

  await prisma.homeContent.upsert({
    where: { id: 1 },
    create: { id: 1, data: readJson('home.json') },
    update: { data: readJson('home.json') },
  });

  await prisma.aboutContent.upsert({
    where: { id: 1 },
    create: { id: 1, data: readJson('about.json') },
    update: { data: readJson('about.json') },
  });

  await prisma.servicesContent.upsert({
    where: { id: 1 },
    create: { id: 1, data: readJson('services.json') },
    update: { data: readJson('services.json') },
  });

  await prisma.portfolioContent.upsert({
    where: { id: 1 },
    create: { id: 1, data: readJson('portfolio.json') },
    update: { data: readJson('portfolio.json') },
  });

  await prisma.contactContent.upsert({
    where: { id: 1 },
    create: { id: 1, data: readJson('contact.json') },
    update: { data: readJson('contact.json') },
  });

  await prisma.footerContent.upsert({
    where: { id: 1 },
    create: { id: 1, data: readJson('footer.json') },
    update: { data: readJson('footer.json') },
  });

  await prisma.languagesConfig.upsert({
    where: { id: 1 },
    create: { id: 1, data: readJson('languages.json') },
    update: { data: readJson('languages.json') },
  });

  await prisma.pagesContent.upsert({
    where: { id: 1 },
    create: { id: 1, data: readJson('pages.json') },
    update: { data: readJson('pages.json') },
  });

  await prisma.messagesContent.upsert({
    where: { id: 1 },
    create: { id: 1, data: readJson('messages.json') },
    update: { data: readJson('messages.json') },
  });

  await prisma.adminConfig.upsert({
    where: { id: 1 },
    create: { id: 1, data: readJson('admin.json') },
    update: { data: readJson('admin.json') },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
