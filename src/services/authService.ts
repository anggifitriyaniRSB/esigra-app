import { LocalStorageRepository } from './repository';
import type { User } from '../types/user';
import { mockUsers } from '../data/mockUsers';
import { generateId } from '../utils/security';
import { nowIso } from '../utils/date';
import { auditService } from './auditService';

const userRepo = new LocalStorageRepository<User>('users');
userRepo.seedIfEmpty(mockUsers);

const SESSION_KEY = 'esigra:v1:session';

export interface RegisterMotherInput {
  name: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  hpht: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  password: string;
}

export const authService = {
  /**
   * PROTOTYPE AUTHENTICATION ONLY.
   * This compares a plaintext mock password for demo purposes and must be
   * replaced by a real credential/identity provider before production use.
   */
  login(emailOrPhone: string, password: string): User | null {
    const user = userRepo
      .getAll()
      .find((u) => u.email === emailOrPhone || u.phone === emailOrPhone);
    if (!user || user.mockPassword !== password) return null;
    if (user.status !== 'ACTIVE') return null;
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ userId: user.id, role: user.role, name: user.name, issuedAt: nowIso() })
    );
    auditService.log({
      actorId: user.id,
      actorRole: user.role,
      action: 'LOGIN',
      resourceType: 'User',
      resourceId: user.id,
    });
    return user;
  },

  logout(): void {
    const session = this.getSession();
    localStorage.removeItem(SESSION_KEY);
    if (session) {
      auditService.log({
        actorId: session.userId,
        actorRole: session.role,
        action: 'LOGOUT',
        resourceType: 'User',
        resourceId: session.userId,
      });
    }
  },

  getSession(): { userId: string; role: User['role']; name: string } | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  getCurrentUser(): User | null {
    const session = this.getSession();
    if (!session) return null;
    return userRepo.getById(session.userId) ?? null;
  },

  registerMother(input: RegisterMotherInput): { user: User } {
    const user: User = {
      id: generateId('user_ibu'),
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: 'IBU_HAMIL',
      status: 'ACTIVE',
      createdAt: nowIso(),
      mockPassword: input.password,
    };
    userRepo.create(user);
    auditService.log({
      actorId: user.id,
      actorRole: user.role,
      action: 'USER_CREATED',
      resourceType: 'User',
      resourceId: user.id,
    });
    return { user };
  },

  getUserById(id: string): User | undefined {
    return userRepo.getById(id);
  },
};
