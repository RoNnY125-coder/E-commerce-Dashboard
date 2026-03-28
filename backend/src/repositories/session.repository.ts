import { prisma } from '../server';
import { Prisma } from '@prisma/client';

export class SessionRepository {
  async create(data: Prisma.SessionUncheckedCreateInput) {
    return prisma.session.create({ data });
  }

  async findByToken(token: string) {
    return prisma.session.findUnique({ where: { refresh_token: token } });
  }

  async findActiveByUserId(userId: string) {
    return prisma.session.findMany({
      where: {
        user_id: userId,
        revoked_at: null,
        expires_at: { gt: new Date() },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async revoke(id: string) {
    return prisma.session.update({
      where: { id },
      data: { revoked_at: new Date() },
    });
  }

  async revokeAllForUser(userId: string, keepSessionId?: string) {
    return prisma.session.updateMany({
      where: {
        user_id: userId,
        revoked_at: null,
        ...(keepSessionId ? { id: { not: keepSessionId } } : {}),
      },
      data: { revoked_at: new Date() },
    });
  }
}
