import { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { screeningService } from '../../services/screeningService';
import { followUpService } from '../../services/followUpService';
import { auditService } from '../../services/auditService';
import { Card } from '../../components/ui/Card';

const RISK_COLORS: Record<string, string> = {
  RENDAH: '#2E7D74',
  SEDANG: '#B4791F',
  TINGGI: '#A83B26',
};

export function LaporanPage() {
  const screenings = screeningService.listAll();
  const followUps = followUpService.listAll();
  const educationViews = useMemo(
    () => auditService.list().filter((a) => a.action === 'EDUCATION_VIEWED').length,
    []
  );

  const riskDistribution = ['RENDAH', 'SEDANG', 'TINGGI'].map((level) => ({
    name: level,
    value: screenings.filter((s) => s.riskLevel === level).length,
  }));

  const trendByDay: Record<string, number> = {};
  screenings.forEach((s) => {
    const day = new Date(s.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    trendByDay[day] = (trendByDay[day] ?? 0) + 1;
  });
  const trendData = Object.entries(trendByDay).map(([day, count]) => ({ day, count }));

  const pendingCount = screenings.filter((s) => s.validationStatus === 'BELUM_DIVALIDASI').length;
  const followUpAktif = followUps.filter((f) => f.status === 'AKTIF').length;
  const followUpSelesai = followUps.filter((f) => f.status === 'SELESAI').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Laporan</h1>
        <p className="text-sm text-[var(--color-ink)]/60">
          Analitik berbasis data demo/mock. Data bukan representasi klinis nyata.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <p className="font-medium text-[var(--color-ink)]">Distribusi Risiko</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                  {riskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={RISK_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            {riskDistribution.map((r) => (
              <span key={r.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: RISK_COLORS[r.name] }} />
                {r.name} ({r.value})
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <p className="font-medium text-[var(--color-ink)]">Tren Skrining</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCE8DE" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2E7D74" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Menunggu Validasi" value={pendingCount} />
        <Stat label="Tindak Lanjut Aktif" value={followUpAktif} />
        <Stat label="Tindak Lanjut Selesai" value={followUpSelesai} />
        <Stat label="Materi Edukasi Dilihat" value={educationViews} />
      </div>

      <p className="text-xs text-[var(--color-ink)]/40">
        Seluruh grafik dihasilkan dari data mock/demo pada prototipe ini.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4 text-center">
      <p className="font-display text-2xl font-semibold text-[var(--color-deep-dark)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--color-ink)]/60">{label}</p>
    </Card>
  );
}
