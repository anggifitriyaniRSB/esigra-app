import {
  Home,
  Stethoscope,
  History,
  BookOpen,
  Smile,
  QrCode,
  User,
  LayoutDashboard,
  ListOrdered,
  Users,
  ClipboardList,
  ScanLine,
  FileBarChart,
  ShieldCheck,
  Settings,
  FileClock,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const IBU_NAV: NavItem[] = [
  { label: 'Beranda', path: '/ibu', icon: Home },
  { label: 'Deteksi Dini', path: '/ibu/deteksi-dini', icon: Stethoscope },
  { label: 'Hasil & Riwayat', path: '/ibu/riwayat', icon: History },
  { label: 'Edukasi', path: '/ibu/edukasi', icon: BookOpen },
  { label: 'Kesehatan Gigi', path: '/ibu/gigi', icon: Smile },
  { label: 'QR Saya', path: '/ibu/qr', icon: QrCode },
  { label: 'Profil', path: '/ibu/profil', icon: User },
];

export const IBU_BOTTOM_NAV: NavItem[] = [
  { label: 'Beranda', path: '/ibu', icon: Home },
  { label: 'Deteksi', path: '/ibu/deteksi-dini', icon: Stethoscope },
  { label: 'Riwayat', path: '/ibu/riwayat', icon: History },
  { label: 'Edukasi', path: '/ibu/edukasi', icon: BookOpen },
  { label: 'Profil', path: '/ibu/profil', icon: User },
];

export const NAKES_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/nakes', icon: LayoutDashboard },
  { label: 'Prioritas', path: '/nakes/prioritas', icon: ListOrdered },
  { label: 'Data Ibu', path: '/nakes/ibu', icon: Users },
  { label: 'Deteksi Dini', path: '/nakes/deteksi', icon: Stethoscope },
  { label: 'Tindak Lanjut', path: '/nakes/tindak-lanjut', icon: ClipboardList },
  { label: 'Scan QR', path: '/nakes/scan', icon: ScanLine },
  { label: 'Edukasi', path: '/nakes/edukasi', icon: BookOpen },
  { label: 'Laporan', path: '/nakes/laporan', icon: FileBarChart },
];

export const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Pengguna', path: '/admin/users', icon: Users },
  { label: 'Nakes', path: '/admin/nakes', icon: ShieldCheck },
  { label: 'Aturan Skrining', path: '/admin/screening-rules', icon: Stethoscope },
  { label: 'Edukasi', path: '/admin/education', icon: BookOpen },
  { label: 'Audit Log', path: '/admin/audit-log', icon: FileClock },
  { label: 'Pengaturan', path: '/admin/settings', icon: Settings },
];
