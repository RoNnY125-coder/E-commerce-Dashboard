import { UserRepository } from '../repositories/user.repository';
import { SessionRepository } from '../repositories/session.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { uploadImage } from '../utils/cloudinary';
import { CustomError } from '../middleware/errorHandler';

const userRepo = new UserRepository();
const sessionRepo = new SessionRepository();

export class ProfileService {
  async getProfile(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new CustomError('User not found', 404);
    
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, data: any) {
    const { name, timezone, language, notification_prefs } = data;
    
    // We only allow updating non-critical fields here
    const updateData: any = {};
    if (name) updateData.name = name;
    if (timezone) updateData.timezone = timezone;
    if (language) updateData.language = language;
    if (notification_prefs) updateData.notification_prefs = notification_prefs;

    const user = await userRepo.update(userId, updateData);
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async uploadAvatar(userId: string, fileBuffer: Buffer) {
    // We upload to folder 'avatars'
    const avatarUrl = await uploadImage(fileBuffer, 'ecommerce/avatars');
    
    const user = await userRepo.update(userId, { avatar_url: avatarUrl });
    return { avatarUrl: user.avatar_url };
  }

  async changePassword(userId: string, data: any) {
    const { currentPassword, newPassword } = data;

    const user = await userRepo.findById(userId);
    if (!user) throw new CustomError('User not found', 404);

    const isValid = await comparePassword(currentPassword, user.password_hash);
    if (!isValid) throw new CustomError('Invalid current password', 400);

    const hashedNewPassword = await hashPassword(newPassword);
    await userRepo.update(userId, { password_hash: hashedNewPassword });

    // Revoke all other sessions so they have to login again everywhere else
    await sessionRepo.revokeAllForUser(userId);

    return true;
  }

  async getActiveSessions(userId: string) {
    const sessions = await sessionRepo.findActiveByUserId(userId);
    return sessions.map(s => ({
      id: s.id,
      ip_address: s.ip_address,
      user_agent: s.user_agent,
      created_at: s.created_at,
      expires_at: s.expires_at
    }));
  }

  async revokeSession(userId: string, sessionId: string) {
    // Verify session belongs to user
    const sessions = await sessionRepo.findActiveByUserId(userId);
    const ownsSession = sessions.some(s => s.id === sessionId);
    
    if (!ownsSession) {
      throw new CustomError('Session not found or already revoked', 404);
    }

    await sessionRepo.revoke(sessionId);
    return true;
  }
}
