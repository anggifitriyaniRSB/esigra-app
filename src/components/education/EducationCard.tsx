import { Link } from 'react-router-dom';
import type { EducationContent } from '../../types/education';
import { Card } from '../ui/Card';
import { Pill } from '../ui/Pill';
import { ChevronRight } from 'lucide-react';

const WARNING_TONE: Record<EducationContent['warningLevel'], 'sage' | 'amber' | 'red'> = {
  INFO: 'sage',
  PERHATIAN: 'amber',
  PENTING: 'red',
};

export function EducationCard({
  content,
  basePath = '/ibu/edukasi',
}: {
  content: EducationContent;
  basePath?: string;
}) {
  return (
    <Link to={`${basePath}/${content.id}`}>
      <Card className="flex items-center justify-between gap-3 p-4 hover:border-[var(--color-teal)]">
        <div>
          <Pill tone={WARNING_TONE[content.warningLevel]}>{content.category.replace(/_/g, ' ')}</Pill>
          <p className="mt-2 font-medium text-[var(--color-ink)]">{content.title}</p>
          <p className="mt-0.5 text-sm text-[var(--color-ink)]/60">{content.description}</p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-[var(--color-ink)]/30" />
      </Card>
    </Link>
  );
}
