/**
 * Database tests: they prove the rules in docs/03-database-design.md §4 are
 * enforced by Postgres itself, not just by app code that might have a bug.
 *
 * Needs a migrated and seeded database:
 *   docker compose up -d && pnpm db:migrate && pnpm db:seed && pnpm test:db
 *
 * Each test runs inside a transaction that is rolled back at the end, so the
 * tests never leave rows behind in your database.
 */
import type { Prisma } from '../src/generated/prisma/client.js';
import { createPrismaClient } from '../src/prisma/create-prisma-client.js';

const prisma = createPrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

/** Thrown on purpose at the end of a test so Prisma rolls the transaction back. */
class Rollback extends Error {}

async function inRollback(fn: (tx: Prisma.TransactionClient) => Promise<void>): Promise<void> {
  try {
    await prisma.$transaction(async (tx) => {
      await fn(tx);
      throw new Rollback();
    });
  } catch (error) {
    if (!(error instanceof Rollback)) throw error;
  }
}

let counter = 0;
/** A fresh user + shop + customer to build on, unique to this test. */
async function makeShop(tx: Prisma.TransactionClient) {
  const n = `${Date.now()}-${++counter}`;
  const user = await tx.user.create({
    data: { email: `test-${n}@example.test`, name: 'Test User', passwordHash: '!' },
  });
  const shop = await tx.shop.create({ data: { name: `Test Shop ${n}`, slug: `test-shop-${n}` } });
  const customer = await tx.customer.create({
    data: { shopId: shop.id, name: 'Test Customer', phone: '+8801700000001' },
  });
  return { user, shop, customer };
}

function orderData(shopId: string, customerId: string, createdById: string, code = 'PG-000001') {
  return {
    shopId,
    customerId,
    createdById,
    code,
    addressLine: 'Mirpur 10, Dhaka',
    subtotalPaisa: 145000,
    deliveryChargePaisa: 7000,
    codAmountPaisa: 152000,
  };
}

describe('seeded data', () => {
  it('has every division, district and upazila', async () => {
    expect(await prisma.division.count()).toBe(8);
    expect(await prisma.district.count()).toBe(64);
    expect(await prisma.upazila.count()).toBe(495);
  });

  it('links Savar upazila to Dhaka district and Dhaka division', async () => {
    const savar = await prisma.upazila.findFirstOrThrow({
      where: { name: 'Savar' },
      include: { district: { include: { division: true } } },
    });
    expect(savar.district.name).toBe('Dhaka');
    expect(savar.district.division.name).toBe('Dhaka');
  });

  it('has the demo shop with an owner', async () => {
    const shop = await prisma.shop.findUniqueOrThrow({
      where: { slug: 'demo-fashion-house' },
      include: { memberships: true },
    });
    expect(shop.memberships).toHaveLength(1);
    expect(shop.memberships[0]?.role).toBe('OWNER');
  });
});

describe('multi-tenancy (§4.2)', () => {
  it('refuses an order in Shop A that points at a customer of Shop B', async () => {
    await inRollback(async (tx) => {
      const a = await makeShop(tx);
      const b = await makeShop(tx);

      await expect(
        tx.order.create({ data: orderData(a.shop.id, b.customer.id, a.user.id) }),
      ).rejects.toThrow(/orders_customer_id_shop_id_fkey/);
    });
  });

  it('allows the same phone number as a customer in two different shops', async () => {
    await inRollback(async (tx) => {
      const a = await makeShop(tx);
      const b = await makeShop(tx);

      // makeShop already gave both shops a customer with +8801700000001.
      expect(a.customer.phone).toBe(b.customer.phone);
    });
  });
});

