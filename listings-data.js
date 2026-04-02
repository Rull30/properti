/**
 * Data listing properti — sumber utama untuk beranda, cari, peta, detail, dan panel agen (setelah merge).
 * Field wajib: id, title, transaction, type, city, location, priceJuta, beds, baths, land, build, cert, nego, date, lat, lng, agentId, whatsapp, agentName
 * Gambar: `images` (array URL). Jika kosong, fallback ke `image` (satu foto).
 */
(function (w) {
    function T() {
        return [
            {
                id: '1',
                title: 'Rumah minimalis modern Pondok Indah',
                transaction: 'dijual',
                type: 'rumah',
                city: 'Jakarta Selatan',
                location: 'Pondok Indah',
                priceJuta: 1250,
                beds: 3,
                baths: 2,
                land: 180,
                build: 120,
                cert: 'SHM',
                nego: true,
                date: '2026-03-12',
                newProperty: false,
                lat: -6.2652,
                lng: 106.785,
                agentId: '1',
                agentName: 'Budi Santoso',
                whatsapp: '6281234567890',
                listingCode: 'R123-DKI-9281',
                installmentHint: 'Cicilan mulai dari Rp 12,5 jt/bulan*',
                address: 'Jl. Metro Duta Raya, Pondok Pinang, Kebayoran Lama, Jakarta Selatan, 12310',
                floors: 2,
                electricity: '5500 VA',
                facing: 'Timur',
                images: [
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                description: [
                    'Dijual rumah minimalis modern di kawasan eksklusif Pondok Indah dengan akses strategis ke TB Simatupang dan tol JORR. Lingkungan asri, one gate system, dan dekat dengan sekolah internasional serta pusat perbelanjaan.',
                    'Rumah dalam kondisi terawat, siap huni. Ruang tamu terbuka ke taman belakang, dapur bersih dengan kitchen set, dan garasi muat 1 mobil + carport.',
                    '*Simulasi cicilan bersifat indikatif; konfirmasi ke bank penyedia KPR.'
                ],
                facilities: ['Carport', 'Taman', 'Kitchen set', 'AC', 'Water heater', 'One gate system']
            },
            {
                id: '2',
                title: 'Villa asri nuansa alam Bandung',
                transaction: 'disewa',
                type: 'rumah',
                city: 'Bandung',
                location: 'Lembang',
                priceJuta: 45,
                beds: 4,
                baths: 3,
                land: 250,
                build: 200,
                cert: 'SHM',
                nego: false,
                date: '2026-03-10',
                newProperty: false,
                lat: -6.8165,
                lng: 107.618,
                agentId: '2',
                agentName: 'Sarah Wijaya',
                whatsapp: '6282222333444',
                listingCode: 'LST-BDG-2002',
                installmentHint: 'Nego harga sewa tahunan',
                address: 'Jl. Raya Lembang Km 12, Lembang, Bandung Barat, 40391',
                floors: 2,
                electricity: '7700 VA',
                facing: 'Selatan',
                images: [
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                description: ['Villa nyaman di udara sejuk Lembang, cocok untuk keluarga atau retreat akhir pekan.', 'Halaman luas, parkir muat beberapa mobil.'],
                facilities: ['Taman luas', 'Parkir luas', 'Ruang tamu besar', 'Dapur gas']
            },
            {
                id: '3',
                title: 'Cluster strategis tengah kota',
                transaction: 'dijual',
                type: 'rumah',
                city: 'Cianjur',
                location: 'Cianjur Kota',
                priceJuta: 850,
                beds: 2,
                baths: 1,
                land: 120,
                build: 90,
                cert: 'SHM',
                nego: false,
                date: '2026-03-08',
                newProperty: true,
                lat: -7.3271,
                lng: 107.1416,
                agentId: '3',
                agentName: 'Reza Firmansyah',
                whatsapp: '6281555666777',
                listingCode: 'CLU-CJR-3301',
                installmentHint: 'Developer sediakan promo DP ringan',
                address: 'Cluster Green Valley, Jl. Surya Kencana, Cianjur Kota, 43212',
                floors: 1,
                electricity: '3500 VA',
                facing: 'Barat',
                images: [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                description: ['Rumah cluster baru dengan akses jalan utama dan fasilitas komplek lengkap.', 'Unit siap huni, sertifikat proses balik nama.'],
                facilities: ['Cluster one gate', 'Taman bermain', 'Masjid', 'Carport']
            },
            {
                id: '4',
                title: 'Apartemen view kota TB Simatupang',
                transaction: 'dijual',
                type: 'apartemen',
                city: 'Jakarta Selatan',
                location: 'Cilandak',
                priceJuta: 920,
                beds: 2,
                baths: 2,
                land: 0,
                build: 68,
                cert: 'HGB',
                nego: true,
                date: '2026-03-11',
                newProperty: true,
                lat: -6.2918,
                lng: 106.7998,
                agentId: '1',
                agentName: 'Budi Santoso',
                whatsapp: '6281234567890',
                listingCode: 'APT-JKS-4400',
                installmentHint: 'KPR tersedia beberapa bank mitra',
                address: 'Jl. TB Simatupang, Cilandak, Jakarta Selatan, 12430',
                floors: 18,
                electricity: '4400 VA',
                facing: 'Timur',
                images: [
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                description: ['Unit corner dengan view kota dan jalan TB Simatupang.', 'Tower premium, akses langsung ke lobby mall.'],
                facilities: ['Lift', 'Swimming pool', 'Gym', 'Sky garden', 'AC split']
            },
            {
                id: '5',
                title: 'Ruko 2 lantai hook strategis',
                transaction: 'disewa',
                type: 'ruko',
                city: 'Tangerang',
                location: 'BSD City',
                priceJuta: 120,
                beds: 0,
                baths: 2,
                land: 120,
                build: 180,
                cert: 'HGB',
                nego: true,
                date: '2026-03-05',
                newProperty: true,
                lat: -6.3035,
                lng: 106.6842,
                agentId: '4',
                agentName: 'Diana Kusuma',
                whatsapp: '6281777888999',
                listingCode: 'RUK-BSD-5501',
                installmentHint: 'Minimum sewa 2 tahun',
                address: 'Jl. BSD Raya Utama, BSD City, Tangerang, 15311',
                floors: 2,
                electricity: '10600 VA',
                facing: 'Hook jalan utama',
                images: [
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                description: ['Ruko hook dengan lebar facade besar, cocok untuk F&B atau showroom.', 'Parkir depan luas.'],
                facilities: ['Hook', 'Toilet umum', 'AC', 'Rolling door']
            },
            {
                id: '6',
                title: 'Tanah kavling siap bangun',
                transaction: 'dijual',
                type: 'tanah',
                city: 'Jakarta Timur',
                location: 'Cakung',
                priceJuta: 780,
                beds: 0,
                baths: 0,
                land: 200,
                build: 0,
                cert: 'SHM',
                nego: false,
                date: '2026-03-01',
                newProperty: false,
                lat: -6.221,
                lng: 106.955,
                agentId: '6',
                agentName: 'Maya Indira',
                whatsapp: '6281999000111',
                listingCode: 'TNH-JKT-6600',
                installmentHint: 'Cash keras / KPR tanah bisa didiskusikan',
                address: 'Kavling industri ringan, Cakung, Jakarta Timur, 13910',
                floors: 0,
                electricity: '—',
                facing: 'Utara',
                images: [
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                description: ['Tanah kavling sudah paving blok, akses kontainer.', 'Sertifikat SHM atas nama penjual.'],
                facilities: ['Paving blok', 'Pagar keliling', 'Listrik depan site']
            },
            {
                id: '7',
                title: 'Kost putri dekat kampus',
                transaction: 'disewa',
                type: 'kost',
                city: 'Bandung',
                location: 'Dago',
                priceJuta: 4.5,
                beds: 1,
                baths: 1,
                land: 0,
                build: 18,
                cert: 'SHM',
                nego: false,
                date: '2026-02-28',
                newProperty: false,
                lat: -6.893,
                lng: 107.611,
                agentId: '2',
                agentName: 'Sarah Wijaya',
                whatsapp: '6282222333444',
                listingCode: 'KOS-BDG-7707',
                installmentHint: 'Sewa bulanan / tahunan',
                address: 'Gang Sadang Serang, Dago, Bandung, 40135',
                floors: 2,
                electricity: '2200 VA',
                facing: 'Timur',
                images: [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                description: ['Kamar kost putri bersih, dekat ITB & UNPAD Dago.', 'Wi-Fi include, dapur bersama.'],
                facilities: ['Wi-Fi', 'Dapur bersama', 'Laundry', 'Parkir motor']
            },
            {
                id: '8',
                title: 'Rumah hook Gandaria',
                transaction: 'dijual',
                type: 'rumah',
                city: 'Jakarta Selatan',
                location: 'Kebayoran Baru',
                priceJuta: 980,
                beds: 4,
                baths: 3,
                land: 220,
                build: 190,
                cert: 'SHM',
                nego: true,
                date: '2026-03-09',
                newProperty: false,
                lat: -6.244,
                lng: 106.8005,
                agentId: '1',
                agentName: 'Budi Santoso',
                whatsapp: '6281234567890',
                listingCode: 'RMH-JKS-8808',
                installmentHint: 'Nego sampai deal',
                address: 'Jl. Gandaria, Kebayoran Baru, Jakarta Selatan, 12140',
                floors: 2,
                electricity: '7700 VA',
                facing: 'Timur–Selatan',
                images: [
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                description: ['Rumah hook lebar dengan taman samping.', 'Lokasi strategis dekat Gandaria City.'],
                facilities: ['Hook', 'Taman samping', 'Carport 2 mobil', 'AC']
            },
            {
                id: '9',
                title: 'Apartemen studio furnished',
                transaction: 'disewa',
                type: 'apartemen',
                city: 'Surabaya',
                location: 'Wiyung',
                priceJuta: 42,
                beds: 1,
                baths: 1,
                land: 0,
                build: 32,
                cert: 'HGB',
                nego: false,
                date: '2026-03-07',
                newProperty: false,
                lat: -7.325,
                lng: 112.734,
                agentId: '5',
                agentName: 'Andi Pratama',
                whatsapp: '6281133344555',
                listingCode: 'APT-SBY-9909',
                installmentHint: 'Include IPL bulan pertama',
                address: 'Apartemen Waterplace Tower A, Wiyung, Surabaya, 60228',
                floors: 25,
                electricity: '3500 VA',
                facing: 'Barat',
                images: [
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                description: ['Studio fully furnished, siap masuk.', 'Kolam renang & gym tower.'],
                facilities: ['Furnished', 'Gym', 'Kolam renang', 'Lift']
            },
            {
                id: '10',
                title: 'Rumah secondary PIK',
                transaction: 'dijual',
                type: 'rumah',
                city: 'Jakarta Utara',
                location: 'Pantai Indah Kapuk',
                priceJuta: 4500,
                beds: 5,
                baths: 4,
                land: 300,
                build: 280,
                cert: 'SHM',
                nego: true,
                date: '2026-03-12',
                newProperty: false,
                lat: -6.11,
                lng: 106.744,
                agentId: '7',
                agentName: 'Hendra Gunawan',
                whatsapp: '6281222000333',
                listingCode: 'RMH-JKU-1010',
                installmentHint: 'Cash keras preferred',
                address: 'Cluster elite PIK, Jakarta Utara, 14460',
                floors: 2,
                electricity: '16500 VA',
                facing: 'Utara',
                images: [
                    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                ],
                description: ['Rumah mewah secondary di kawasan PIK, lingkungan premium.', 'Private pool, smart home ready.'],
                facilities: ['Private pool', 'Smart home', 'Carport 3', 'Taman belakang', 'Security 24 jam']
            }
        ];
    }

    w.LISTINGS = T();
    w._LISTINGS_BASE = JSON.parse(JSON.stringify(w.LISTINGS));

    function normalizeListing(p) {
        if (!p.images || !p.images.length) {
            p.images = p.image ? [p.image] : [];
        }
        if (!p.image && p.images && p.images[0]) p.image = p.images[0];
        p.detailUrl = w.getListingDetailUrl(p.id);
        if (typeof p.description === 'string') p.description = [p.description];
        if (!p.facilities) p.facilities = [];
        return p;
    }

    w.getListingDetailUrl = function (id) {
        return 'properti-detail.html?id=' + encodeURIComponent(String(id));
    };

    w.getListingImages = function (p) {
        if (!p) return [];
        if (p.images && p.images.length) return p.images.slice();
        return p.image ? [p.image] : [];
    };

    w.LISTINGS.forEach(normalizeListing);

    w.formatListingPrice = function (p) {
        var jt = p.priceJuta;
        if (p.transaction === 'disewa') {
            if (jt >= 100) return 'Rp ' + jt.toLocaleString('id-ID') + ' Jt/thn';
            return 'Rp ' + jt.toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' Jt/thn';
        }
        if (jt >= 1000) return 'Rp ' + (jt / 1000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' Miliar';
        return 'Rp ' + jt.toLocaleString('id-ID') + ' Juta';
    };

    w.formatListingPriceHome = function (p) {
        var jt = p.priceJuta;
        if (p.transaction === 'disewa') {
            if (jt >= 100) return 'Rp ' + jt.toLocaleString('id-ID') + ' Jt <span class="text-sm font-normal text-slate-500">/ tahun</span>';
            return 'Rp ' + jt.toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' Jt <span class="text-sm font-normal text-slate-500">/ tahun</span>';
        }
        if (jt >= 1000) return 'Rp ' + (jt / 1000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' Miliar';
        return 'Rp ' + jt.toLocaleString('id-ID') + ' Juta';
    };

    /** Harga full Rupiah untuk halaman detail */
    w.formatListingPriceRupiah = function (p) {
        var rupiah = p.priceJuta * 1000000;
        if (p.transaction === 'disewa') {
            return 'Rp ' + Math.round(rupiah).toLocaleString('id-ID') + ' <span class="text-sm font-normal text-slate-500">/ tahun</span>';
        }
        return 'Rp ' + Math.round(rupiah).toLocaleString('id-ID');
    };

    w.getListingById = function (id) {
        if (id == null || id === '') return null;
        var sid = String(id);
        for (var i = 0; i < w.LISTINGS.length; i++) {
            if (String(w.LISTINGS[i].id) === sid) return w.LISTINGS[i];
        }
        return null;
    };

    w.typeLabel = function (t) {
        var map = { rumah: 'Rumah', apartemen: 'Apartemen', ruko: 'Ruko', tanah: 'Tanah', kost: 'Kost' };
        return map[t] || (t ? t.charAt(0).toUpperCase() + t.slice(1) : '—');
    };

    w.POPULAR_PROJECTS = [
        { title: 'Metland Menteng', location: 'Cakung, Jakarta Timur', line: 'Dari Rp 98 Jt — 215 Jt', href: 'cari-properti.html?q=Metland&kota=Jakarta%20Timur' },
        { title: 'Summarecon Bogor', location: 'Sukaraja, Bogor', line: 'Dari Rp 107 Jt — 446 Jt', href: 'cari-properti.html?q=Summarecon' },
        { title: 'BSD City — Cluster pilihan', location: 'Tangerang', line: 'Lihat katalog →', href: 'cari-properti.html?q=BSD&kota=Tangerang' }
    ];
})(typeof window !== 'undefined' ? window : globalThis);
