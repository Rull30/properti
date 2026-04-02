const fs = require('fs');
const path = require('path');
const vm = require('vm');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const ROOT_DIR = __dirname;
const PAGES_DIR = path.join(ROOT_DIR, 'pages');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const LISTINGS_FILE = path.join(DATA_DIR, 'listings.json');
const AGENTS_FILE = path.join(DATA_DIR, 'agents.json');
const PAGE_ROUTES = require('./routes-manual');

const PORT = Number(process.env.PORT || 5500);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(
  cors({
    origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map((s) => s.trim()),
  })
);

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

function readJsonArray(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function writeJsonArray(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function normalizeId(input) {
  return String(input == null ? '' : input).trim();
}

function nextId(items) {
  let maxId = 0;
  items.forEach((item) => {
    const n = parseInt(String(item.id || ''), 10);
    if (!Number.isNaN(n) && n > maxId) maxId = n;
  });
  return String(maxId + 1);
}

function seedIfNeeded() {
  ensureDataDir();
  const hasListings = fs.existsSync(LISTINGS_FILE);
  const hasAgents = fs.existsSync(AGENTS_FILE);
  if (hasListings && hasAgents) return;

  const listingsSeed = loadWindowDataFromScript(path.join(ROOT_DIR, 'listings-data.js'), 'LISTINGS');
  const agentsSeed = loadWindowDataFromScript(path.join(ROOT_DIR, 'agents-data.js'), 'AGENTS');

  if (!hasListings) writeJsonArray(LISTINGS_FILE, listingsSeed);
  if (!hasAgents) writeJsonArray(AGENTS_FILE, agentsSeed);
}

seedIfNeeded();

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'properti-backend', port: PORT });
});

app.get('/api/listings', (_req, res) => {
  res.json(readJsonArray(LISTINGS_FILE));
});

app.get('/api/listings/:id', (req, res) => {
  const id = normalizeId(req.params.id);
  const data = readJsonArray(LISTINGS_FILE);
  const item = data.find((x) => normalizeId(x.id) === id);
  if (!item) return res.status(404).json({ message: 'Listing tidak ditemukan.' });
  return res.json(item);
});

app.post('/api/listings', (req, res) => {
  const data = readJsonArray(LISTINGS_FILE);
  const body = req.body || {};
  const item = { ...body, id: normalizeId(body.id) || nextId(data) };
  data.push(item);
  writeJsonArray(LISTINGS_FILE, data);
  res.status(201).json(item);
});

app.put('/api/listings/:id', (req, res) => {
  const id = normalizeId(req.params.id);
  const data = readJsonArray(LISTINGS_FILE);
  const idx = data.findIndex((x) => normalizeId(x.id) === id);
  if (idx === -1) return res.status(404).json({ message: 'Listing tidak ditemukan.' });
  const updated = { ...data[idx], ...req.body, id };
  data[idx] = updated;
  writeJsonArray(LISTINGS_FILE, data);
  return res.json(updated);
});

app.delete('/api/listings/:id', (req, res) => {
  const id = normalizeId(req.params.id);
  const data = readJsonArray(LISTINGS_FILE);
  const idx = data.findIndex((x) => normalizeId(x.id) === id);
  if (idx === -1) return res.status(404).json({ message: 'Listing tidak ditemukan.' });
  const removed = data.splice(idx, 1)[0];
  writeJsonArray(LISTINGS_FILE, data);
  return res.json({ deleted: true, item: removed });
});

app.get('/api/agents', (_req, res) => {
  res.json(readJsonArray(AGENTS_FILE));
});

app.get('/api/agents/:id', (req, res) => {
  const id = normalizeId(req.params.id);
  const data = readJsonArray(AGENTS_FILE);
  const item = data.find((x) => normalizeId(x.id) === id);
  if (!item) return res.status(404).json({ message: 'Agen tidak ditemukan.' });
  return res.json(item);
});

app.post('/api/agents', (req, res) => {
  const data = readJsonArray(AGENTS_FILE);
  const body = req.body || {};
  const item = { ...body, id: normalizeId(body.id) || nextId(data) };
  data.push(item);
  writeJsonArray(AGENTS_FILE, data);
  res.status(201).json(item);
});

app.put('/api/agents/:id', (req, res) => {
  const id = normalizeId(req.params.id);
  const data = readJsonArray(AGENTS_FILE);
  const idx = data.findIndex((x) => normalizeId(x.id) === id);
  if (idx === -1) return res.status(404).json({ message: 'Agen tidak ditemukan.' });
  const updated = { ...data[idx], ...req.body, id };
  data[idx] = updated;
  writeJsonArray(AGENTS_FILE, data);
  return res.json(updated);
});

app.delete('/api/agents/:id', (req, res) => {
  const id = normalizeId(req.params.id);
  const data = readJsonArray(AGENTS_FILE);
  const idx = data.findIndex((x) => normalizeId(x.id) === id);
  if (idx === -1) return res.status(404).json({ message: 'Agen tidak ditemukan.' });
  const removed = data.splice(idx, 1)[0];
  writeJsonArray(AGENTS_FILE, data);
  return res.json({ deleted: true, item: removed });
});

// Static assets (JS/data/images) tetap dari root.
app.use(express.static(ROOT_DIR));
// Public assets (shared partials/components for frontend runtime fetch).
app.use(express.static(PUBLIC_DIR));
// HTML pages dari folder pages.
app.use(express.static(PAGES_DIR));

PAGE_ROUTES.forEach(({ route, file }) => {
  app.get(route, (_req, res) => {
    res.sendFile(file);
  });
});

app.get('*', (_req, res) => {
  res.status(404).sendFile(path.join(PAGES_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend berjalan di http://127.0.0.1:${PORT}`);
});
