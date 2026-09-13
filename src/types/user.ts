export type UserRole = 'IBU_HAMIL' | 'NAKES' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  /** Prototype-only mock credential. Never treat as a real auth secret. */
  mockPassword: string;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  name: string;
  issuedAt: string;
}
