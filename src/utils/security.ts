/**
 * Generates an opaque QR token, e.g. ESG-7F8K2P9Q.
 * The token carries no patient-identifying information; it must always be
 * resolved server-side (here: via the mock qrService) against an
 * authenticated/authorized session before any maternal summary is revealed.
 */
export function generateOpaqueToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `ESG-${out}`;
}

export function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
