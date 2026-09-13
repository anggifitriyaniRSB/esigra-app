import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, ClipboardPlus, QrCode, ShieldOff, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { maternalService } from '../../services/maternalService';
import { screeningService } from '../../services/screeningService';
import { followUpService } from '../../services/followUpService';
import { dentalService } from '../../services/dentalService';
import { auditService } from '../../services/auditService';
import { isAssignedOrAdmin } from '../../services/authorization';
import { currentRiskFromHistory } from '../../domain/maternalRisk';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ScreeningCard } from '../../components/screening/ScreeningCard';
import { FollowUpTimeline } from '../../components/dashboard/FollowUpTimeline';
import { DentalHealthCard } from '../../components/dental/DentalHealthCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Pill } from '../../components/ui/Pill';
import { NotFoundState, UnauthorizedState } from '../../components/ui/States';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { gravidaParaLabel, calculateAge } from '../../utils/pregnancy';
import { SCREENING_CONFIG } from '../../domain/screeningRules';

export function IbuDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [tick, setTick] = useState(0);
  const [confirmValidate, setConfirmValidate] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [action, setAction] = useState('');
  const [notes, setNotes] = useState('');
  const [referral, setReferral] = useState(false);
  const [referralFacility, setReferralFacility] = useState('');

  const mother = id ? maternalService.getById(id) : undefined;

  useEffect(() => {
    if (mother && user) {
      auditService.log({
        actorId: user.id,
        actorRole: user.role,
        action: 'PATIENT_VIEWED',
        resourceType: 'PregnantWoman',
        resourceId: mother.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mother?.id]);

  if (!mother) return <NotFoundState />;
  if (!user) return null;

  // RBAC: a Nakes may only open patients assigned to them; Admin may open any
  // patient as a clinical-governance action. Enforced here, not only by
  // hiding navigation to this page.
  if (!isAssignedOrAdmin(user.role, user.id, mother.assignedHealthcareWorkerId)) {
    return <UnauthorizedState />;
  }

  const gestational = maternalService.gestationalInfo(mother);
  const screenings = screeningService.listByMother(mother.id);
  const latest = screenings[0];
  const risk = currentRiskFromHistory(screenings);
  const followUps = followUpService.listByMother(mother.id);
  const dentalRecords = dentalService.listByMother(mother.id);
  const pendingValidation = latest && latest.validationStatus === 'BELUM_DIVALIDASI';
  const timing = latest ? screeningService.getValidationTiming(latest) : null;

  const handleValidate = () => {
    if (!latest || !user) return;
    screeningService.validate(latest.id, user.id, user.role);
    setConfirmValidate(false);
    setTick((t) => t + 1);
  };

  const handleCreateFollowUp = () => {
    if (!latest || !user) return;
    followUpService.create({
      screeningId: latest.id,
      motherId: mother.id,
      healthcareWorkerId: user.id,
      healthcareWorkerRole: user.role,
      action,
      notes,
      referral,
      referralFacility: referral ? referralFacility : undefined,
    });
    setShowFollowUpForm(false);
    setAction('');
    setNotes('');
    setReferral(false);
    setReferralFacility('');
    setTick((t) => t + 1);
  };

  const handleRevokeQr = () => {
    if (!user) return;
    maternalService.revokeQr(mother.id, user.id, user.role);
    setConfirmRevoke(false);
    setTick((t) => t + 1);
  };

  const handleReissueQr = () => {
    if (!user) return;
    maternalService.reissueQr(mother.id, user.id, user.role);
    setTick((t) => t + 1);
  };

  void tick;

  return (
    <div className="space-y-6">
      <Link to="/nakes/ibu" className="inline-flex items-center gap-1 text-sm text-[var(--color-deep)]">
        <ChevronLeft className="h-4 w-4" /> Data Ibu
      </Link>

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">{mother.name}</h1>
            <p className="mt-1 text-sm text-[var(--color-ink)]/60">
              {gravidaParaLabel(mother.gravida, mother.para)} · {calculateAge(mother.dateOfBirth)} tahun ·{' '}
              {gestational.weeks} minggu (Trimester {gestational.trimester})
            </p>
          </div>
          {risk && <RiskBadge level={risk} size="lg" />}
        </div>
      </Card>

      {latest && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-semibold text-[var(--color-ink)]">Skrining Terakhir</p>
            <StatusBadge status={latest.lifecycleStatus} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-[var(--color-ink)]/50">Gejala</p>
              <p className="text-sm text-[var(--color-ink)]/80">
                {latest.symptomCodes
                  .map((c) => SCREENING_CONFIG.symptoms.find((s) => s.code === c)?.label)
                  .join(', ')}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-ink)]/50">Skor (parameter prototipe)</p>
              <p className="text-sm text-[var(--color-ink)]/80">{latest.score}</p>
            </div>
          </div>
          {latest.suspectConditions.length > 0 && (
            <div className="mt-3 rounded-xl bg-[var(--color-amber-bg)] px-4 py-3 text-xs text-[var(--color-amber)]">
              <p className="font-semibold">Indikasi yang terdeteksi (bukan diagnosis pasti):</p>
              <ul className="mt-1 list-disc pl-4">
                {latest.suspectConditions.map((s, i) => (
                  <li key={i}>
                    {s.label}
                    {s.recommendation && (
                      <span className="block text-[var(--color-ink)]/60">{s.recommendation}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pendingValidation && (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                icon={<CheckCircle2 className="h-4 w-4" />}
                onClick={() => setConfirmValidate(true)}
              >
                Validasi Skrining
              </Button>
              {timing?.overdue && (
                <span className="self-center text-xs font-medium text-[var(--color-red)]">
                  Menunggu validasi — melewati target waktu ({SCREENING_CONFIG.validationWindowHours} jam)
                </span>
              )}
            </div>
          )}

          {!pendingValidation && latest.followUpStatus !== 'AKTIF' && latest.followUpStatus !== 'SELESAI' && (
            <div className="mt-4">
              <Button
                variant="secondary"
                icon={<ClipboardPlus className="h-4 w-4" />}
                onClick={() => setShowFollowUpForm((v) => !v)}
              >
                Buat Tindak Lanjut
              </Button>
            </div>
          )}

          {showFollowUpForm && (
            <div className="mt-4 space-y-3 rounded-xl border border-[var(--color-sage-line)] p-4">
              <input
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="Jenis tindakan"
                className="w-full rounded-xl border border-[var(--color-sage-line)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-deep)]"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan"
                rows={2}
                className="w-full rounded-xl border border-[var(--color-sage-line)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-deep)]"
              />
              <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
                <input type="checkbox" checked={referral} onChange={(e) => setReferral(e.target.checked)} />
                Dirujuk ke fasilitas kesehatan
              </label>
              {referral && (
                <input
                  value={referralFacility}
                  onChange={(e) => setReferralFacility(e.target.value)}
                  placeholder="Tujuan fasilitas kesehatan"
                  className="w-full rounded-xl border border-[var(--color-sage-line)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-deep)]"
                />
              )}
              <Button fullWidth onClick={handleCreateFollowUp} disabled={!action || !notes}>
                Simpan Tindak Lanjut
              </Button>
            </div>
          )}
        </Card>
      )}

      <div>
        <p className="mb-3 font-display text-lg font-semibold text-[var(--color-ink)]">Riwayat Skrining</p>
        <div className="space-y-3">
          {screenings.map((s) => (
            <ScreeningCard key={s.id} screening={s} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 font-display text-lg font-semibold text-[var(--color-ink)]">Tindak Lanjut</p>
        <FollowUpTimeline followUps={followUps} />
      </div>

      {dentalRecords.length > 0 && (
        <div>
          <p className="mb-3 font-display text-lg font-semibold text-[var(--color-ink)]">Kesehatan Gigi</p>
          <div className="space-y-3">
            {dentalRecords.map((d) => (
              <DentalHealthCard key={d.id} record={d} />
            ))}
          </div>
        </div>
      )}

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-semibold text-[var(--color-ink)]">Informasi QR</p>
          <Pill tone={mother.qrStatus === 'ACTIVE' ? 'sage' : 'red'}>
            {mother.qrStatus === 'ACTIVE' ? 'Aktif' : 'Dicabut'}
          </Pill>
        </div>
        <p className="mt-1 font-mono text-sm text-[var(--color-ink)]/70">{mother.qrToken}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {mother.qrStatus === 'ACTIVE' ? (
            <Button size="sm" variant="outline" icon={<ShieldOff className="h-4 w-4" />} onClick={() => setConfirmRevoke(true)}>
              Cabut QR
            </Button>
          ) : (
            <Button size="sm" variant="secondary" icon={<RefreshCw className="h-4 w-4" />} onClick={handleReissueQr}>
              Terbitkan QR Baru
            </Button>
          )}
        </div>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-[var(--color-ink)]/50">
          <QrCode className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Cabut QR jika Buku KIA hilang atau kode dicurigai disalahgunakan. Kode yang dicabut tidak lagi
          dapat divalidasi oleh siapa pun.
        </p>
      </Card>

      <ConfirmDialog
        open={confirmValidate}
        title="Validasi hasil skrining?"
        description="Tindakan ini menandai skrining sebagai telah ditinjau oleh tenaga kesehatan. Keputusan klinis tetap berada pada Anda."
        confirmLabel="Ya, Validasi"
        onConfirm={handleValidate}
        onCancel={() => setConfirmValidate(false)}
      />
      <ConfirmDialog
        open={confirmRevoke}
        title="Cabut QR Ibu ini?"
        description="Kode QR saat ini akan langsung berhenti berfungsi untuk validasi. Gunakan ini jika Buku KIA hilang atau kode dicurigai disalahgunakan."
        confirmLabel="Ya, Cabut QR"
        danger
        onConfirm={handleRevokeQr}
        onCancel={() => setConfirmRevoke(false)}
      />
    </div>
  );
}
