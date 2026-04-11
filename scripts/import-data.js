require('dotenv').config();

function buildDatabaseUrlFromParts() {
  const user = process.env.DATABASE_USER;
  const password = process.env.DATABASE_PASSWORD || '';
  const host = process.env.DATABASE_HOST || 'localhost';
  const port = process.env.DATABASE_PORT || '3306';
  const dbName = process.env.DATABASE_NAME;
  if (!user || !dbName) return '';
  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${dbName}`;
}

async function main() {
  const derivedUrl = buildDatabaseUrlFromParts();
  if (derivedUrl) process.env.DATABASE_URL = derivedUrl;
  if (!process.env.DATABASE_URL) {
    console.error('Atur DATABASE_URL atau DATABASE_USER + DATABASE_NAME (+ password) di .env');
    process.exit(1);
  }

  const path = require('path');
  const prisma = require('../lib/prisma');
  const { importDataFromJsonFiles } = require('../lib/importDataFromJson');

  const rootDir = path.join(__dirname, '..');
  await prisma.$connect();
  try {
    const result = await importDataFromJsonFiles(prisma, rootDir);
    console.log('Import selesai.');
    console.log(`  Baris di JSON: ${result.agentsImported} agen, ${result.listingsImported} listing`);
    console.log(`  Di database: ${result.agentCount} agen, ${result.listingCount} listing`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
