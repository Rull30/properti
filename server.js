const fs = require('fs');
const path = require('path');
const vm = require('vm');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const prisma = require('./lib/prisma');
require('dotenv').config();

const app = express();
const ROOT_DIR = __dirname;
const VIEWS_DIR = path.join(ROOT_DIR, 'views');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const PAGE_ROUTES = require('./routes-manual');

const PORT = Number(process.env.PORT || 5500);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.set('views', VIEWS_DIR);
app.use(
  cors({
    origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map((s) => s.trim()),
  })
);

function loadWindowDataFromScript(scriptPath, key) {
  if (!fs.existsSync(scriptPath)) return [];
  const code = fs.readFileSync(scriptPath, 'utf8');
  const context = { window: {}, globalThis: {}, console };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: path.basename(scriptPath) });
  const fromWindow = context.window && context.window[key];
  const fromGlobal = context.globalThis && context.globalThis[key];
  const data = fromWindow || fromGlobal || [];
  return Array.isArray(data) ? JSON.parse(JSON.stringify(data)) : [];
}

function normalizeId(input) {
  return String(input == null ? '' : input).trim();
}

function nextIdFromRows(rows) {
  let maxId = 0;
  rows.forEach((row) => {
    const n = parseInt(String(row.id || ''), 10);
    if (!Number.isNaN(n) && n > maxId) maxId = n;
  });
  return String(maxId + 1);
}

async function seedIfNeeded() {
  const listingsSeed = loadWindowDataFromScript(path.join(ROOT_DIR, 'listings-data.js'), 'LISTINGS');
  const agentsSeed = loadWindowDataFromScript(path.join(ROOT_DIR, 'agents-data.js'), 'AGENTS');

  const [listingCount, agentCount] = await Promise.all([prisma.listing.count(), prisma.agent.count()]);

  if (listingCount === 0 && listingsSeed.length) {
    await prisma.listing.createMany({
      data: listingsSeed.map((item, index) => {
        const id = normalizeId(item && item.id) || String(index + 1);
        return { id, payload: { ...(item || {}), id } };
      }),
    });
  }

  if (agentCount === 0 && agentsSeed.length) {
    await prisma.agent.createMany({
      data: agentsSeed.map((item, index) => {
        const id = normalizeId(item && item.id) || String(index + 1);
        return { id, payload: { ...(item || {}), id } };
      }),
    });
  }
}

function toEntity(row) {
  const payload = row && typeof row.payload === 'object' && row.payload ? row.payload : {};
  const id = normalizeId(row && row.id);
  return { ...payload, id };
}

function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function sanitizeBaseName(name) {
  return String(name || 'file')
    .replace(/\.[^.]+$/, '')
    .replace(/[^\w\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'file';
}

function uniqueUploadName(originalName) {
  const ext = path.extname(originalName || '').toLowerCase() || '.jpg';
  const base = sanitizeBaseName(originalName);
  let candidate = `${base}${ext}`;
  let i = 1;
  while (fs.existsSync(path.join(UPLOADS_DIR, candidate))) {
    candidate = `${base}-${i}${ext}`;
    i += 1;
  }
  return candidate;
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      ensureUploadsDir();
      cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
      cb(null, uniqueUploadName(file.originalname));
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024, files: 20 },
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'properti-backend', port: PORT });
});

app.post('/api/upload-images', upload.array('images', 20), (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];
  const urls = files.map((f) => `/uploads/${f.filename}`);
  res.status(201).json({ uploaded: urls.length, files: urls });
});

app.get('/api/listings', asyncHandler(async (_req, res) => {
  const rows = await prisma.listing.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(rows.map(toEntity));
}));

app.get('/api/listings/:id', asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const row = await prisma.listing.findUnique({ where: { id } });
  if (!row) return res.status(404).json({ message: 'Listing tidak ditemukan.' });
  return res.json(toEntity(row));
}));

app.post('/api/listings', asyncHandler(async (req, res) => {
  const body = req.body || {};
  const requestedId = normalizeId(body.id);
  let id = requestedId;

  if (!id) {
    const rows = await prisma.listing.findMany({ select: { id: true } });
    id = nextIdFromRows(rows);
  }

  const item = { ...body, id };
  await prisma.listing.create({ data: { id, payload: item } });
  res.status(201).json(item);
}));

app.put('/api/listings/:id', asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Listing tidak ditemukan.' });

  const current = toEntity(existing);
  const updated = { ...current, ...req.body, id };
  await prisma.listing.update({ where: { id }, data: { payload: updated } });
  return res.json(updated);
}));

app.delete('/api/listings/:id', asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Listing tidak ditemukan.' });

  await prisma.listing.delete({ where: { id } });
  return res.json({ deleted: true, item: toEntity(existing) });
}));

app.get('/api/agents', asyncHandler(async (_req, res) => {
  const rows = await prisma.agent.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(rows.map(toEntity));
}));

app.get('/api/agents/:id', asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const row = await prisma.agent.findUnique({ where: { id } });
  if (!row) return res.status(404).json({ message: 'Agen tidak ditemukan.' });
  return res.json(toEntity(row));
}));

app.post('/api/agents', asyncHandler(async (req, res) => {
  const body = req.body || {};
  const requestedId = normalizeId(body.id);
  let id = requestedId;

  if (!id) {
    const rows = await prisma.agent.findMany({ select: { id: true } });
    id = nextIdFromRows(rows);
  }

  const item = { ...body, id };
  await prisma.agent.create({ data: { id, payload: item } });
  res.status(201).json(item);
}));

app.put('/api/agents/:id', asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const existing = await prisma.agent.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Agen tidak ditemukan.' });

  const current = toEntity(existing);
  const updated = { ...current, ...req.body, id };
  await prisma.agent.update({ where: { id }, data: { payload: updated } });
  return res.json(updated);
}));

app.delete('/api/agents/:id', asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const existing = await prisma.agent.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Agen tidak ditemukan.' });

  await prisma.agent.delete({ where: { id } });
  return res.json({ deleted: true, item: toEntity(existing) });
}));

// Static assets (JS/data/images) tetap dari root.
app.use(express.static(ROOT_DIR));
// Public assets (shared partials/components for frontend runtime fetch).
app.use(express.static(PUBLIC_DIR));
PAGE_ROUTES.forEach(({ route, view, redirect }) => {
  if (redirect) {
    app.get(route, (_req, res) => {
      res.redirect(302, redirect);
    });
    return;
  }

  app.get(route, (_req, res) => {
    res.render(view);
  });
});

app.get('*', (_req, res) => {
  res.status(404).render('index');
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
});

async function start() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL belum diatur. Isi di file .env');
  }

  await prisma.$connect();
  await seedIfNeeded();

  app.listen(PORT, () => {
    console.log(`Backend berjalan di http://127.0.0.1:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Gagal menjalankan backend:', err.message);
  process.exit(1);
});
