import { Link } from 'react-router-dom';
import { Phone, MapPin, BookOpen, History as HistoryIcon, Clock, CheckCircle2, Activity, FolderCheck } from 'lucide-react';
import type { Screening } from '../../types/screening';
import { RiskBadge } from '../common/RiskBadge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SCREENING_CONFIG } from '../../domain/screeningRules';
import { resolveRecommendation, describeValidationStatus } from '../../domain/screeningInterpretation';

const VALIDATION_ICON: Record<string, typeof Clock> = {
  'Menunggu validasi tenaga kesehatan': Clock,
  'Sudah divalidasi — tindak lanjut sedang berjalan': Activity,
  'Sudah divalidasi — tindak lanjut selesai': FolderCheck,
  'Sudah divalidasi — tindak lanjut diperlukan': Activity,
  'Sudah divalidasi tenaga kesehatan': CheckCircle2,
};

export function RiskResultCard({ screening }: { screening: Screening }) {
  // All clinical copy comes from the domain recommendation resolver, not
  // from literals in this component — see domain/screeningInterpretation.ts.
  const recommendation = resolveRecommendation(screening.riskLevel);
  const validationLabel = describeValidationStatus(screening);
  const ValidationIcon = VALIDATION_ICON[validationLabel] ?? Clock;

  const isHigh = recommendation.urgency === 'IMMEDIATE';
  const isMedium = recommendation.urgency === 'SOON';

  return (
    <div className="space-y-4">
      {/* Headline */}
      <Card className={isHigh ? 'border-[var(--color-red)]/40' : undefined}>
        <div className="p-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink)]/50">
            Hasil Skrining Anda
          </p>
          <div className="mt-3 flex justify-center">
            <RiskBadge level={screening.riskLevel} size="lg" />
          </div>
          <p className="mt-3 font-display text-xl font-semibold text-[var(--color-ink)]">
            {recommendation.headline}
          </p>
          {SCREENING_CONFIG.showScoreToPatient && (
            <p className="mt-1 text-xs text-[var(--color-ink)]/40">Skor skrining: {screening.score}</p>
          )}

          {screening.suspectConditions.length > 0 && (
            <div className="mx-auto mt-4 max-w-sm rounded-xl bg-[var(--color-amber-bg)] px-4 py-3 text-left text-xs text-[var(--color-amber)]">
              <p className="font-semibold">Indikasi yang terdeteksi:</p>
              <ul className="mt-1 list-disc pl-4">
                {screening.suspectConditions.map((s, i) => (
                  <li key={i}>{s.label}</li>
                ))}
              </ul>
              <p className="mt-1.5 text-[var(--color-ink)]/60">
                Ini adalah indikasi awal, bukan diagnosis. Perlu evaluasi tenaga kesehatan.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* WHAT DOES THIS MEAN */}
      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">Interpretasi</p>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink)]/80">
          {recommendation.interpretation}
        </p>
      </Card>

      {/* WHAT SHOULD I DO NOW */}
      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">
          Yang Perlu Dilakukan
        </p>
        <ul className="mt-2 space-y-2">
          {recommendation.whatToDo.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-ink)]/80">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-teal)]" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      {/* WHO SHOULD I CONTACT */}
      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">
          Siapa yang Perlu Dihubungi
        </p>
        <p className="mt-1.5 text-sm text-[var(--color-ink)]/80">{recommendation.whoToContact}</p>
      </Card>

      {/* Emergency action block for high risk */}
      {isHigh && (
        <Card className="border-[var(--color-red)]/30 bg-[var(--color-red-bg)] p-5">
          <p className="font-semibold text-[var(--color-red)]">PERLU PERHATIAN SEGERA</p>
          <p className="mt-1 text-sm text-[var(--color-ink)]/80">
            Jika kondisi terasa berat atau memburuk, segera menuju fasilitas kesehatan terdekat / layanan
            kegawatdaruratan.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button variant="danger" fullWidth icon={<Phone className="h-4 w-4" />}>
              Hubungi Tenaga Kesehatan
            </Button>
            <Button variant="outline" fullWidth icon={<MapPin className="h-4 w-4" />}>
              Informasi Fasilitas Kesehatan
            </Button>
          </div>
          <p className="mt-3 text-xs text-[var(--color-ink)]/60">
            Notifikasi (simulasi prototipe) telah dibuat untuk tenaga kesehatan yang menangani Ibu.
          </p>
        </Card>
      )}

      {isMedium && (
        <Card className="border-[var(--color-amber)]/30 bg-[var(--color-amber-bg)] p-5">
          <Button variant="secondary" fullWidth icon={<Phone className="h-4 w-4" />}>
            Hubungi Tenaga Kesehatan
          </Button>
        </Card>
      )}

      {/* WHAT HAPPENS NEXT — validation status */}
      <Card className="flex items-center gap-3 p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-sage)] text-[var(--color-deep)]">
          <ValidationIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink)]/50">
            Status Validasi
          </p>
          <p className="text-sm font-medium text-[var(--color-ink)]">{validationLabel}</p>
        </div>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link to="/ibu/edukasi" className="flex-1">
          <Button variant="outline" fullWidth icon={<BookOpen className="h-4 w-4" />}>
            Pelajari Tanda/Gejala Terkait
          </Button>
        </Link>
        <Link to="/ibu/riwayat" className="flex-1">
          <Button variant="ghost" fullWidth icon={<HistoryIcon className="h-4 w-4" />}>
            Lihat Hasil &amp; Riwayat
          </Button>
        </Link>
      </div>
    </div>
  );
}
