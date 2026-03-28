import { prisma } from '../server';
import { Prisma } from '@prisma/client';

export class AnalyticsRepository {
  async getOverview(orgId: string, startDate: Date, endDate: Date) {
    // In a real app, this would use the pre-aggregated Analytics table.
    // For now, we'll calculate it on the fly to match exactly the data in the demo.
    const totals = await prisma.order.aggregate({
      where: {
        organization_id: orgId,
        created_at: { gte: startDate, lte: endDate },
        status: { not: 'CANCELLED' }
      },
      _sum: { total: true },
      _count: { id: true }
    });

    const currentCustomers = await prisma.customer.count({
      where: {
        organization_id: orgId,
        created_at: { lte: endDate }
      }
    });

    return {
      totalRevenue: totals._sum.total || 0,
      totalOrders: totals._count.id,
      totalCustomers: currentCustomers,
      avgOrderValue: totals._count.id > 0 ? Number(totals._sum.total) / totals._count.id : 0
    };
  }

  async getRevenueSeries(orgId: string, startDate: Date, endDate: Date) {
    // Generate daily revenue dynamically from orders for accuracy
    const orders = await prisma.order.groupBy({
      by: ['created_at'],
      where: {
        organization_id: orgId,
        created_at: { gte: startDate, lte: endDate },
        status: { not: 'CANCELLED' }
      },
      _sum: { total: true },
    });
    return orders;
  }
  
  async getTopProducts(orgId: string, limit: number = 5) {
    // Needs raw query or complex aggregate if strictly grouped by product
    // For simplicity, we fetch grouped items
    const items = await prisma.orderItem.groupBy({
      by: ['product_id', 'product_name'],
      where: {
        order: { organization_id: orgId, status: { not: 'CANCELLED' } }
      },
      _sum: { quantity: true, total_price: true },
      orderBy: { _sum: { total_price: 'desc' } },
      take: limit
    });
    return items;
  }
}
