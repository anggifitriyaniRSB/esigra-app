import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card } from '../../components/ui/Card';
import { Pill } from '../../components/ui/Pill';
import { EVALUATION_FRAMEWORK } from '../../domain/pilot/researchMode';

const RISK_COLORS: Record<string, string> = { RENDAH: '#2E7D74', SEDANG: '#B4791F', TINGGI: '#A83B26' };

// SIMULATED PILOT DATA — fabricated for demonstration purposes only. These
// numbers do not represent any real screening activity or pilot outcome.
const SIMULATED_RISK_DISTRIBUTION = [
  { name: 'RENDAH', value: 62 },
  { name: 'SEDANG', value: 24 },
  { name: 'TINGGI', value: 14 },
];

const SIMULATED_WEEKLY_SCREENINGS = [
  { week: 'M1', count: 18 },
  { week: 'M2', count: 27 },
  { week: 'M3', count: 34 },
  { week: 'M4', count: 41 },
];

const INPUT_METRICS = [
  { label: 'Ibu hamil terdaftar (simulasi)', value: '120' },
  { label: 'Nakes terlatih (simulasi)', value: '8' },
  { label: 'Situs aktif (simulasi)', value: '1' },
];

const PROCESS_METRICS = [
  { label: 'Tingkat penyelesaian skrining (simulasi)', value: '94%' },
  { label: 'Rata-rata waktu validasi (simulasi)', value: '9,4 jam' },
  { label: 'Inisiasi tindak lanjut (simulasi)', value: '88%' },
];

const OUTCOME_METRICS = [
  { label: 'Tindak lanjut kasus prioritas tinggi (simulasi)', value: '91%' },
  { label: 'Penyelesaian tindak lanjut (simulasi)', value: '76%' },
];

export function DemoImpactPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Dampak &amp; Kesiapan Pilot</h1>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          Seluruh angka pada halaman ini adalah <span className="font-semibold">SIMULATED PILOT DATA</span> untuk
          keperluan ilustrasi — bukan hasil pilot nyata dan bukan klaim dampak kausal.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <p className="font-medium text-[var(--color-ink)]">Distribusi Risiko (Simulasi)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SIMULATED_RISK_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78}>
                  {SIMULATED_RISK_DISTRIBUTION.map((e) => (
                    <Cell key={e.name} fill={RISK_COLORS[e.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <p className="font-medium text-[var(--color-ink)]">Tren Skrining Mingguan (Simulasi)</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SIMULATED_WEEKLY_SCREENINGS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCE8DE" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2E7D74" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <MetricLayer title="INPUT" description="Sumber daya yang tersedia untuk menjalankan sistem." metrics={INPUT_METRICS} />
      <MetricLayer title="PROCESS" description="Seberapa lancar alur kerja berjalan." metrics={PROCESS_METRICS} />
      <MetricLayer title="OUTCOME" description="Hasil yang ingin dicapai — akan dievaluasi dalam pilot dengan desain yang sesuai." metrics={OUTCOME_METRICS} />

      <Card className="p-5">
        <p className="font-medium text-[var(--color-ink)]">Kerangka Evaluasi Lengkap</p>
        <p className="mt-1 text-xs text-[var(--color-ink)]/50">
          Indikator yang ditandai "Terukur dari prototipe" dapat dihitung dari data yang ada; sisanya
          memerlukan data pilot nyata.
        </p>
        <div className="mt-3 space-y-2">
          {EVALUATION_FRAMEWORK.map((m) => (
            <div key={m.id} className="flex items-start justify-between gap-3 rounded-xl bg-[var(--color-canvas-sunk)] px-4 py-2.5 text-sm">
              <div>
                <p className="font-medium text-[var(--color-ink)]">{m.label}</p>
                <p className="text-xs text-[var(--color-ink)]/60">{m.description}</p>
              </div>
              <Pill tone={m.computable ? 'sage' : 'neutral'}>{m.computable ? 'Terukur dari prototipe' : 'Memerlukan data pilot'}</Pill>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function MetricLayer({ title, description, metrics }: { title: string; description: string; metrics: { label: string; value: string }[] }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Pill tone="blue">{title}</Pill>
        <p className="text-xs text-[var(--color-ink)]/60">{description}</p>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl bg-[var(--color-canvas-sunk)] p-3 text-center">
            <p className="font-display text-xl font-semibold text-[var(--color-deep-dark)]">{m.value}</p>
            <p className="mt-1 text-xs text-[var(--color-ink)]/60">{m.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
