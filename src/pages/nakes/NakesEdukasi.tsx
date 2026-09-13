import { useMemo } from 'react';
import { educationService } from '../../services/educationService';
import { EducationCard } from '../../components/education/EducationCard';

export function NakesEdukasiPage() {
  const content = useMemo(() => educationService.listAll(), []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Edukasi</h1>
        <p className="text-sm text-[var(--color-ink)]/60">
          Materi edukasi yang tersedia untuk direkomendasikan kepada ibu hamil.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {content.map((c) => (
          <EducationCard key={c.id} content={c} basePath="/nakes/edukasi" />
        ))}
      </div>
    </div>
  );
}
