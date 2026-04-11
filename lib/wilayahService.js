const https = require('https');
const { URL } = require('url');

const BASE = 'https://emsifa.github.io/api-wilayah-indonesia/api';
const FALLBACK_BASE =
  'https://raw.githubusercontent.com/emsifa/api-wilayah-indonesia/master/static/api';

function fetchText(urlString, redirects = 0) {
  if (redirects > 10) {
    return Promise.reject(new Error('Terlalu banyak redirect'));
  }
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain;q=0.9',
          'User-Agent': 'properti-backend/1.0',
        },
      },
      (res) => {
        const code = res.statusCode || 0;
        if (code >= 300 && code < 400 && res.headers.location) {
          const next = new URL(res.headers.location, urlString).href;
          res.resume();
          fetchText(next, redirects + 1).then(resolve).catch(reject);
          return;
        }
        let data = '';
        res.on('data', (c) => {
          data += c;
        });
        res.on('end', () => {
          if (code < 200 || code >= 300) {
            reject(new Error(`HTTP ${code} ${urlString}`));
            return;
          }
          resolve(data);
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function fetchJsonFromUrl(url) {
  const text = await fetchText(url);
  try {
    return JSON.parse(text);
  } catch (e) {
    const preview = text.replace(/\s+/g, ' ').slice(0, 120);
    throw new Error(`Respons bukan JSON: ${preview}`);
  }
}

/**
 * Ambil JSON dari EMSIFA; jika gagal, coba mirror di raw.githubusercontent.com.
 * @param {string} pathContoh '/provinces.json' atau '/regencies/11.json'
 */
async function fetchJson(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  const primary = `${BASE}${p}`;
  const fallback = `${FALLBACK_BASE}${p}`;
  try {
    return await fetchJsonFromUrl(primary);
  } catch (e) {
    return await fetchJsonFromUrl(fallback);
  }
}

async function syncProvincesFromApi(prisma) {
  const rows = await fetchJson('/provinces.json');
  if (!Array.isArray(rows)) return;
  for (const p of rows) {
    await prisma.province.upsert({
      where: { id: String(p.id) },
      create: { id: String(p.id), name: String(p.name || '') },
      update: { name: String(p.name || '') },
    });
  }
}

async function ensureRegenciesInDb(prisma, provinceId) {
  const pid = String(provinceId);
  const count = await prisma.regency.count({ where: { provinceId: pid } });
  if (count > 0) return;
  const rows = await fetchJson(`/regencies/${pid}.json`);
  if (!Array.isArray(rows)) return;
  for (const r of rows) {
    await prisma.regency.upsert({
      where: { id: String(r.id) },
      create: {
        id: String(r.id),
        provinceId: String(r.province_id),
        name: String(r.name || ''),
      },
      update: {
        provinceId: String(r.province_id),
        name: String(r.name || ''),
      },
    });
  }
}

async function ensureDistrictsInDb(prisma, regencyId) {
  const rid = String(regencyId);
  const count = await prisma.district.count({ where: { regencyId: rid } });
  if (count > 0) return;
  const rows = await fetchJson(`/districts/${rid}.json`);
  if (!Array.isArray(rows)) return;
  for (const d of rows) {
    await prisma.district.upsert({
      where: { id: String(d.id) },
      create: {
        id: String(d.id),
        regencyId: String(d.regency_id),
        name: String(d.name || ''),
      },
      update: {
        regencyId: String(d.regency_id),
        name: String(d.name || ''),
      },
    });
  }
}

/**
 * Unduh provinsi → semua kab/kota → semua kecamatan ke database (sekali jalan, idempotent).
 * Pertama kali bisa memakan waktu beberapa menit (~500+ request ke API EMSIFA).
 */
async function syncAllWilayahToDb(prisma) {
  await syncProvincesFromApi(prisma);
  const provinces = await prisma.province.findMany({ select: { id: true }, orderBy: { id: 'asc' } });
  console.log(`[wilayah] Sinkron kab/kota untuk ${provinces.length} provinsi…`);
  for (let i = 0; i < provinces.length; i += 1) {
    await ensureRegenciesInDb(prisma, provinces[i].id);
    if ((i + 1) % 10 === 0 || i === provinces.length - 1) {
      console.log(`[wilayah] kab/kota ${i + 1}/${provinces.length}`);
    }
  }
  const regencies = await prisma.regency.findMany({ select: { id: true }, orderBy: { id: 'asc' } });
  console.log(`[wilayah] Sinkron kecamatan untuk ${regencies.length} kab/kota…`);
  for (let i = 0; i < regencies.length; i += 1) {
    await ensureDistrictsInDb(prisma, regencies[i].id);
    if ((i + 1) % 100 === 0 || i === regencies.length - 1) {
      console.log(`[wilayah] kecamatan ${i + 1}/${regencies.length}`);
    }
  }
  console.log('[wilayah] Sinkron penuh selesai.');
}

module.exports = {
  syncProvincesFromApi,
  ensureRegenciesInDb,
  ensureDistrictsInDb,
  syncAllWilayahToDb,
  fetchJson,
  WILAYAH_API_BASE: BASE,
};
