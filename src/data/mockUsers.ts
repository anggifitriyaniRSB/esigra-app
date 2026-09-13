import type { User } from '../types/user';

/**
 * DEMO ACCOUNT — DEVELOPMENT ONLY.
 * Passwords are stored in plaintext here purely for prototype convenience.
 * A real deployment must never store or compare plaintext credentials.
 */
export const mockUsers: User[] = [
  {
    id: 'user_ibu_01',
    name: 'Ayu Lestari',
    email: 'demo.ibu@esigra.test',
    phone: '081234560001',
    role: 'IBU_HAMIL',
    status: 'ACTIVE',
    createdAt: '2026-02-01T08:00:00.000Z',
    mockPassword: 'Demo123!',
  },
  {
    id: 'user_nakes_01',
    name: 'Bidan Ratna Kusuma',
    email: 'demo.nakes@esigra.test',
    phone: '081234560002',
    role: 'NAKES',
    status: 'ACTIVE',
    createdAt: '2026-01-15T08:00:00.000Z',
    mockPassword: 'Demo123!',
  },
  {
    id: 'user_admin_01',
    name: 'Admin Sistem',
    email: 'demo.admin@esigra.test',
    phone: '081234560003',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-01-01T08:00:00.000Z',
    mockPassword: 'Demo123!',
  },
];

export const DEMO_ACCOUNTS = [
  { role: 'IBU HAMIL', email: 'demo.ibu@esigra.test', password: 'Demo123!' },
  { role: 'NAKES', email: 'demo.nakes@esigra.test', password: 'Demo123!' },
  { role: 'ADMIN', email: 'demo.admin@esigra.test', password: 'Demo123!' },
] as const;
