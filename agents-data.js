/**
 * Data agen demo — dipakai cari-agen.html & agen-detail.html
 */
(function (w) {
    w.AGENTS = [
        {
            id: '1',
            name: 'Budi Santoso',
            agency: 'Prime Property Indonesia',
            city: 'Jakarta Selatan',
            areas: ['Jakarta Selatan', 'Jakarta Timur', 'Depok'],
            specialties: ['rumah', 'apartemen'],
            listingCount: 24,
            yearsExp: 6,
            verified: true,
            rating: 4.8,
            reviewCount: 32,
            phone: '6287793183539',
            email: 'budi.santoso@email.com',
            bio: 'Spesialis properti residensial di Jakarta Selatan dan sekitarnya. Membantu ratusan klien sejak 2019 dengan pendekatan transparan dan negosiasi yang adil.',
            joinDate: '2019-04-12',
            listings: [
                { title: 'Rumah minimalis modern Pondok Indah', price: 'Rp 1,25 Miliar', loc: 'Pondok Indah, Jakarta Selatan', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', url: './properti-detail.html?id=1' },
                { title: 'Apartemen view TB Simatupang', price: 'Rp 920 Juta', loc: 'Cilandak, Jakarta Selatan', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', url: './properti-detail.html?id=4' }
            ]
        },
        {
            id: '2',
            name: 'Sarah Wijaya',
            agency: 'Urban Nest Realty',
            city: 'Bandung',
            areas: ['Bandung', 'Cimahi', 'Lembang'],
            specialties: ['rumah', 'villa', 'tanah'],
            listingCount: 18,
            yearsExp: 4,
            verified: true,
            rating: 4.9,
            reviewCount: 21,
            phone: '6287793183539',
            email: 'sarah@urbannest.id',
            bio: 'Fokus pada hunian di dataran tinggi Bandung dan properti investasi tanah strategis. Tim kami siap mendampingi dari survei hingga akad.',
            joinDate: '2021-02-01',
            listings: [
                { title: 'Villa asri nuansa alam', price: 'Rp 45 Jt/thn', loc: 'Lembang, Bandung', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', url: './properti-detail.html?id=2' },
                { title: 'Kost putri dekat kampus', price: 'Rp 4,5 Jt/thn', loc: 'Dago, Bandung', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', url: './properti-detail.html?id=7' }
            ]
        },
        {
            id: '3',
            name: 'Reza Firmansyah',
            agency: 'Citra Land Broker',
            city: 'Cianjur',
            areas: ['Cianjur', 'Bogor'],
            specialties: ['rumah', 'tanah'],
            listingCount: 11,
            yearsExp: 3,
            verified: false,
            rating: 4.5,
            reviewCount: 9,
            phone: '6287793183539',
            email: 'reza.cf@email.com',
            bio: 'Mengenal pasar properti Cianjur dan Bogor secara mendalam. Cocok untuk pencarian rumah pertama atau investasi cluster.',
            joinDate: '2022-08-20',
            listings: [
                { title: 'Cluster strategis tengah kota', price: 'Rp 850 Juta', loc: 'Cianjur Kota', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', url: './properti-detail.html?id=3' }
            ]
        },
        {
            id: '4',
            name: 'Diana Kusuma',
            agency: 'Metro City Agents',
            city: 'Tangerang',
            areas: ['Tangerang', 'Tangerang Selatan', 'BSD'],
            specialties: ['apartemen', 'ruko', 'komersial'],
            listingCount: 31,
            yearsExp: 8,
            verified: true,
            rating: 4.7,
            reviewCount: 45,
            phone: '6287793183539',
            email: 'diana.k@metrocity.id',
            bio: 'Ahli properti komersial dan apartemen di koridor BSD–Gading Serpong. Klien korporat dan investor menyukai data pasar yang kami sajikan.',
            joinDate: '2017-11-05',
            listings: [
                { title: 'Ruko 2 lantai hook strategis', price: 'Rp 120 Jt/thn', loc: 'BSD City', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', url: '#' }
            ]
        },
        {
            id: '5',
            name: 'Andi Pratama',
            agency: 'Eastern Property',
            city: 'Surabaya',
            areas: ['Surabaya', 'Sidoarjo'],
            specialties: ['rumah', 'apartemen', 'ruko'],
            listingCount: 42,
            yearsExp: 10,
            verified: true,
            rating: 4.6,
            reviewCount: 58,
            phone: '6287793183539',
            email: 'andi@easternprop.co.id',
            bio: 'Sepuluh tahun berpengalaman di pasar Surabaya Timur dan Sidoarjo. Tim legal kami membantu due diligence sebelum transaksi.',
            joinDate: '2015-01-15',
            listings: [
                { title: 'Apartemen studio furnished', price: 'Rp 42 Jt/thn', loc: 'Wiyung, Surabaya', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', url: './properti-detail.html?id=9' }
            ]
        },
        {
            id: '6',
            name: 'Maya Indira',
            agency: 'Greenfield Realty',
            city: 'Jakarta Timur',
            areas: ['Jakarta Timur', 'Bekasi'],
            specialties: ['tanah', 'rumah'],
            listingCount: 15,
            yearsExp: 5,
            verified: true,
            rating: 4.85,
            reviewCount: 19,
            phone: '6287793183539',
            email: 'maya@greenfield.id',
            bio: 'Spesialis tanah kavling dan rumah secondary di Cakung, Bekasi, dan sekitarnya.',
            joinDate: '2020-06-01',
            listings: [
                { title: 'Tanah kavling siap bangun', price: 'Rp 780 Juta', loc: 'Cakung', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', url: './properti-detail.html?id=6' }
            ]
        },
        {
            id: '7',
            name: 'Hendra Gunawan',
            agency: 'PIK Elite Brokers',
            city: 'Jakarta Utara',
            areas: ['Jakarta Utara', 'Jakarta Barat'],
            specialties: ['rumah', 'mewah'],
            listingCount: 12,
            yearsExp: 7,
            verified: true,
            rating: 4.95,
            reviewCount: 14,
            phone: '6287793183539',
            email: 'hendra@pikelite.id',
            bio: 'Fokus pada properti premium di Pantai Indah Kapuk dan kawasan pantai Utara Jakarta.',
            joinDate: '2018-03-10',
            listings: [
                { title: 'Rumah secondary PIK', price: 'Rp 4,5 Miliar', loc: 'Pantai Indah Kapuk', img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', url: './properti-detail.html?id=10' }
            ]
        },
        {
            id: '8',
            name: 'Lina Marlina',
            agency: 'Solo Sentosa Property',
            city: 'Solo',
            areas: ['Solo', 'Karanganyar'],
            specialties: ['rumah', 'tanah'],
            listingCount: 9,
            yearsExp: 2,
            verified: false,
            rating: 4.4,
            reviewCount: 6,
            phone: '6287793183539',
            email: 'lina@solo-sentosa.id',
            bio: 'Membantu keluarga muda mencari rumah pertama di Solo dan sekitarnya dengan cicilan terjangkau.',
            joinDate: '2023-05-18',
            listings: []
        }
    ];

    w.getAgentById = function (id) {
        if (id == null || id === '') return null;
        var sid = String(id);
        for (var i = 0; i < w.AGENTS.length; i++) {
            if (String(w.AGENTS[i].id) === sid) return w.AGENTS[i];
        }
        return null;
    };
})(typeof window !== 'undefined' ? window : globalThis);
