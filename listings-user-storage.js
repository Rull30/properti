/**
 * Gabungkan listing dari localStorage (CRUD panel agen) ke data dasar.
 * Key: portal_listings_user — array objek listing lengkap (baru atau hasil edit).
 */
(function (w) {
    if (!w.LISTINGS || !w._LISTINGS_BASE) return;
    try {
        var user = JSON.parse(localStorage.getItem('portal_listings_user') || '[]');
        if (!Array.isArray(user) || !user.length) return;
        var map = {};
        w._LISTINGS_BASE.forEach(function (p) {
            map[String(p.id)] = JSON.parse(JSON.stringify(p));
        });
        user.forEach(function (p) {
            if (p && p.id != null) map[String(p.id)] = p;
        });
        w.LISTINGS = Object.keys(map)
            .sort(function (a, b) {
                return parseInt(a, 10) - parseInt(b, 10);
            })
            .map(function (k) {
                return map[k];
            });
        w.LISTINGS.forEach(function (p) {
            if (!p.images || !p.images.length) p.images = p.image ? [p.image] : [];
            if (!p.image && p.images && p.images[0]) p.image = p.images[0];
            if (typeof w.getListingDetailUrl === 'function') p.detailUrl = w.getListingDetailUrl(p.id);
            if (typeof p.description === 'string') p.description = [p.description];
            if (!p.facilities) p.facilities = [];
        });
    } catch (e) {}
})(typeof window !== 'undefined' ? window : globalThis);
