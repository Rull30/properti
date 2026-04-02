# Backend Node.js - Properti

Backend ini sudah siap pakai untuk:
- Menjalankan frontend static (`index.html` dan halaman lain).
- Menyediakan API `listings` dan `agents`.
- Menyimpan data ke file JSON (`data/listings.json`, `data/agents.json`).
- Menyimpan semua file halaman di folder `pages/`.
- Menyimpan route halaman manual di `routes-manual.js`.

## 1) Install

```bash
npm install
```

## 2) Jalankan

```bash
npm run dev
```

Atau mode production:

```bash
npm start
```

## 3) Akses

- App: `http://127.0.0.1:5500`
- Health check: `http://127.0.0.1:5500/api/health`

## 4) ENV

File `.env`:

```env
PORT=5500
CORS_ORIGIN=*
```

## 5) Endpoint API

### Listings
- `GET /api/listings`
- `GET /api/listings/:id`
- `POST /api/listings`
- `PUT /api/listings/:id`
- `DELETE /api/listings/:id`

### Agents
- `GET /api/agents`
- `GET /api/agents/:id`
- `POST /api/agents`
- `PUT /api/agents/:id`
- `DELETE /api/agents/:id`

Saat pertama kali dijalankan, backend otomatis seed data dari `listings-data.js` dan `agents-data.js` ke folder `data/`.

## 6) Struktur halaman & route manual

- Semua file halaman (`*.html`) sekarang ada di `pages/` (termasuk `pages/agent/`).
- Mapping URL halaman disimpan manual di satu file: `routes-manual.js`.
- Jika ingin tambah halaman baru:
  1. Buat file HTML di `pages/`.
  2. Tambah route baru di `routes-manual.js`.
