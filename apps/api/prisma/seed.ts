/**
 * Fills the database with:
 *   1. Bangladesh locations: 8 divisions, 64 districts, 495 upazilas
 *      (source and licence: prisma/data/bd-locations.json → "source").
 *   2. A demo shop with an owner, products and customers, so every screen
 *      has something to show.
 *
 * Run with `pnpm db:seed`. Safe to run again: nothing is duplicated.
 */
import '../src/load-env.js';

import { readFileSync } from 'node:fs';

import { Role } from '../src/generated/prisma/client.js';
import { createPrismaClient } from '../src/prisma/create-prisma-client.js';

type LocationsFile = {
  source: { dataset: string; commit: string };
  divisions: { id: number; name: string; bnName: string; bbsCode: string }[];
  districts: { id: number; divisionId: number; name: string; bnName: string; bbsCode: string }[];
  upazilas: { id: number; districtId: number; name: string; bnName: string; bbsCode: string }[];
};

const locations = JSON.parse(
  readFileSync(new URL('./data/bd-locations.json', import.meta.url), 'utf8'),
) as LocationsFile;

const prisma = createPrismaClient();

async function seedLocations() {
  // createMany sends one INSERT per table instead of 495 separate ones.
  // skipDuplicates turns it into "INSERT ... ON CONFLICT DO NOTHING", so re-running is harmless.
  // Order matters: districts point at divisions, upazilas point at districts.
  const divisions = await prisma.division.createMany({
    data: locations.divisions,
    skipDuplicates: true,
  });
  const districts = await prisma.district.createMany({
    data: locations.districts,
    skipDuplicates: true,
  });
  const upazilas = await prisma.upazila.createMany({
    data: locations.upazilas,
    skipDuplicates: true,
  });
  console.log(
    `Locations from ${locations.source.dataset}@${locations.source.commit.slice(0, 7)}: ` +
      `added ${divisions.count} divisions, ${districts.count} districts, ${upazilas.count} upazilas`,
  );
}

// Made-up demo data. Phone numbers are fake but in the real +8801XXXXXXXXX format.
const DEMO_EMAIL = 'demo@parcelguard.app';
const DEMO_SHOP_SLUG = 'demo-fashion-house';

const demoProducts = [
  { sku: 'PNJ-BLK-L', name: 'Cotton Panjabi, Black, L', pricePaisa: 1_450_00, stock: 25 },
  { sku: 'PNJ-WHT-M', name: 'Cotton Panjabi, White, M', pricePaisa: 1_450_00, stock: 18 },
  { sku: '3PC-MRN', name: 'Three-piece, Maroon', pricePaisa: 2_250_00, stock: 12 },
  { sku: 'KRT-FLR-M', name: 'Floral Kurti, M', pricePaisa: 950_00, stock: 30 },
  { sku: 'SAR-JAM-BLU', name: 'Jamdani Saree, Blue', pricePaisa: 6_800_50, stock: 4 },
  { sku: 'HJB-CHF-BEI', name: 'Chiffon Hijab, Beige', pricePaisa: 350_00, stock: 60 },
];

const demoCustomers = [
  { name: 'Nusrat Jahan', phone: '+8801711000001' },
  { name: 'Rakib Hasan', phone: '+8801811000002' },
  { name: 'Farzana Akter', phone: '+8801911000003' },
  { name: 'Tanvir Ahmed', phone: '+8801611000004' },
  { name: 'Sumaiya Islam', phone: '+8801511000005' },
];

async function seedDemoShop() {
  const owner = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      name: 'Demo Owner',
      // Not a real hash, so nobody can log in as the demo user yet.
      // F2 (auth) replaces this with an argon2 hash of the demo password.
      passwordHash: '!not-set-until-F2',
    },
  });

  const shop = await prisma.shop.upsert({
    where: { slug: DEMO_SHOP_SLUG },
    update: {},
    create: {
      slug: DEMO_SHOP_SLUG,
      name: 'Demo Fashion House',
      phone: '+8801711000000',
      pickupAddress: 'House 12, Road 7, Mirpur 10, Dhaka',
    },
  });

  await prisma.membership.upsert({
    where: { userId_shopId: { userId: owner.id, shopId: shop.id } },
    update: {},
    create: { userId: owner.id, shopId: shop.id, role: Role.OWNER },
  });

  for (const product of demoProducts) {
    await prisma.product.upsert({
      where: { shopId_sku: { shopId: shop.id, sku: product.sku } },
      update: {},
      create: { ...product, shopId: shop.id },
    });
  }

  for (const customer of demoCustomers) {
    await prisma.customer.upsert({
      where: { shopId_phone: { shopId: shop.id, phone: customer.phone } },
      update: {},
      create: { ...customer, shopId: shop.id },
    });
  }

  console.log(
    `Demo shop "${shop.name}" (owner ${owner.email}): ` +
      `${demoProducts.length} products, ${demoCustomers.length} customers`,
  );
}

try {
  await seedLocations();
  await seedDemoShop();
} finally {
  // Always close the connection, even if something above failed,
  // otherwise the script would hang instead of exiting.
  await prisma.$disconnect();
}
