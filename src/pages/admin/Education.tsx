import { educationService } from '../../services/educationService';
import { Card } from '../../components/ui/Card';
import { Pill } from '../../components/ui/Pill';
import { formatDateID } from '../../utils/date';

export function AdminEducationPage() {
  const content = educationService.listAll();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Konten Edukasi</h1>
        <p className="text-sm text-[var(--color-ink)]/60">{content.length} materi edukasi terdata</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {content.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex items-center justify-between">
              <Pill tone="blue">{c.category.replace(/_/g, ' ')}</Pill>
              <span className="text-xs text-[var(--color-ink)]/40">{formatDateID(c.updatedAt)}</span>
            </div>
            <p className="mt-2 font-medium text-[var(--color-ink)]">{c.title}</p>
            <p className="mt-0.5 text-sm text-[var(--color-ink)]/60">{c.description}</p>
            <p className="mt-2 text-xs text-[var(--color-ink)]/40">Sumber: {c.source}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
