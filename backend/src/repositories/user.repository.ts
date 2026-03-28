import { prisma } from '../server';
import { Prisma } from '@prisma/client';

export class UserRepository {
  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { organization: true },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async incrementLoginCount(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        login_count: { increment: 1 },
        last_login: new Date(),
      },
    });
  }
}
