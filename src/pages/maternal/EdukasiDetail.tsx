import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { educationService } from '../../services/educationService';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Pill } from '../../components/ui/Pill';
import { NotFoundState } from '../../components/ui/States';

export function EdukasiDetailPage({ backTo = '/ibu/edukasi' }: { backTo?: string }) {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const content = id ? educationService.getById(id) : undefined;

  useEffect(() => {
    if (content && user) educationService.view(content.id, user.id, user.role);
  }, [content, user]);

  if (!content) return <NotFoundState />;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link to={backTo} className="inline-flex items-center gap-1 text-sm text-[var(--color-deep)]">
        <ChevronLeft className="h-4 w-4" /> Kembali ke Edukasi
      </Link>
      <div>
        <Pill tone={content.warningLevel === 'PENTING' ? 'red' : content.warningLevel === 'PERHATIAN' ? 'amber' : 'sage'}>
          {content.category.replace(/_/g, ' ')}
        </Pill>
        <h1 className="mt-2 font-display text-2xl font-semibold text-[var(--color-ink)]">{content.title}</h1>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">{content.description}</p>
      </div>
      <Card className="space-y-3 p-5">
        {content.content.map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-[var(--color-ink)]/80">
            {paragraph}
          </p>
        ))}
      </Card>
      <p className="text-xs text-[var(--color-ink)]/40">Sumber: {content.source}</p>
    </div>
  );
}
