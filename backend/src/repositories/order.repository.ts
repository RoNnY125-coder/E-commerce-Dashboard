import { prisma } from '../server';
import { Prisma } from '@prisma/client';

export class OrderRepository {
  async create(data: Prisma.OrderUncheckedCreateInput, items: Prisma.OrderItemUncheckedCreateWithoutOrderInput[]) {
    // Transaction to create order + items and update customer stats
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          ...data,
          items: { create: items }
        },
        include: { items: true, customer: true }
      });

      await tx.customer.update({
        where: { id: data.customer_id },
        data: {
          total_spent: { increment: data.total },
          orders_count: { increment: 1 },
          last_order_at: new Date()
        }
      });

      return order;
    });
  }

  async getNextOrderNumber(orgId: string): Promise<number> {
    const lastOrder = await prisma.order.findFirst({
      where: { organization_id: orgId },
      orderBy: { order_number: 'desc' },
      select: { order_number: true }
    });
    return lastOrder ? lastOrder.order_number + 1 : 1000;
  }

  async findById(id: string, orgId: string) {
    return prisma.order.findFirst({
      where: { id, organization_id: orgId },
      include: { items: true, customer: true }
    });
  }

  async updateStatus(id: string, orgId: string, status: any) {
    return prisma.order.update({
      where: { id, organization_id: orgId },
      data: { status }
    });
  }

  async findAll(orgId: string, params: {
    skip?: number;
    take?: number;
    search?: string;
    status?: string;
    customerId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    // For search, we might want to look at order_number or customer email/name
    let searchCondition = {};
    if (params.search) {
      const searchNum = parseInt(params.search);
      if (!isNaN(searchNum)) {
        searchCondition = { order_number: searchNum };
      } else {
        searchCondition = {
          customer: {
            OR: [
              { name: { contains: params.search, mode: 'insensitive' } },
              { email: { contains: params.search, mode: 'insensitive' } }
            ]
          }
        };
      }
    }

    const where: Prisma.OrderWhereInput = {
      organization_id: orgId,
      ...(params.status && params.status !== 'all' ? { status: params.status as any } : {}),
      ...(params.customerId ? { customer_id: params.customerId } : {}),
      ...searchCondition
    };

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: { select: { name: true, email: true, avatar_url: true } },
          items: { select: { product_name: true }, take: 2 }
        },
        skip: params.skip,
        take: params.take,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder || 'desc' } : { created_at: 'desc' },
      }),
      prisma.order.count({ where })
    ]);

    return { items, total };
  }
}
