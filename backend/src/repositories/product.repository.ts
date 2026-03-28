import { prisma } from '../server';
import { Prisma } from '@prisma/client';

export class ProductRepository {
  async create(data: Prisma.ProductUncheckedCreateInput) {
    return prisma.product.create({ data });
  }

  async findById(id: string, orgId: string) {
    return prisma.product.findFirst({
      where: { id, organization_id: orgId, status: { not: 'ARCHIVED' } },
      include: { category: true },
    });
  }

  async update(id: string, orgId: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id, organization_id: orgId },
      data,
    });
  }

  async delete(id: string, orgId: string) {
    // Soft delete
    return prisma.product.update({
      where: { id, organization_id: orgId },
      data: { status: 'ARCHIVED' },
    });
  }

  async findAll(orgId: string, params: {
    skip?: number;
    take?: number;
    search?: string;
    categoryId?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const where: Prisma.ProductWhereInput = {
      organization_id: orgId,
      status: params.status !== 'ALL' ? (params.status as any || { not: 'ARCHIVED' }) : undefined,
      ...(params.categoryId ? { category_id: params.categoryId } : {}),
      ...(params.search ? {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' } },
          { sku: { contains: params.search, mode: 'insensitive' } },
        ]
      } : {})
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: params.skip,
        take: params.take,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder || 'desc' } : { created_at: 'desc' },
      }),
      prisma.product.count({ where })
    ]);

    return { items, total };
  }
}
