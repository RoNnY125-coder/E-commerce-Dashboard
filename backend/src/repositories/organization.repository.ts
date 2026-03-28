import { prisma } from '../server';
import { Prisma } from '@prisma/client';

export class OrganizationRepository {
  async create(data: Prisma.OrganizationCreateInput) {
    return prisma.organization.create({ data });
  }

  async findById(id: string) {
    return prisma.organization.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.OrganizationUpdateInput) {
    return prisma.organization.update({
      where: { id },
      data,
    });
  }

  async getMembers(orgId: string) {
    return prisma.user.findMany({
      where: { organization_id: orgId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar_url: true,
        last_login: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
