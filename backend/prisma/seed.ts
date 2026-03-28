import { PrismaClient, PlanType, Role, ProductStatus, OrderStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing data
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.analytics.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // 2. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Commerce Pro Demo',
      slug: 'commerce-pro-demo',
      plan: PlanType.PRO,
      billing_email: 'admin@demo.com',
    },
  });

  console.log(`Created Org: ${org.name}`);

  // 3. Create Admin User
  const passwordHash = await bcrypt.hash('Demo1234!', 12);
  const admin = await prisma.user.create({
    data: {
      organization_id: org.id,
      email: 'admin@demo.com',
      name: 'Admin User',
      password_hash: passwordHash,
      role: Role.ADMIN,
      is_email_verified: true,
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  console.log(`Created Admin: ${admin.email}`);

  // 4. Create Categories
  const catElectronics = await prisma.category.create({ data: { organization_id: org.id, name: 'Electronics', slug: 'electronics' } });
  const catAccessories = await prisma.category.create({ data: { organization_id: org.id, name: 'Accessories', slug: 'accessories' } });
  const catWearables = await prisma.category.create({ data: { organization_id: org.id, name: 'Wearables', slug: 'wearables' } });
  const catSmartHome = await prisma.category.create({ data: { organization_id: org.id, name: 'Smart Home', slug: 'smart-home' } });

  // 5. Create Products matching the original arrays
  const products = [
    { name: 'iPhone 15 Pro Max', sku: 'IPH-15PM-256', price: 1199, qty: 45, category_id: catElectronics.id, img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop' },
    { name: 'MacBook Air M3', sku: 'MBA-M3-256', price: 1299, qty: 23, category_id: catElectronics.id, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop' },
    { name: 'AirPods Pro', sku: 'APP-2ND-GEN', price: 249, qty: 120, category_id: catAccessories.id, img: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=100&h=100&fit=crop' },
    { name: 'Apple Watch Ultra', sku: 'AWU-49MM', price: 799, qty: 5, category_id: catWearables.id, img: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=100&h=100&fit=crop' },
    { name: 'iPad Pro 12.9"', sku: 'IPP-129-M2', price: 1099, qty: 0, status: ProductStatus.DRAFT, category_id: catElectronics.id, img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop' },
    { name: 'Magic Keyboard', sku: 'MK-USB-C', price: 299, qty: 67, category_id: catAccessories.id, img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&h=100&fit=crop' },
    { name: 'HomePod Mini', sku: 'HPM-BLACK', price: 99, qty: 8, category_id: catSmartHome.id, img: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=100&h=100&fit=crop' },
    { name: 'Apple TV 4K', sku: 'ATV-4K-128', price: 179, qty: 3, category_id: catSmartHome.id, img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=100&h=100&fit=crop' },
  ];

  const createdProducts = [];
  for (const p of products) {
    const prod = await prisma.product.create({
      data: {
        organization_id: org.id,
        category_id: p.category_id,
        name: p.name,
        sku: p.sku,
        price: p.price,
        inventory_qty: p.qty,
        status: p.status || ProductStatus.ACTIVE,
        images: [p.img],
      }
    });
    createdProducts.push(prod);
  }

  // 6. Create Customers
  const custData = [
    { name: "John Doe", email: "john@example.com", avatar: "john", spent: 12450, orders: 15 },
    { name: "Sarah Smith", email: "sarah@example.com", avatar: "sarah", spent: 18920, orders: 23 },
    { name: "Mike Johnson", email: "mike@example.com", avatar: "mike", spent: 3450, orders: 8 },
    { name: "Emily Brown", email: "emily@example.com", avatar: "emily", spent: 24780, orders: 31 },
    { name: "David Wilson", email: "david@example.com", avatar: "david", spent: 899, orders: 2 },
    { name: "Lisa Anderson", email: "lisa@example.com", avatar: "lisa", spent: 15670, orders: 19 },
  ];

  const createdCustomers = [];
  for (const c of custData) {
    const cust = await prisma.customer.create({
      data: {
        organization_id: org.id,
        name: c.name,
        email: c.email,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.avatar}`,
        total_spent: c.spent,
        orders_count: c.orders,
      }
    });
    createdCustomers.push(cust);
  }

  // 7. Create Orders
  const orderDetails = [
    { cid: 0, pids: [0, 2], total: 1548,  status: OrderStatus.DELIVERED, payment: PaymentStatus.PAID, date: new Date(Date.now() - 1 * 86400000) },
    { cid: 1, pids: [1],    total: 1499,  status: OrderStatus.PROCESSING, payment: PaymentStatus.PAID, date: new Date(Date.now() - 2 * 86400000) },
    { cid: 2, pids: [2],    total: 298,   status: OrderStatus.PENDING, payment: PaymentStatus.PENDING, date: new Date(Date.now() - 3 * 86400000) },
    { cid: 3, pids: [4, 5], total: 1448,  status: OrderStatus.DELIVERED, payment: PaymentStatus.PAID, date: new Date(Date.now() - 4 * 86400000) },
    { cid: 4, pids: [3],    total: 799,   status: OrderStatus.CANCELLED, payment: PaymentStatus.REFUNDED, date: new Date(Date.now() - 5 * 86400000) },
    { cid: 5, pids: [0],    total: 948,   status: OrderStatus.SHIPPED, payment: PaymentStatus.PAID, date: new Date(Date.now() - 6 * 86400000) },
  ];

  let orderNum = 7880;
  for (const o of orderDetails) {
    const customer = createdCustomers[o.cid];
    const items = o.pids.map(pidIndex => {
      const p = createdProducts[pidIndex];
      return {
        product_id: p.id,
        product_name: p.name,
        product_sku: p.sku,
        quantity: 1,
        unit_price: p.price,
        total_price: p.price,
      };
    });

    await prisma.order.create({
      data: {
        organization_id: org.id,
        customer_id: customer.id,
        order_number: orderNum++,
        status: o.status,
        payment_status: o.payment,
        subtotal: o.total,
        total: o.total,
        created_at: o.date,
        items: {
          create: items
        }
      }
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
