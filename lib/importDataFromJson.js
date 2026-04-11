const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

function normalizeId(input) {
  return String(input == null ? '' : input).trim();
}

function toNumber(input, fallback = 0) {
  const n = Number(input);
  return Number.isFinite(n) ? n : fallback;
}

function toInt(input, fallback = 0) {
  const n = parseInt(String(input == null ? '' : input), 10);
  return Number.isNaN(n) ? fallback : n;
}

function toListingCreateData(item, forcedId) {
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

function toAgentCreateData(item, forcedId) {
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
    email: String(item.email || '').trim().toLowerCase(),
    bio: String(item.bio || ''),
    joinDate: String(item.joinDate || ''),
  };
}

function readJsonArray(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function upsertAgent(prisma, item, index) {
  const id = normalizeId(item.id) || String(index + 1);
  const base = toAgentCreateData(item, id);
  const defaultPassword = process.env.AGENT_DEFAULT_PASSWORD || 'demo12345';
  const passwordHash = bcrypt.hashSync(defaultPassword, 10);
  const areas = Array.isArray(item.areas) ? item.areas : [];
  const specialties = Array.isArray(item.specialties) ? item.specialties : [];
  const listings = Array.isArray(item.listings) ? item.listings : [];

  await prisma.$transaction(async (tx) => {
    await tx.agent.upsert({
      where: { id },
      create: { ...base, passwordHash },
      update: base,
    });
    await tx.agentArea.deleteMany({ where: { agentId: id } });
    await tx.agentSpecialty.deleteMany({ where: { agentId: id } });
    await tx.agentProfileListing.deleteMany({ where: { agentId: id } });

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
}

async function upsertListing(prisma, item, index) {
  const id = normalizeId(item.id) || String(index + 1);
  const base = toListingCreateData(item, id);
  const agentRow = base.agentId ? await prisma.agent.findUnique({ where: { id: base.agentId } }) : null;
  const agentId = agentRow ? base.agentId : null;

  const images = Array.isArray(item.images) ? item.images : [];
  const descriptions = Array.isArray(item.description) ? item.description : [];
  const facilities = Array.isArray(item.facilities) ? item.facilities : [];

  await prisma.$transaction(async (tx) => {
    await tx.listing.upsert({
      where: { id },
      create: { ...base, agentId },
      update: { ...base, agentId },
    });
    await tx.listingImage.deleteMany({ where: { listingId: id } });
    await tx.listingDescription.deleteMany({ where: { listingId: id } });
    await tx.listingFacility.deleteMany({ where: { listingId: id } });

    if (images.length) {
      await tx.listingImage.createMany({
        data: images.map((value, idx) => ({
          listingId: id,
          imageUrl: String(value || ''),
          sortOrder: idx,
        })),
      });
    }
    if (descriptions.length) {
      await tx.listingDescription.createMany({
        data: descriptions.map((value, idx) => ({
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
}

/**
 * Impor data dari data/agents.json dan data/listings.json (upsert per id).
 * Agen diimpor dulu agar foreign key listing.agentId valid.
 */
async function importDataFromJsonFiles(prisma, rootDir) {
  const agentsPath = path.join(rootDir, 'data', 'agents.json');
  const listingsPath = path.join(rootDir, 'data', 'listings.json');

  if (!fs.existsSync(agentsPath)) {
    throw new Error(`File tidak ditemukan: ${agentsPath}`);
  }
  if (!fs.existsSync(listingsPath)) {
    throw new Error(`File tidak ditemukan: ${listingsPath}`);
  }

  const agents = readJsonArray(agentsPath);
  const listings = readJsonArray(listingsPath);

  for (let i = 0; i < agents.length; i += 1) {
    await upsertAgent(prisma, agents[i] || {}, i);
  }
  for (let i = 0; i < listings.length; i += 1) {
    await upsertListing(prisma, listings[i] || {}, i);
  }

  const [agentCount, listingCount] = await Promise.all([prisma.agent.count(), prisma.listing.count()]);
  return { agentsImported: agents.length, listingsImported: listings.length, agentCount, listingCount };
}

module.exports = {
  importDataFromJsonFiles,
};
