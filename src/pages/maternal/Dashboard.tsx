import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Stethoscope, History, BookOpen, QrCode, ArrowRight, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { maternalService } from '../../services/maternalService';
import { screeningService } from '../../services/screeningService';
import { educationService } from '../../services/educationService';
import { currentRiskFromHistory } from '../../domain/maternalRisk';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RiskBadge } from '../../components/common/RiskBadge';
import { PregnancyProgress } from '../../components/maternal/PregnancyProgress';
import { EducationCard } from '../../components/education/EducationCard';
import { PrototypeNotice } from '../../components/common/Notices';
import { EmptyState } from '../../components/ui/States';
import { gravidaParaLabel, calculateAge } from '../../utils/pregnancy';
import type { RiskLevel } from '../../types/screening';

const STATUS_COPY: Record<RiskLevel, string> = {
  RENDAH: 'Risiko Rendah',
  SEDANG: 'Perlu Perhatian',
  TINGGI: 'Prioritas Evaluasi',
};

export function MotherDashboardPage() {
  const { user } = useAuth();
  if (!user) return null;
  const mother = maternalService.getByUserId(user.id);

  if (!mother) {
    return (
      <EmptyState
        title="Profil maternal belum tersedia."
        description="Silakan hubungi tenaga kesehatan untuk melengkapi profil Anda."
      />
    );
  }

  const gestational = maternalService.gestationalInfo(mother);
  const screenings = screeningService.listByMother(mother.id);
  const latestRisk = currentRiskFromHistory(screenings);
  const latestScreening = screenings[0];
  const educationRecs = educationService.recommendedForTrimester(gestational.trimester).slice(0, 3);

  const nextAction = getNextAction(latestScreening);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[var(--color-ink)]/60">
          {gravidaParaLabel(mother.gravida, mother.para)} · {calculateAge(mother.dateOfBirth)} tahun
        </p>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
          Halo, Ibu {mother.name.split(' ')[0]}
        </h1>
      </div>

      <PrototypeNotice />

      <Card className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink)]/50">Status Kehamilan</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div>
            {latestRisk ? (
              <>
                <p className="text-xs text-[var(--color-ink)]/50">Berdasarkan skrining terakhir:</p>
                <p className="mt-0.5 font-display text-xl font-semibold text-[var(--color-ink)]">
                  {STATUS_COPY[latestRisk]}
                </p>
              </>
            ) : (
              <p className="font-display text-xl font-semibold text-[var(--color-ink)]">Belum ada skrining</p>
            )}
          </div>
          {latestRisk && <RiskBadge level={latestRisk} />}
        </div>
        {latestRisk === 'RENDAH' && (
          <p className="mt-2 text-xs text-[var(--color-ink)]/50">
            Ini bukan jaminan bebas risiko. Tetap lakukan pemeriksaan kehamilan sesuai jadwal.
          </p>
        )}
        <div className="mt-5">
          <PregnancyProgress weeks={gestational.weeks} trimester={gestational.trimester} />
        </div>
      </Card>

      {/* NEXT ACTION — always tells the mother what to do right now */}
      <Card className="flex items-center gap-3 border-[var(--color-teal)]/30 bg-white p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-sage)] text-[var(--color-deep)]">
          <nextAction.icon className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink)]/50">
            Langkah Berikutnya
          </p>
          <p className="text-sm font-medium text-[var(--color-ink)]">{nextAction.message}</p>
        </div>
        {nextAction.cta && (
          <Link to={nextAction.cta.to}>
            <Button size="sm" icon={<ArrowRight className="h-4 w-4" />}>
              {nextAction.cta.label}
            </Button>
          </Link>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction to="/ibu/deteksi-dini" icon={<Stethoscope className="h-5 w-5" />} label="Deteksi Dini" />
        <QuickAction to="/ibu/riwayat" icon={<History className="h-5 w-5" />} label="Hasil & Riwayat" />
        <QuickAction to="/ibu/edukasi" icon={<BookOpen className="h-5 w-5" />} label="Edukasi" />
        <QuickAction to="/ibu/qr" icon={<QrCode className="h-5 w-5" />} label="QR Saya" />
      </div>

      <div>
        <p className="mb-3 font-display text-lg font-semibold text-[var(--color-ink)]">
          Materi yang relevan untuk Ibu saat ini
        </p>
        <div className="space-y-3">
          {educationRecs.map((c) => (
            <EducationCard key={c.id} content={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

function getNextAction(latest: ReturnType<typeof screeningService.listByMother>[number] | undefined): {
  message: string;
  icon: typeof Stethoscope;
  cta?: { to: string; label: string };
} {
  if (!latest) {
    return {
      message: 'Belum melakukan deteksi dini hari ini.',
      icon: Stethoscope,
      cta: { to: '/ibu/deteksi-dini', label: 'Lakukan Deteksi Dini' },
    };
  }
  if (latest.validationStatus === 'BELUM_DIVALIDASI') {
    return { message: 'Menunggu validasi tenaga kesehatan.', icon: Clock };
  }
  if (latest.followUpStatus === 'AKTIF') {
    return {
      message: 'Ikuti tindak lanjut yang diberikan tenaga kesehatan.',
      icon: Activity,
      cta: { to: '/ibu/riwayat', label: 'Lihat Tindak Lanjut' },
    };
  }
  if (latest.followUpStatus === 'DIPERLUKAN') {
    return { message: 'Tindak lanjut diperlukan. Hubungi tenaga kesehatan Ibu.', icon: Activity };
  }
  return {
    message: 'Skrining terakhir sudah ditinjau. Lakukan deteksi dini berkala.',
    icon: CheckCircle2,
    cta: { to: '/ibu/deteksi-dini', label: 'Deteksi Dini Baru' },
  };
}

function QuickAction({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-sage-line)] bg-white/70 px-3 py-4 text-center text-xs font-medium text-[var(--color-ink)]/80 hover:border-[var(--color-teal)]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-sage)] text-[var(--color-deep)]">
        {icon}
      </span>
      {label}
    </Link>
  );
}
