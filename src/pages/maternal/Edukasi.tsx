import { useMemo, useState } from 'react';
import type { EducationCategory } from '../../types/education';
import { educationService } from '../../services/educationService';
import { EducationDisc } from '../../components/education/EducationDisc';
import { EducationCard } from '../../components/education/EducationCard';
import { EmptyState } from '../../components/ui/States';
import { BookOpen } from 'lucide-react';

const CATEGORY_LABEL: Record<EducationCategory, string> = {
  TANDA_BAHAYA: 'Tanda Bahaya',
  NUTRISI: 'Nutrisi',
  PERSIAPAN_PERSALINAN: 'Persiapan Persalinan',
  KESEHATAN_GIGI: 'Kesehatan Gigi',
  KAPAN_KE_FASKES: 'Kapan Harus ke Faskes',
  TRIMESTER: 'Trimester',
};

export function EdukasiPage() {
  const [selected, setSelected] = useState<EducationCategory | null>(null);
  const allContent = useMemo(() => educationService.listAll(), []);
  const filtered = selected ? allContent.filter((c) => c.category === selected) : allContent;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
          The e-SIGRA Digital Education Disc
        </h1>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          Pilih topik untuk melihat materi edukasi yang relevan.
        </p>
      </div>

      <EducationDisc onSelect={setSelected} />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-medium text-[var(--color-ink)]">
            {selected ? CATEGORY_LABEL[selected] : 'Semua Materi'}
          </p>
          {selected && (
            <button
              onClick={() => setSelected(null)}
              className="text-xs font-medium text-[var(--color-deep)] hover:underline"
            >
              Tampilkan semua
            </button>
          )}
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<BookOpen className="h-7 w-7" />} title="Belum ada materi untuk topik ini." />
        ) : (
          filtered.map((c) => <EducationCard key={c.id} content={c} />)
        )}
      </div>
    </div>
  );
}
