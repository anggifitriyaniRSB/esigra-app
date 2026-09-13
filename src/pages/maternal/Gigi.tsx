import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { maternalService } from '../../services/maternalService';
import { dentalService } from '../../services/dentalService';
import { DentalHealthCard } from '../../components/dental/DentalHealthCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/States';
import type { DentalProblems, DentalSeverity } from '../../types/dental';
import { Smile } from 'lucide-react';

const SEVERITY_OPTIONS: { value: DentalSeverity; label: string }[] = [
  { value: null, label: 'Tidak ada' },
  { value: 'RINGAN', label: 'Ringan' },
  { value: 'SEDANG', label: 'Sedang' },
  { value: 'BERAT', label: 'Berat' },
];

export function GigiPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [problems, setProblems] = useState<DentalProblems>({
    karies: null,
    gingivitis: null,
    gigiBerlubang: false,
    gigiGoyang: false,
    abses: false,
  });

  if (!user) return null;
  const mother = maternalService.getByUserId(user.id);
  if (!mother) return null;

  const records = dentalService.listByMother(mother.id);

  const handleSubmit = () => {
    dentalService.submit(mother.id, problems);
    setShowForm(false);
    setProblems({ karies: null, gingivitis: null, gigiBerlubang: false, gigiGoyang: false, abses: false });
  };

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Kesehatan Gigi Ibu Hamil</h1>
        <Button size="sm" variant="secondary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Batal' : 'Catat Baru'}
        </Button>
      </div>

      {showForm && (
        <Card className="space-y-4 p-5">
          <SeverityField
            label="Karies"
            value={problems.karies}
            onChange={(v) => setProblems((p) => ({ ...p, karies: v }))}
          />
          <SeverityField
            label="Gingivitis"
            value={problems.gingivitis}
            onChange={(v) => setProblems((p) => ({ ...p, gingivitis: v }))}
          />
          <ToggleField
            label="Gigi berlubang"
            checked={problems.gigiBerlubang}
            onChange={(v) => setProblems((p) => ({ ...p, gigiBerlubang: v }))}
          />
          <ToggleField
            label="Gigi goyang"
            checked={problems.gigiGoyang}
            onChange={(v) => setProblems((p) => ({ ...p, gigiGoyang: v }))}
          />
          <ToggleField
            label="Abses"
            checked={problems.abses}
            onChange={(v) => setProblems((p) => ({ ...p, abses: v }))}
          />
          <Button fullWidth onClick={handleSubmit}>
            Simpan Catatan
          </Button>
        </Card>
      )}

      {records.length === 0 ? (
        <EmptyState icon={<Smile className="h-7 w-7" />} title="Belum ada catatan kesehatan gigi." />
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <DentalHealthCard key={r.id} record={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function SeverityField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DentalSeverity;
  onChange: (v: DentalSeverity) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-[var(--color-ink)]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {SEVERITY_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onChange(opt.value)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium ${
              value === opt.value
                ? 'border-[var(--color-deep)] bg-[var(--color-sage)] text-[var(--color-deep-dark)]'
                : 'border-[var(--color-sage-line)] text-[var(--color-ink)]/70'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between text-sm font-medium text-[var(--color-ink)]">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5"
      />
    </label>
  );
}
