import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { maternalService } from '../../services/maternalService';
import { screeningService } from '../../services/screeningService';
import { currentRiskFromHistory } from '../../domain/maternalRisk';
import { RiskBadge } from '../../components/common/RiskBadge';
import { Card } from '../../components/ui/Card';
import { maskPhone } from '../../utils/risk';
import { gravidaParaLabel } from '../../utils/pregnancy';

export function SemuaIbuPage() {
  const [query, setQuery] = useState('');
  const mothers = maternalService.listAll();

  const filtered = mothers.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Data Ibu</h1>
        <p className="text-sm text-[var(--color-ink)]/60">{mothers.length} ibu hamil dalam pemantauan</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink)]/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama ibu..."
          className="w-full rounded-xl border border-[var(--color-sage-line)] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[var(--color-deep)]"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((m) => {
          const gestational = maternalService.gestationalInfo(m);
          const risk = currentRiskFromHistory(screeningService.listByMother(m.id));
          return (
            <Link key={m.id} to={`/nakes/ibu/${m.id}`}>
              <Card className="p-4 hover:border-[var(--color-teal)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-[var(--color-ink)]">{m.name}</p>
                    <p className="text-xs text-[var(--color-ink)]/50">
                      {gravidaParaLabel(m.gravida, m.para)} · {gestational.weeks} minggu · {maskPhone(m.phone)}
                    </p>
                  </div>
                  {risk && <RiskBadge level={risk} size="sm" />}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
