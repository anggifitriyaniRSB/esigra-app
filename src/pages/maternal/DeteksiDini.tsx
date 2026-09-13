import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { maternalService } from '../../services/maternalService';
import { screeningService } from '../../services/screeningService';
import { getActiveSymptoms, calculateScore, classifyRisk, SCREENING_CONFIG } from '../../domain/screeningRules';
import { ScreeningStepper } from '../../components/screening/ScreeningStepper';
import { SymptomSelector } from '../../components/screening/SymptomSelector';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { RiskBadge } from '../../components/common/RiskBadge';
import type { VitalSigns } from '../../types/screening';

export function DeteksiDiniPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [mainSymptoms, setMainSymptoms] = useState<string[]>([]);
  const [accompanyingSymptoms, setAccompanyingSymptoms] = useState<string[]>([]);
  const [vitals, setVitals] = useState<VitalSigns>({});
  const [submitting, setSubmitting] = useState(false);
  // Synchronous guard against a double-tap firing handleSubmit twice before
  // the `submitting` state re-render disables the button. React state
  // updates are not synchronous, so a ref is used here in addition to (not
  // instead of) the disabled-button UX below. The service layer also
  // de-duplicates identical rapid resubmissions as a second line of defense.
  const submissionInFlight = useRef(false);

  const activeSymptoms = getActiveSymptoms();
  const mainOptions = activeSymptoms.filter((s) => s.category === 'UTAMA');
  const accompanyingOptions = activeSymptoms.filter((s) => s.category === 'PENYERTA');

  const selectedCodes = useMemo(
    () => [...mainSymptoms, ...accompanyingSymptoms],
    [mainSymptoms, accompanyingSymptoms]
  );
  const previewScore = calculateScore(selectedCodes);
  const previewRisk = classifyRisk(previewScore, selectedCodes);

  if (!user) return null;
  const mother = maternalService.getByUserId(user.id);
  if (!mother) return null;

  const toggleMain = (code: string) =>
    setMainSymptoms((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  const toggleAccompanying = (code: string) =>
    setAccompanyingSymptoms((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));

  const canProceed = step === 1 ? true : true;

  const handleSubmit = () => {
    if (submissionInFlight.current) return;
    submissionInFlight.current = true;
    setSubmitting(true);
    const screening = screeningService.submitScreening({
      motherId: mother.id,
      symptomCodes: selectedCodes,
      vitals,
      actorId: user.id,
      actorRole: user.role,
    });
    setSubmitting(false);
    navigate(`/ibu/hasil/${screening.id}`);
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Deteksi Dini</h1>
        <p className="text-sm text-[var(--color-ink)]/60">
          Skrining ini membantu mengenali tanda yang membutuhkan perhatian lebih lanjut.
        </p>
      </div>

      <ScreeningStepper current={step} />

      {step === 0 && (
        <Card className="space-y-3 p-5">
          <div className="flex items-start gap-2.5 text-sm text-[var(--color-ink)]/80">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-teal)]" />
            <p>
              Deteksi dini ini membantu mengenali tanda yang membutuhkan perhatian lebih lanjut. Jawablah
              dengan jujur sesuai kondisi yang Ibu rasakan saat ini. Hasil skrining bukan diagnosis medis.
            </p>
          </div>
        </Card>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--color-ink)]">Apakah Ibu mengalami gejala berikut?</p>
          <SymptomSelector symptoms={mainOptions} selected={mainSymptoms} onToggle={toggleMain} />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--color-ink)]">
            Apakah ada gejala penyerta lain yang menyertai?
          </p>
          <SymptomSelector
            symptoms={accompanyingOptions}
            selected={accompanyingSymptoms}
            onToggle={toggleAccompanying}
          />
        </div>
      )}

      {step === 3 && (
        <Card className="space-y-4 p-5">
          <p className="text-sm font-medium text-[var(--color-ink)]">Data vital (opsional)</p>
          <VitalField
            label="Tekanan darah sistolik"
            value={vitals.tekananDarahSistolik}
            onChange={(v) => setVitals((p) => ({ ...p, tekananDarahSistolik: v }))}
          />
          <VitalField
            label="Tekanan darah diastolik"
            value={vitals.tekananDarahDiastolik}
            onChange={(v) => setVitals((p) => ({ ...p, tekananDarahDiastolik: v }))}
          />
          <VitalField label="Suhu (°C)" value={vitals.suhu} onChange={(v) => setVitals((p) => ({ ...p, suhu: v }))} />
          <VitalField
            label="Denyut nadi"
            value={vitals.denyutNadi}
            onChange={(v) => setVitals((p) => ({ ...p, denyutNadi: v }))}
          />
        </Card>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-medium text-[var(--color-ink)]">Gejala yang dipilih</p>
            {selectedCodes.length === 0 ? (
              <p className="mt-1 text-sm text-[var(--color-ink)]/60">Tidak ada gejala dipilih</p>
            ) : (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-ink)]/70">
                {selectedCodes.map((code) => (
                  <li key={code}>{SCREENING_CONFIG.symptoms.find((s) => s.code === code)?.label}</li>
                ))}
              </ul>
            )}
          </Card>
          <Card className="flex items-center justify-between p-5">
            <span className="text-sm font-medium text-[var(--color-ink)]">Indikasi awal</span>
            <RiskBadge level={previewRisk} />
          </Card>
          <p className="text-center text-xs text-[var(--color-ink)]/50">
            Indikasi ini akan ditinjau kembali oleh tenaga kesehatan setelah dikirim.
          </p>
          <p className="text-center text-xs text-[var(--color-ink)]/40">
            Prototipe ini menyimpan data pada perangkat ini (tanpa server/backend nyata).
          </p>
        </div>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="ghost" icon={<ChevronLeft className="h-4 w-4" />} onClick={() => setStep((s) => s - 1)}>
            Kembali
          </Button>
        )}
        {step < 4 ? (
          <Button fullWidth disabled={!canProceed} onClick={() => setStep((s) => s + 1)}>
            Lanjut <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button fullWidth disabled={submitting} icon={<Send className="h-4 w-4" />} onClick={handleSubmit}>
            Kirim Deteksi
          </Button>
        )}
      </div>
    </div>
  );
}

function VitalField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">{label}</label>
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        className="w-full rounded-xl border border-[var(--color-sage-line)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-deep)]"
      />
    </div>
  );
}