describe('unique constraints do the hard work (§4.4)', () => {
  it('refuses a second customer with the same phone in the same shop', async () => {
    await inRollback(async (tx) => {
      const { shop } = await makeShop(tx);

      await expect(
        tx.customer.create({
          data: { shopId: shop.id, name: 'Duplicate', phone: '+8801700000001' },
        }),
      ).rejects.toThrow(/customers_shop_id_phone_key/);
    });
  });

  it('refuses a second shipment for the same order', async () => {
    await inRollback(async (tx) => {
      const { shop, customer, user } = await makeShop(tx);
      const order = await tx.order.create({ data: orderData(shop.id, customer.id, user.id) });
      await tx.shipment.create({
        data: { orderId: order.id, courier: 'MOCK', codExpectedPaisa: 152000 },
      });

      await expect(
        tx.shipment.create({ data: { orderId: order.id, courier: 'MOCK', codExpectedPaisa: 1 } }),
      ).rejects.toThrow(/shipments_order_id_key/);
    });
  });

  it('stores a webhook event delivered twice only once', async () => {
    await inRollback(async (tx) => {
      const { shop, customer, user } = await makeShop(tx);
      const order = await tx.order.create({ data: orderData(shop.id, customer.id, user.id) });
      const shipment = await tx.shipment.create({
        data: { orderId: order.id, courier: 'MOCK', codExpectedPaisa: 152000 },
      });
      const event = {
        shipmentId: shipment.id,
        status: 'IN_TRANSIT' as const,
        providerEventId: 'evt_123',
        rawPayload: { status: 'in_transit' },
        occurredAt: new Date(),
      };
      await tx.shipmentEvent.create({ data: event });

      await expect(tx.shipmentEvent.create({ data: event })).rejects.toThrow(
        /shipment_events_shipment_id_provider_event_id_key/,
      );
    });
  });

  it('refuses two orders with the same code in one shop', async () => {
    await inRollback(async (tx) => {
      const { shop, customer, user } = await makeShop(tx);
      await tx.order.create({ data: orderData(shop.id, customer.id, user.id, 'PG-000007') });

      await expect(
        tx.order.create({ data: orderData(shop.id, customer.id, user.id, 'PG-000007') }),
      ).rejects.toThrow(/orders_shop_id_code_key/);
    });
  });
});

describe('CHECK constraints (migration 2)', () => {
  it('refuses a negative price', async () => {
    await inRollback(async (tx) => {
      const { shop } = await makeShop(tx);

      await expect(
        tx.product.create({ data: { shopId: shop.id, sku: 'NEG', name: 'Bad', pricePaisa: -100 } }),
      ).rejects.toThrow(/products_price_paisa_check/);
    });
  });

  it('refuses an order item with quantity 0', async () => {
    await inRollback(async (tx) => {
      const { shop, customer, user } = await makeShop(tx);
      const order = await tx.order.create({ data: orderData(shop.id, customer.id, user.id) });

      await expect(
        tx.orderItem.create({
          data: { orderId: order.id, nameSnapshot: 'Panjabi', unitPricePaisa: 145000, quantity: 0 },
        }),
      ).rejects.toThrow(/order_items_quantity_check/);
    });
  });

  it('refuses a risk score above 100', async () => {
    await inRollback(async (tx) => {
      const { shop, customer, user } = await makeShop(tx);

      await expect(
        tx.order.create({ data: { ...orderData(shop.id, customer.id, user.id), riskScore: 140 } }),
      ).rejects.toThrow(/orders_risk_score_check/);
    });
  });
});

describe('order item snapshots (§4.3)', () => {
  it('keeps the old price on an order after the product price changes', async () => {
    await inRollback(async (tx) => {
      const { shop, customer, user } = await makeShop(tx);
      const product = await tx.product.create({
        data: { shopId: shop.id, sku: 'PNJ', name: 'Panjabi', pricePaisa: 145000 },
      });
      const order = await tx.order.create({ data: orderData(shop.id, customer.id, user.id) });
      const item = await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          nameSnapshot: product.name,
          unitPricePaisa: product.pricePaisa,
          quantity: 1,
        },
      });

      await tx.product.update({
        where: { id: product.id },
        data: { pricePaisa: 199000, name: 'Panjabi (new)' },
      });

      const after = await tx.orderItem.findUniqueOrThrow({ where: { id: item.id } });
      expect(after.unitPricePaisa).toBe(145000);
      expect(after.nameSnapshot).toBe('Panjabi');
    });
  });
});
