/**
 * Set passwordHash untuk semua agen yang belum punya password (atau semua jika FORCE=1).
 * Usage: node scripts/set-agent-passwords.js
 * Env: AGENT_DEFAULT_PASSWORD (default demo12345)
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

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
    console.error('DATABASE_URL belum diatur.');
    process.exit(1);
  }

  const plain = process.env.AGENT_DEFAULT_PASSWORD || 'demo12345';
  const hash = bcrypt.hashSync(plain, 10);
  const forceAll = process.env.FORCE === '1';

  await prisma.$connect();
  try {
    const agents = await prisma.agent.findMany({ select: { id: true, passwordHash: true } });
    let n = 0;
    for (const a of agents) {
      if (!forceAll && a.passwordHash) continue;
      await prisma.agent.update({ where: { id: a.id }, data: { passwordHash: hash } });
      n += 1;
    }
    console.log(`Password diperbarui untuk ${n} agen.`);
    console.log(`Gunakan sandi: ${plain}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
