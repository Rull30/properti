const path = require('path');

const PAGES_DIR = path.join(__dirname, 'pages');

module.exports = [
  { route: '/', file: path.join(PAGES_DIR, 'index.html') },
  { route: '/index', redirect: '/' },
  { route: '/cari-properti', file: path.join(PAGES_DIR, 'cari-properti.html') },
  { route: '/cari-agen', file: path.join(PAGES_DIR, 'cari-agen.html') },
  { route: '/agen-detail', file: path.join(PAGES_DIR, 'agen-detail.html') },
  { route: '/properti-detail', file: path.join(PAGES_DIR, 'properti-detail.html') },
  { route: '/kalkulator-kpr', file: path.join(PAGES_DIR, 'kalkulator-kpr.html') },
  { route: '/peta-properti', file: path.join(PAGES_DIR, 'peta-properti.html') },
  { route: '/take-over-kpr', file: path.join(PAGES_DIR, 'take-over-kpr.html') },
  { route: '/tanya-forum', file: path.join(PAGES_DIR, 'tanya-forum.html') },
  { route: '/panduan-beli', file: path.join(PAGES_DIR, 'panduan-beli.html') },
  { route: '/beli-properti-aman', file: path.join(PAGES_DIR, 'beli-properti-aman.html') },
  { route: '/mitra-terpercaya', file: path.join(PAGES_DIR, 'mitra-terpercaya.html') },

  { route: '/agent', file: path.join(PAGES_DIR, 'agent', 'index.html') },
  { route: '/agent/login', file: path.join(PAGES_DIR, 'agent', 'login.html') },
  { route: '/agent/dashboard', file: path.join(PAGES_DIR, 'agent', 'dashboard.html') },
  { route: '/agent/profil', file: path.join(PAGES_DIR, 'agent', 'profil.html') },
  { route: '/agent/listing-form', file: path.join(PAGES_DIR, 'agent', 'listing-form.html') },
  { route: '/agent/listing-saya', file: path.join(PAGES_DIR, 'agent', 'listing-saya.html') },
  { route: '/agent/pesan', file: path.join(PAGES_DIR, 'agent', 'pesan.html') },

  // Legacy .html routes (backward compatible)
  // { route: '/index.html', file: path.join(PAGES_DIR, 'index.html') },
  // { route: '/cari-properti.html', file: path.join(PAGES_DIR, 'cari-properti.html') },
  // { route: '/cari-agen.html', file: path.join(PAGES_DIR, 'cari-agen.html') },
  // { route: '/agen-detail.html', file: path.join(PAGES_DIR, 'agen-detail.html') },
  // { route: '/properti-detail.html', file: path.join(PAGES_DIR, 'properti-detail.html') },
  // { route: '/kalkulator-kpr.html', file: path.join(PAGES_DIR, 'kalkulator-kpr.html') },
  // { route: '/peta-properti.html', file: path.join(PAGES_DIR, 'peta-properti.html') },
  // { route: '/take-over-kpr.html', file: path.join(PAGES_DIR, 'take-over-kpr.html') },
  // { route: '/tanya-forum.html', file: path.join(PAGES_DIR, 'tanya-forum.html') },
  // { route: '/panduan-beli.html', file: path.join(PAGES_DIR, 'panduan-beli.html') },
  // { route: '/beli-properti-aman.html', file: path.join(PAGES_DIR, 'beli-properti-aman.html') },
  // { route: '/mitra-terpercaya.html', file: path.join(PAGES_DIR, 'mitra-terpercaya.html') },
  // { route: '/agent/index.html', file: path.join(PAGES_DIR, 'agent', 'index.html') },
  // { route: '/agent/login.html', file: path.join(PAGES_DIR, 'agent', 'login.html') },
  // { route: '/agent/dashboard.html', file: path.join(PAGES_DIR, 'agent', 'dashboard.html') },
  // { route: '/agent/profil.html', file: path.join(PAGES_DIR, 'agent', 'profil.html') },
  // { route: '/agent/listing-form.html', file: path.join(PAGES_DIR, 'agent', 'listing-form.html') },
  // { route: '/agent/listing-saya.html', file: path.join(PAGES_DIR, 'agent', 'listing-saya.html') },
  // { route: '/agent/pesan.html', file: path.join(PAGES_DIR, 'agent', 'pesan.html') },
];
