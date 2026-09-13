import { screeningService } from '../../services/screeningService';
import { PatientPriorityTable } from '../../components/dashboard/PatientPriorityTable';

export function PrioritasPage() {
  const screenings = screeningService.listPriorityQueue();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Prioritas</h1>
        <p className="text-sm text-[var(--color-ink)]/60">
          Diurutkan berdasarkan tingkat risiko dan waktu deteksi.
        </p>
      </div>
      <PatientPriorityTable screenings={screenings} />
    </div>
  );
}
