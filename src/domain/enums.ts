export const USER_TYPES = {
  IBU_HAMIL: 'IBU_HAMIL',
  NAKES: 'NAKES',
  ADMIN: 'ADMIN',
} as const;

export const RISK_WEIGHT: Record<'RENDAH' | 'SEDANG' | 'TINGGI', number> = {
  TINGGI: 3,
  SEDANG: 2,
  RENDAH: 1,
};

export const RISK_LABEL: Record<'RENDAH' | 'SEDANG' | 'TINGGI', string> = {
  RENDAH: 'Risiko Rendah',
  SEDANG: 'Perlu Perhatian',
  TINGGI: 'Prioritas Evaluasi',
};
