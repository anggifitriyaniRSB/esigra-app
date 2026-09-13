import { Card } from '../../components/ui/Card';

const CHALLENGE = ['Tanda bahaya bisa terlewat', 'Informasi terfragmentasi', 'Tindak lanjut berpotensi tertunda', 'Edukasi terputus dari kondisi Ibu', 'Pemantauan sulit dilakukan'];
const SOLUTION = ['Deteksi dini terstruktur', 'Informasi terstruktur dalam satu sistem', 'Indikasi prioritas untuk Nakes', 'Validasi tenaga kesehatan', 'Tindak lanjut tercatat', 'Pemantauan berkelanjutan'];

export function DemoBeforeAfterPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Tantangan Saat Ini vs e-SIGRA</h1>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          Perbandingan ini bersifat ilustratif untuk menjelaskan alur kerja, bukan klaim hasil penelitian.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <p className="font-medium text-[var(--color-red)]">Tantangan Saat Ini</p>
          <ol className="mt-3 space-y-2">
            {CHALLENGE.map((c, i) => (
              <li key={c} className="flex items-start gap-2 text-sm text-[var(--color-ink)]/70">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-red-bg)] text-[10px] font-semibold text-[var(--color-red)]">
                  {i + 1}
                </span>
                {c}
              </li>
            ))}
          </ol>
        </Card>
        <Card className="p-5">
          <p className="font-medium text-[var(--color-deep)]">Dengan e-SIGRA</p>
          <ol className="mt-3 space-y-2">
            {SOLUTION.map((s, i) => (
              <li key={s} className="flex items-start gap-2 text-sm text-[var(--color-ink)]/70">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-sage)] text-[10px] font-semibold text-[var(--color-deep-dark)]">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <p className="font-medium text-[var(--color-ink)]">Ibu — Sebelum</p>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">Mengalami gejala → tidak yakin harus bagaimana → informasi terfragmentasi.</p>
        </Card>
        <Card className="p-5">
          <p className="font-medium text-[var(--color-ink)]">Ibu — Dengan e-SIGRA</p>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">Skrining terstruktur → edukasi kontekstual → catatan digital.</p>
        </Card>
        <Card className="p-5">
          <p className="font-medium text-[var(--color-ink)]">Nakes — Sebelum</p>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">Menerima informasi belakangan → pemantauan manual → sulit melacak tindak lanjut.</p>
        </Card>
        <Card className="p-5">
          <p className="font-medium text-[var(--color-ink)]">Nakes — Dengan e-SIGRA</p>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">Antrean prioritas → validasi → pemantauan tindak lanjut.</p>
        </Card>
      </div>
    </div>
  );
}
