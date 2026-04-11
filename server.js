const fs = require('fs');
const path = require('path');
const vm = require('vm');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const prisma = require('./lib/prisma');
const { importDataFromJsonFiles } = require('./lib/importDataFromJson');
const {
  syncProvincesFromApi,
  ensureRegenciesInDb,
  ensureDistrictsInDb,
  syncAllWilayahToDb,
} = require('./lib/wilayahService');
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
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'properti-dev-secret-ganti-di-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
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

function normalizeEmail(input) {
  return String(input == null ? '' : input).trim().toLowerCase();
}

function toNumber(input, fallback = 0) {
  const n = Number(input);
  return Number.isFinite(n) ? n : fallback;
}

function toInt(input, fallback = 0) {
  const n = parseInt(String(input == null ? '' : input), 10);
  return Number.isNaN(n) ? fallback : n;
}

function nextIdFromRows(rows) {
  let maxId = 0;
  rows.forEach((row) => {
    const n = parseInt(String(row.id || ''), 10);
    if (!Number.isNaN(n) && n > maxId) maxId = n;
  });
  return String(maxId + 1);
}

function titleCaseWilayahName(s) {
  if (!s) return '';
  return String(s)
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Isi city & location dari nama kab/kota & kecamatan di DB (sesuai regencyId / districtId). */
async function applyListingCityLocationFromWilayah(prismaClient, data) {
  const out = { ...data };
  if (out.regencyId) {
    const r = await prismaClient.regency.findUnique({ where: { id: String(out.regencyId) } });
    if (r) out.city = titleCaseWilayahName(r.name);
  }
  if (out.districtId) {
    const d = await prismaClient.district.findUnique({ where: { id: String(out.districtId) } });
    if (d) out.location = titleCaseWilayahName(d.name);
  }
  return out;
}

function toListingCreateData(input, forcedId) {
  const item = input || {};
  const id = forcedId || normalizeId(item.id);
  return {
    id,
    title: String(item.title || ''),
    transaction: String(item.transaction || ''),
    type: String(item.type || ''),
    city: String(item.city || ''),
    location: String(item.location || ''),
    priceJuta: toNumber(item.priceJuta),
    beds: toInt(item.beds),
    baths: toInt(item.baths),
    land: toInt(item.land),
    build: toInt(item.build),
    cert: String(item.cert || ''),
    nego: Boolean(item.nego),
    date: String(item.date || ''),
    newProperty: Boolean(item.newProperty),
    lat: item.lat == null ? null : toNumber(item.lat),
    lng: item.lng == null ? null : toNumber(item.lng),
    locationRadiusM: item.locationRadiusM == null ? null : toInt(item.locationRadiusM),
    agentId: normalizeId(item.agentId) || null,
    whatsapp: String(item.whatsapp || ''),
    listingCode: String(item.listingCode || `LST-${id}`),
    installmentHint: String(item.installmentHint || ''),
    address: String(item.address || ''),
    floors: toInt(item.floors),
    electricity: String(item.electricity || ''),
    facing: String(item.facing || ''),
    image: String(item.image || ''),
    detailUrl: String(item.detailUrl || `properti-detail.html?id=${id}`),
    provinceId: normalizeId(item.provinceId) || null,
    regencyId: normalizeId(item.regencyId) || null,
    districtId: normalizeId(item.districtId) || null,
  };
}

function toAgentCreateData(input, forcedId) {
  const item = input || {};
  const id = forcedId || normalizeId(item.id);
  return {
    id,
    name: String(item.name || ''),
    agency: String(item.agency || ''),
    city: String(item.city || ''),
    listingCount: toInt(item.listingCount),
    yearsExp: toInt(item.yearsExp),
    verified: Boolean(item.verified),
    rating: toNumber(item.rating),
    reviewCount: toInt(item.reviewCount),
    phone: String(item.phone || ''),
    email: normalizeEmail(item.email),
    bio: String(item.bio || ''),
    joinDate: String(item.joinDate || ''),
  };
}

function toListingResponse(row) {
  return {
    id: row.id,
    title: row.title,
    transaction: row.transaction,
    type: row.type,
    city: row.city,
    location: row.location,
    provinceId: row.provinceId,
    regencyId: row.regencyId,
    districtId: row.districtId,
    provinceName: row.province ? row.province.name : '',
    regencyName: row.regency ? row.regency.name : '',
    districtName: row.district ? row.district.name : '',
    priceJuta: row.priceJuta,
    beds: row.beds,
    baths: row.baths,
    land: row.land,
    build: row.build,
    cert: row.cert,
    nego: row.nego,
    date: row.date,
    newProperty: row.newProperty,
    lat: row.lat,
    lng: row.lng,
    locationRadiusM: row.locationRadiusM,
    agentId: row.agentId,
    agentName: row.agent ? row.agent.name : '',
    whatsapp: row.whatsapp,
    listingCode: row.listingCode,
    installmentHint: row.installmentHint,
    address: row.address,
    floors: row.floors,
    electricity: row.electricity,
    facing: row.facing,
    images: row.images.map((x) => x.imageUrl),
    description: row.descriptions.map((x) => x.content),
    facilities: row.facilities.map((x) => x.content),
    image: row.image,
    detailUrl: row.detailUrl,
  };
}

function toAgentResponse(row) {
  if (!row) return {};
  return {
    id: row.id,
    name: row.name,
    agency: row.agency,
    city: row.city,
    areas: row.areas.map((x) => x.content),
    specialties: row.specialties.map((x) => x.content),
    listingCount: row.listingCount,
    yearsExp: row.yearsExp,
    verified: row.verified,
    rating: row.rating,
    reviewCount: row.reviewCount,
    phone: row.phone,
    email: row.email,
    bio: row.bio,
    joinDate: row.joinDate,
    listings: row.listings.map((x) => ({
      title: x.title,
      price: x.price,
      loc: x.loc,
      img: x.img,
      url: x.url,
    })),
  };
}

function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function requireAgentSession(req, res, next) {
  if (!req.session || !req.session.agentId) {
    return res.status(401).json({ message: 'Belum masuk sebagai agen.' });
  }
  req.agentId = req.session.agentId;
  return next();
}

function buildDatabaseUrlFromParts() {
  const user = process.env.DATABASE_USER;
  const password = process.env.DATABASE_PASSWORD || '';
  const host = process.env.DATABASE_HOST || 'localhost';
  const port = process.env.DATABASE_PORT || '3306';
  const dbName = process.env.DATABASE_NAME;

  if (!user || !dbName) return '';

  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${dbName}`;
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

const listingInclude = {
  agent: true,
  province: true,
  regency: true,
  district: true,
  images: { orderBy: { sortOrder: 'asc' } },
  descriptions: { orderBy: { sortOrder: 'asc' } },
  facilities: { orderBy: { sortOrder: 'asc' } },
};

const agentInclude = {
  areas: { orderBy: { sortOrder: 'asc' } },
  specialties: { orderBy: { sortOrder: 'asc' } },
  listings: { orderBy: { sortOrder: 'asc' } },
};

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

async function seedIfNeeded() {
  const [listingCount, agentCount] = await Promise.all([prisma.listing.count(), prisma.agent.count()]);
  if (listingCount > 0 || agentCount > 0) return;

  const agentsJson = path.join(ROOT_DIR, 'data', 'agents.json');
  const listingsJson = path.join(ROOT_DIR, 'data', 'listings.json');
  if (fs.existsSync(agentsJson) && fs.existsSync(listingsJson)) {
    await importDataFromJsonFiles(prisma, ROOT_DIR);
    return;
  }

  const listingsSeed = loadWindowDataFromScript(path.join(ROOT_DIR, 'listings-data.js'), 'LISTINGS');
  const agentsSeed = loadWindowDataFromScript(path.join(ROOT_DIR, 'agents-data.js'), 'AGENTS');

  const seedPassword = process.env.AGENT_DEFAULT_PASSWORD || 'demo12345';
  const seedPasswordHash = bcrypt.hashSync(seedPassword, 10);

  for (let i = 0; i < agentsSeed.length; i += 1) {
    const item = agentsSeed[i] || {};
    const id = normalizeId(item.id) || String(i + 1);
    const base = toAgentCreateData(item, id);
    await prisma.agent.create({
      data: {
        ...base,
        passwordHash: seedPasswordHash,
        areas: {
          create: (Array.isArray(item.areas) ? item.areas : []).map((value, idx) => ({
            content: String(value || ''),
            sortOrder: idx,
          })),
        },
        specialties: {
          create: (Array.isArray(item.specialties) ? item.specialties : []).map((value, idx) => ({
            content: String(value || ''),
            sortOrder: idx,
          })),
        },
        listings: {
          create: (Array.isArray(item.listings) ? item.listings : []).map((value, idx) => ({
            title: String((value && value.title) || ''),
            price: String((value && value.price) || ''),
            loc: String((value && value.loc) || ''),
            img: String((value && value.img) || ''),
            url: String((value && value.url) || ''),
            sortOrder: idx,
          })),
        },
      },
    });
  }

  for (let i = 0; i < listingsSeed.length; i += 1) {
    const item = listingsSeed[i] || {};
    const id = normalizeId(item.id) || String(i + 1);
    const base = toListingCreateData(item, id);
    const agentId = base.agentId && (await prisma.agent.findUnique({ where: { id: base.agentId } })) ? base.agentId : null;
    await prisma.listing.create({
      data: {
        ...base,
        agentId,
        images: {
          create: (Array.isArray(item.images) ? item.images : []).map((value, idx) => ({
            imageUrl: String(value || ''),
            sortOrder: idx,
          })),
        },
        descriptions: {
          create: (Array.isArray(item.description) ? item.description : []).map((value, idx) => ({
            content: String(value || ''),
            sortOrder: idx,
          })),
        },
        facilities: {
          create: (Array.isArray(item.facilities) ? item.facilities : []).map((value, idx) => ({
            content: String(value || ''),
            sortOrder: idx,
          })),
        },
      },
    });
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'properti-backend', port: PORT });
});

app.post('/api/upload-images', upload.array('images', 20), (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];
  const urls = files.map((f) => `/uploads/${f.filename}`);
  res.status(201).json({ uploaded: urls.length, files: urls });
});

app.post('/api/agent/auth/login', asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body && req.body.email);
  const password = String((req.body && req.body.password) || '');
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan kata sandi wajib diisi.' });
  }
  const agent = await prisma.agent.findUnique({ where: { email } });
  if (!agent || !agent.passwordHash || !bcrypt.compareSync(password, agent.passwordHash)) {
    return res.status(401).json({ message: 'Email atau kata sandi salah.' });
  }
  req.session.agentId = agent.id;
  req.session.agentEmail = agent.email;
  req.session.agentName = agent.name;
  return res.json({
    agent: {
      id: agent.id,
      name: agent.name,
      email: agent.email,
      agency: agent.agency,
      city: agent.city,
      phone: agent.phone,
    },
  });
}));

app.post('/api/agent/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get('/api/agent/me', asyncHandler(async (req, res) => {
  if (!req.session || !req.session.agentId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const agent = await prisma.agent.findUnique({
    where: { id: req.session.agentId },
    include: agentInclude,
  });
  if (!agent) {
    req.session.destroy(() => {});
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res.json({ agent: toAgentResponse(agent) });
}));

app.get('/api/agent/dashboard', requireAgentSession, asyncHandler(async (req, res) => {
  const agentId = req.agentId;
  const total = await prisma.listing.count({ where: { agentId } });
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recent = await prisma.listing.count({
    where: { agentId, updatedAt: { gte: weekAgo } },
  });
  return res.json({
    listingActive: total,
    listingUpdated7d: recent,
    views7d: 0,
    chatIn: 0,
    leadsNew: 0,
  });
}));

app.get('/api/agent/listings', requireAgentSession, asyncHandler(async (req, res) => {
  const rows = await prisma.listing.findMany({
    where: { agentId: req.agentId },
    include: listingInclude,
    orderBy: { updatedAt: 'desc' },
  });
  res.json(rows.map(toListingResponse));
}));

app.get('/api/agent/listings/:id', requireAgentSession, asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const row = await prisma.listing.findUnique({ where: { id }, include: listingInclude });
  if (!row) return res.status(404).json({ message: 'Listing tidak ditemukan.' });
  if (normalizeId(row.agentId) !== normalizeId(req.agentId)) {
    return res.status(403).json({ message: 'Listing bukan milik Anda.' });
  }
  return res.json(toListingResponse(row));
}));

app.post('/api/agent/listings', requireAgentSession, asyncHandler(async (req, res) => {
  const body = req.body || {};
  let id = normalizeId(body.id);
  if (!id) {
    const rows = await prisma.listing.findMany({ select: { id: true } });
    id = nextIdFromRows(rows);
  }
  let base = toListingCreateData(body, id);
  base.agentId = req.agentId;
  const ag = await prisma.agent.findUnique({ where: { id: req.agentId } });
  if (!base.whatsapp && ag && ag.phone) base.whatsapp = ag.phone;
  base = await applyListingCityLocationFromWilayah(prisma, base);
  const detailPath = `/properti-detail?id=${encodeURIComponent(id)}`;
  await prisma.listing.create({
    data: {
      ...base,
      detailUrl: body.detailUrl ? String(body.detailUrl) : detailPath,
      images: {
        create: (Array.isArray(body.images) ? body.images : []).map((value, idx) => ({
          imageUrl: String(value || ''),
          sortOrder: idx,
        })),
      },
      descriptions: {
        create: (Array.isArray(body.description) ? body.description : []).map((value, idx) => ({
          content: String(value || ''),
          sortOrder: idx,
        })),
      },
      facilities: {
        create: (Array.isArray(body.facilities) ? body.facilities : []).map((value, idx) => ({
          content: String(value || ''),
          sortOrder: idx,
        })),
      },
    },
  });
  const created = await prisma.listing.findUnique({ where: { id }, include: listingInclude });
  res.status(201).json(toListingResponse(created));
}));

app.put('/api/agent/listings/:id', requireAgentSession, asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Listing tidak ditemukan.' });
  if (normalizeId(existing.agentId) !== normalizeId(req.agentId)) {
    return res.status(403).json({ message: 'Listing bukan milik Anda.' });
  }
  const merged = { ...existing, ...req.body, id };
  let base = toListingCreateData(merged, id);
  base.agentId = req.agentId;
  base = await applyListingCityLocationFromWilayah(prisma, base);
  await prisma.$transaction(async (tx) => {
    await tx.listing.update({
      where: { id },
      data: { ...base },
    });
    await tx.listingImage.deleteMany({ where: { listingId: id } });
    await tx.listingDescription.deleteMany({ where: { listingId: id } });
    await tx.listingFacility.deleteMany({ where: { listingId: id } });
    const images = Array.isArray(req.body.images) ? req.body.images : [];
    const descs = Array.isArray(req.body.description) ? req.body.description : [];
    const facilities = Array.isArray(req.body.facilities) ? req.body.facilities : [];
    if (images.length) {
      await tx.listingImage.createMany({
        data: images.map((value, idx) => ({
          listingId: id,
          imageUrl: String(value || ''),
          sortOrder: idx,
        })),
      });
    }
    if (descs.length) {
      await tx.listingDescription.createMany({
        data: descs.map((value, idx) => ({
          listingId: id,
          content: String(value || ''),
          sortOrder: idx,
        })),
      });
    }
    if (facilities.length) {
      await tx.listingFacility.createMany({
        data: facilities.map((value, idx) => ({
          listingId: id,
          content: String(value || ''),
          sortOrder: idx,
        })),
      });
    }
  });
  const updated = await prisma.listing.findUnique({ where: { id }, include: listingInclude });
  return res.json(toListingResponse(updated));
}));

app.put('/api/agent/profile', requireAgentSession, asyncHandler(async (req, res) => {
  const body = req.body || {};
  const id = req.agentId;
  const data = {};
  if (body.name != null) data.name = String(body.name);
  if (body.agency != null) data.agency = String(body.agency);
  if (body.city != null) data.city = String(body.city);
  if (body.phone != null) data.phone = String(body.phone);
  if (body.bio != null) data.bio = String(body.bio);
  const updated = await prisma.agent.update({ where: { id }, data, include: agentInclude });
  req.session.agentName = updated.name;
  return res.json({ agent: toAgentResponse(updated) });
}));

/**
 * Satu respons: provinsi → kab/kab → kecamatan (tersimpan di DB).
 * Pertama kali: sinkron penuh dari API (bisa beberapa menit). Selanjutnya: cepat dari DB.
 * Query: ?refresh=1 — paksa unduh ulang semua; ?skipSync=1 — hanya baca DB (tanpa jaringan).
 */
app.get('/api/wilayah/all', asyncHandler(async (req, res) => {
  const refresh = req.query.refresh === '1';
  const skipSync = req.query.skipSync === '1';

  if (!skipSync) {
    const needFull =
      refresh ||
      (await prisma.regency.count()) === 0 ||
      (await prisma.district.count()) === 0;
    if (needFull) {
      try {
        await syncAllWilayahToDb(prisma);
      } catch (e) {
        console.error('syncAllWilayahToDb:', e);
        return res.status(503).json({
          message: 'Gagal sinkron data wilayah Indonesia. Coba lagi atau periksa koneksi.',
          detail: process.env.NODE_ENV === 'development' ? String(e.message) : undefined,
        });
      }
    }
  }

  const rows = await prisma.province.findMany({
    orderBy: { id: 'asc' },
    include: {
      regencies: {
        orderBy: { name: 'asc' },
        include: {
          districts: { orderBy: { name: 'asc' } },
        },
      },
    },
  });

  const provinces = rows.map((p) => ({
    id: p.id,
    name: p.name,
    regencies: p.regencies.map((r) => ({
      id: r.id,
      name: r.name,
      provinceId: r.provinceId,
      districts: r.districts.map((d) => ({
        id: d.id,
        name: d.name,
        regencyId: d.regencyId,
      })),
    })),
  }));

  res.json({ provinces });
}));

app.get('/api/wilayah/provinces', asyncHandler(async (_req, res) => {
  const count = await prisma.province.count();
  if (count === 0) {
    try {
      await syncProvincesFromApi(prisma);
    } catch (e) {
      console.error('syncProvincesFromApi:', e);
      return res.status(503).json({
        message: 'Gagal mengunduh data provinsi. Periksa koneksi internet atau coba lagi.',
        detail: process.env.NODE_ENV === 'development' ? String(e.message) : undefined,
      });
    }
  }
  const rows = await prisma.province.findMany({ orderBy: { id: 'asc' } });
  res.json(rows.map((p) => ({ id: p.id, name: p.name })));
}));

app.get('/api/wilayah/regencies/:provinceId', asyncHandler(async (req, res) => {
  const pid = normalizeId(req.params.provinceId);
  await ensureRegenciesInDb(prisma, pid);
  const rows = await prisma.regency.findMany({ where: { provinceId: pid }, orderBy: { name: 'asc' } });
  res.json(rows.map((r) => ({ id: r.id, name: r.name, provinceId: r.provinceId })));
}));

app.get('/api/wilayah/districts/:regencyId', asyncHandler(async (req, res) => {
  const rid = normalizeId(req.params.regencyId);
  await ensureDistrictsInDb(prisma, rid);
  const rows = await prisma.district.findMany({ where: { regencyId: rid }, orderBy: { name: 'asc' } });
  res.json(rows.map((d) => ({ id: d.id, name: d.name, regencyId: d.regencyId })));
}));

app.get('/api/listings', asyncHandler(async (_req, res) => {
  const rows = await prisma.listing.findMany({ include: listingInclude, orderBy: { createdAt: 'asc' } });
  res.json(rows.map(toListingResponse));
}));

app.get('/api/listings/:id', asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const row = await prisma.listing.findUnique({ where: { id }, include: listingInclude });
  if (!row) return res.status(404).json({ message: 'Listing tidak ditemukan.' });
  return res.json(toListingResponse(row));
}));

app.post('/api/listings', asyncHandler(async (req, res) => {
  const body = req.body || {};
  let id = normalizeId(body.id);
  if (!id) {
    const rows = await prisma.listing.findMany({ select: { id: true } });
    id = nextIdFromRows(rows);
  }

  let base = toListingCreateData(body, id);
  base = await applyListingCityLocationFromWilayah(prisma, base);
  const agentExists = base.agentId ? await prisma.agent.findUnique({ where: { id: base.agentId } }) : null;

  await prisma.listing.create({
    data: {
      ...base,
      agentId: agentExists ? base.agentId : null,
      images: {
        create: (Array.isArray(body.images) ? body.images : []).map((value, idx) => ({
          imageUrl: String(value || ''),
          sortOrder: idx,
        })),
      },
      descriptions: {
        create: (Array.isArray(body.description) ? body.description : []).map((value, idx) => ({
          content: String(value || ''),
          sortOrder: idx,
        })),
      },
      facilities: {
        create: (Array.isArray(body.facilities) ? body.facilities : []).map((value, idx) => ({
          content: String(value || ''),
          sortOrder: idx,
        })),
      },
    },
  });

  const created = await prisma.listing.findUnique({ where: { id }, include: listingInclude });
  res.status(201).json(toListingResponse(created));
}));

app.put('/api/listings/:id', asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Listing tidak ditemukan.' });

  const merged = { ...existing, ...req.body, id };
  let base = toListingCreateData(merged, id);
  base = await applyListingCityLocationFromWilayah(prisma, base);
  const agentExists = base.agentId ? await prisma.agent.findUnique({ where: { id: base.agentId } }) : null;

  await prisma.$transaction(async (tx) => {
    await tx.listing.update({
      where: { id },
      data: { ...base, agentId: agentExists ? base.agentId : null },
    });
    await tx.listingImage.deleteMany({ where: { listingId: id } });
    await tx.listingDescription.deleteMany({ where: { listingId: id } });
    await tx.listingFacility.deleteMany({ where: { listingId: id } });

    const images = Array.isArray(req.body.images) ? req.body.images : [];
    const descs = Array.isArray(req.body.description) ? req.body.description : [];
    const facilities = Array.isArray(req.body.facilities) ? req.body.facilities : [];

    if (images.length) {
      await tx.listingImage.createMany({
        data: images.map((value, idx) => ({
          listingId: id,
          imageUrl: String(value || ''),
          sortOrder: idx,
        })),
      });
    }
    if (descs.length) {
      await tx.listingDescription.createMany({
        data: descs.map((value, idx) => ({
          listingId: id,
          content: String(value || ''),
          sortOrder: idx,
        })),
      });
    }
    if (facilities.length) {
      await tx.listingFacility.createMany({
        data: facilities.map((value, idx) => ({
          listingId: id,
          content: String(value || ''),
          sortOrder: idx,
        })),
      });
    }
  });

  const updated = await prisma.listing.findUnique({ where: { id }, include: listingInclude });
  return res.json(toListingResponse(updated));
}));

app.delete('/api/listings/:id', asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const existing = await prisma.listing.findUnique({ where: { id }, include: listingInclude });
  if (!existing) return res.status(404).json({ message: 'Listing tidak ditemukan.' });
  await prisma.listing.delete({ where: { id } });
  return res.json({ deleted: true, item: toListingResponse(existing) });
}));

app.get('/api/agents', asyncHandler(async (_req, res) => {
  const rows = await prisma.agent.findMany({ include: agentInclude, orderBy: { createdAt: 'asc' } });
  res.json(rows.map(toAgentResponse));
}));

app.get('/api/agents/:id', asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const row = await prisma.agent.findUnique({ where: { id }, include: agentInclude });
  if (!row) return res.status(404).json({ message: 'Agen tidak ditemukan.' });
  return res.json(toAgentResponse(row));
}));

app.post('/api/agents', asyncHandler(async (req, res) => {
  const body = req.body || {};
  let id = normalizeId(body.id);
  if (!id) {
    const rows = await prisma.agent.findMany({ select: { id: true } });
    id = nextIdFromRows(rows);
  }

  const base = toAgentCreateData(body, id);
  const plainPassword = String(body.password || process.env.AGENT_DEFAULT_PASSWORD || 'demo12345');
  const passwordHash = bcrypt.hashSync(plainPassword, 10);
  await prisma.agent.create({
    data: {
      ...base,
      passwordHash,
      areas: {
        create: (Array.isArray(body.areas) ? body.areas : []).map((value, idx) => ({
          content: String(value || ''),
          sortOrder: idx,
        })),
      },
      specialties: {
        create: (Array.isArray(body.specialties) ? body.specialties : []).map((value, idx) => ({
          content: String(value || ''),
          sortOrder: idx,
        })),
      },
      listings: {
        create: (Array.isArray(body.listings) ? body.listings : []).map((value, idx) => ({
          title: String((value && value.title) || ''),
          price: String((value && value.price) || ''),
          loc: String((value && value.loc) || ''),
          img: String((value && value.img) || ''),
          url: String((value && value.url) || ''),
          sortOrder: idx,
        })),
      },
    },
  });

  const created = await prisma.agent.findUnique({ where: { id }, include: agentInclude });
  res.status(201).json(toAgentResponse(created));
}));

app.put('/api/agents/:id', asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const existing = await prisma.agent.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Agen tidak ditemukan.' });

  const merged = { ...existing, ...req.body, id };
  const base = toAgentCreateData(merged, id);

  await prisma.$transaction(async (tx) => {
    await tx.agent.update({ where: { id }, data: base });
    await tx.agentArea.deleteMany({ where: { agentId: id } });
    await tx.agentSpecialty.deleteMany({ where: { agentId: id } });
    await tx.agentProfileListing.deleteMany({ where: { agentId: id } });

    const areas = Array.isArray(req.body.areas) ? req.body.areas : [];
    const specialties = Array.isArray(req.body.specialties) ? req.body.specialties : [];
    const listings = Array.isArray(req.body.listings) ? req.body.listings : [];

    if (areas.length) {
      await tx.agentArea.createMany({
        data: areas.map((value, idx) => ({
          agentId: id,
          content: String(value || ''),
          sortOrder: idx,
        })),
      });
    }
    if (specialties.length) {
      await tx.agentSpecialty.createMany({
        data: specialties.map((value, idx) => ({
          agentId: id,
          content: String(value || ''),
          sortOrder: idx,
        })),
      });
    }
    if (listings.length) {
      await tx.agentProfileListing.createMany({
        data: listings.map((value, idx) => ({
          agentId: id,
          title: String((value && value.title) || ''),
          price: String((value && value.price) || ''),
          loc: String((value && value.loc) || ''),
          img: String((value && value.img) || ''),
          url: String((value && value.url) || ''),
          sortOrder: idx,
        })),
      });
    }
  });

  const updated = await prisma.agent.findUnique({ where: { id }, include: agentInclude });
  return res.json(toAgentResponse(updated));
}));

app.delete('/api/agents/:id', asyncHandler(async (req, res) => {
  const id = normalizeId(req.params.id);
  const existing = await prisma.agent.findUnique({ where: { id }, include: agentInclude });
  if (!existing) return res.status(404).json({ message: 'Agen tidak ditemukan.' });
  await prisma.agent.delete({ where: { id } });
  return res.json({ deleted: true, item: toAgentResponse(existing) });
}));

app.use(express.static(ROOT_DIR));
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
  const derivedUrl = buildDatabaseUrlFromParts();
  if (derivedUrl) process.env.DATABASE_URL = derivedUrl;

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL belum diatur. Isi DATABASE_URL atau variabel DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_HOST, DATABASE_PORT di file .env');
  }

  await prisma.$connect();
  await syncProvincesFromApi(prisma).catch((e) => {
    console.warn('Sinkron provinsi gagal (jalankan ulang nanti):', e.message);
  });
  await seedIfNeeded();

  app.listen(PORT, () => {
    console.log(`Backend berjalan di http://127.0.0.1:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Gagal menjalankan backend:', err.message);
  process.exit(1);
});
