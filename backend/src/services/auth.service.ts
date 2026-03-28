import { UserRepository } from '../repositories/user.repository';
import { SessionRepository } from '../repositories/session.repository';
import { OrganizationRepository } from '../repositories/organization.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { CustomError } from '../middleware/errorHandler';

const userRepo = new UserRepository();
const sessionRepo = new SessionRepository();
const orgRepo = new OrganizationRepository();

export class AuthService {
  async register(data: any) {
    const { name, email, password, orgName } = data;

    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      throw new CustomError('Email already in use', 400);
    }

    // Generate random slug for org
    const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    const org = await orgRepo.create({
      name: orgName,
      slug,
      billing_email: email,
    });

    const hashedPassword = await hashPassword(password);

    const user = await userRepo.create({
      email,
      name,
      password_hash: hashedPassword,
      organization_id: org.id,
      role: 'ADMIN', // First user is ADMIN
    });

    const accessToken = signAccessToken(user, org);
    const refreshToken = signRefreshToken(user, org);

    // Save session
    await sessionRepo.create({
      user_id: user.id,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      organization: org,
      accessToken,
      refreshToken
    };
  }

  async login(data: any, ipAddress?: string, userAgent?: string) {
    const { email, password } = data;

    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new CustomError('Invalid credentials', 401);
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw new CustomError('Invalid credentials', 401);
    }

    const org = await orgRepo.findById(user.organization_id);
    if (!org) {
      throw new CustomError('Organization not found', 404);
    }

    const accessToken = signAccessToken(user, org);
    const refreshToken = signRefreshToken(user, org);

    await sessionRepo.create({
      user_id: user.id,
      refresh_token: refreshToken,
      ip_address: ipAddress,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await userRepo.incrementLoginCount(user.id);

    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      organization: org,
      accessToken,
      refreshToken
    };
  }

  async logout(userId: string, refreshToken: string) {
    const session = await sessionRepo.findByToken(refreshToken);
    if (session && session.user_id === userId) {
      await sessionRepo.revoke(session.id);
    }
    return true;
  }
}
