import { prisma } from '../server';
import { Prisma } from '@prisma/client';

export class CustomerRepository {
  async create(data: Prisma.CustomerUncheckedCreateInput) {
    return prisma.customer.create({ data });
  }

  async findById(id: string, orgId: string) {
    return prisma.customer.findFirst({
      where: { id, organization_id: orgId },
      include: {
        orders: {
          take: 5,
          orderBy: { created_at: 'desc' },
          select: { id: true, order_number: true, total: true, status: true, created_at: true }
        }
      }
    });
  }

  async update(id: string, orgId: string, data: Prisma.CustomerUpdateInput) {
    return prisma.customer.update({
      where: { id, organization_id: orgId },
      data,
    });
  }

  async findAll(orgId: string, params: {
    skip?: number;
    take?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const where: Prisma.CustomerWhereInput = {
      organization_id: orgId,
      ...(params.search ? {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' } },
          { email: { contains: params.search, mode: 'insensitive' } },
        ]
      } : {})
    };

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder || 'desc' } : { created_at: 'desc' },
      }),
      prisma.customer.count({ where })
    ]);

    return { items, total };
  }

  async delete(id: string, orgId: string) {
    return prisma.customer.delete({
      where: { id, organization_id: orgId },
    });
  }
}
