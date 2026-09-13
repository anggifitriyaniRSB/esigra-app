import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw, User, Send, ShieldCheck, ClipboardPlus, CheckCircle2, ScanLine, FileText } from 'lucide-react';
import { demoService, type DemoRecord } from '../../services/demoService';
import { getGuidedStepForState, demoStateIndex } from '../../domain/demo/demoStateMachine';
import { GuidedStepIndicator } from '../../components/demo/GuidedStepIndicator';
import { StickerBridgeDiagram } from '../../components/demo/StickerBridgeDiagram';
import { FeedbackWidget } from '../../components/demo/FeedbackWidget';
import { QRCodeCard } from '../../components/qr/QRCodeCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RiskBadge } from '../../components/common/RiskBadge';
import { SCREENING_CONFIG } from '../../domain/screeningRules';
import { resolveRecommendation } from '../../domain/screeningInterpretation';

export function GuidedDemoPage() {
  const [record, setRecord] = useState<DemoRecord>(() => demoService.getState());
  const [qrScanned, setQrScanned] = useState(false);
  const [clinicalSummaryOpen, setClinicalSummaryOpen] = useState(false);

  const patient = demoService.patient;
  const guidedStep = getGuidedStepForState(record.state);
  const caseIsActive = record.state !== 'DEMO_INITIAL';

  const handlePrimaryAction = () => {
    if (record.state === 'DEMO_INITIAL') {
      setRecord(demoService.runScreening());
    } else {
      setRecord(demoService.advance());
    }
  };

  const handleReset = () => {
    setRecord(demoService.reset());
    setQrScanned(false);
    setClinicalSummaryOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Demo Terpandu</h1>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-ink)]/50 hover:text-[var(--color-ink)]"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Demo
        </button>
      </div>

      <GuidedStepIndicator current={record.state} />

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-sage)] text-[var(--color-deep)]">
            <User className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium text-[var(--color-ink)]">{patient.name}</p>
            <p className="text-xs text-[var(--color-ink)]/50">
              {patient.age} tahun · {patient.gestationalWeeks} minggu ({patient.gravidaPara}) · {patient.location}
            </p>
          </div>
        </div>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-[var(--color-red)]">
          DEMO DATA — bukan data pasien nyata
        </p>
      </Card>

      {/* State-driven panel */}
      {record.state === 'DEMO_INITIAL' && (
        <Card className="p-6 text-center">
          <p className="font-display text-lg font-semibold text-[var(--color-ink)]">Langkah 1 — Deteksi Dini</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-ink)]/70">
            {patient.name} melaporkan kombinasi gejala utama: bengkak wajah/tangan, sakit kepala berat, dan
            penglihatan kabur. e-SIGRA tidak hanya membaca satu gejala — sistem mengolah kombinasi gejala
            untuk membantu menentukan prioritas evaluasi.
          </p>
          <Button className="mt-5" icon={<ArrowRight className="h-4 w-4" />} onClick={handlePrimaryAction}>
            Jalankan Deteksi Dini (Demo)
          </Button>
        </Card>
      )}

      {record.state === 'SCREENING_COMPLETED' && (
        <ResultPanel record={record} onNext={handlePrimaryAction} nextLabel="Lanjutkan: Kirim Indikasi Risiko" />
      )}

      {record.state === 'HIGH_PRIORITY_DETECTED' && (
        <ResultPanel record={record} onNext={handlePrimaryAction} nextLabel="Lanjutkan: Edukasi & Notifikasi Nakes" showExplanation />
      )}

      {record.state === 'NAKES_NOTIFIED' && (
        <Card className="p-6">
          <p className="font-display text-lg font-semibold text-[var(--color-ink)]">Simulasi Notifikasi Nakes</p>
          <p className="mt-2 text-sm text-[var(--color-ink)]/70">
            "Simulasi notifikasi Nakes" — dalam implementasi nyata, ini akan diteruskan ke perangkat tenaga
            kesehatan yang menangani {patient.name}.
          </p>
          <div className="mt-3 rounded-xl bg-[var(--color-amber-bg)] px-4 py-3 text-sm text-[var(--color-amber)]">
            "{patient.name} melaporkan hasil skrining dengan risiko tinggi." — Bidan Demo
          </div>
          <Button className="mt-4" icon={<Send className="h-4 w-4" />} onClick={handlePrimaryAction}>
            Lihat Dashboard Prioritas Nakes
          </Button>
        </Card>
      )}

      {record.state === 'VALIDATION_PENDING' && (
        <Card className="p-6">
          <p className="font-display text-lg font-semibold text-[var(--color-ink)]">Antrean Prioritas Nakes</p>
          <div className="mt-3 rounded-xl border border-[var(--color-red)]/30 bg-[var(--color-red-bg)] p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[var(--color-red)]">PRIORITAS 01</p>
              <RiskBadge level="TINGGI" size="sm" />
            </div>
            <p className="mt-1 font-medium text-[var(--color-ink)]">{patient.name}</p>
            <p className="text-xs text-[var(--color-ink)]/60">
              {patient.gestationalWeeks} minggu · Menunggu validasi
            </p>
          </div>
          <Button className="mt-4" icon={<ShieldCheck className="h-4 w-4" />} onClick={handlePrimaryAction}>
            Validasi Sekarang (Nakes)
          </Button>
        </Card>
      )}

      {record.state === 'VALIDATED' && (
        <Card className="p-6">
          <p className="font-display text-lg font-semibold text-[var(--color-ink)]">Validasi dan Penetapan Tindak Lanjut</p>
          <p className="mt-2 text-sm text-[var(--color-ink)]/70">
            Nakes telah meninjau temuan skrining {patient.name} dan menandainya sebagai tervalidasi. Ini
            adalah validasi dan penetapan tindak lanjut oleh tenaga kesehatan — bukan konfirmasi diagnosis.
          </p>
          <Button className="mt-4" icon={<ClipboardPlus className="h-4 w-4" />} onClick={handlePrimaryAction}>
            Buat Tindak Lanjut
          </Button>
        </Card>
      )}

      {record.state === 'FOLLOW_UP_ACTIVE' && (
        <Card className="p-6">
          <p className="font-display text-lg font-semibold text-[var(--color-ink)]">Tindak Lanjut Aktif</p>
          <p className="mt-2 text-sm text-[var(--color-ink)]/70">
            Rujukan evaluasi lanjutan dicatat untuk {patient.name}. Status kasus kini AKTIF dan dipantau
            hingga selesai.
          </p>
          <Button className="mt-4" icon={<CheckCircle2 className="h-4 w-4" />} onClick={handlePrimaryAction}>
            Tandai Tindak Lanjut Selesai
          </Button>
        </Card>
      )}

      {record.state === 'FOLLOW_UP_COMPLETED' && (
        <Card className="p-6 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-[var(--color-teal)]" />
          <p className="mt-2 font-display text-lg font-semibold text-[var(--color-ink)]">Lingkar Tertutup</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-ink)]/70">
            Tindak lanjut untuk {patient.name} tercatat selesai dan kasus masuk riwayat pemantauan
            berkelanjutan — dari deteksi hingga penanganan, seluruhnya tercatat dan tertelusuri.
          </p>
          <Link
            to="/demo/impact"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--color-deep)] px-5 py-2.5 text-sm font-medium text-white"
          >
            Lihat Dampak &amp; Kesiapan Pilot <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      )}

      {/* Digital danger-sign sticker + QR demonstration (spec sections 8-9) —
          shown once a case exists, since this is the physical-to-digital
          bridge a Nakes would use in the field. */}
      {caseIsActive && (
        <Card className="p-5">
          <p className="font-display text-lg font-semibold text-[var(--color-ink)]">
            Jembatan Fisik–Digital: Stiker &amp; QR
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">
            Stiker tanda bahaya fisik pada Buku KIA terhubung ke ringkasan maternal digital lewat token QR
            opaque — tanpa data pribadi tersimpan langsung di dalam kode.
          </p>
          <div className="mt-4">
            <StickerBridgeDiagram />
          </div>

          {!qrScanned ? (
            <Button className="mt-4" variant="secondary" icon={<ScanLine className="h-4 w-4" />} onClick={() => setQrScanned(true)}>
              Simulasikan Scan QR (Nakes)
            </Button>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <QRCodeCard
                token={patient.qrToken}
                riskLevel={record.riskLevel}
                lastScreeningAt={record.screeningCreatedAt}
              />
              <div className="rounded-2xl border border-[var(--color-sage-line)] bg-white/70 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink)]/50">
                  Ringkasan Minimal (Hasil Scan)
                </p>
                <dl className="mt-2 space-y-1.5 text-sm">
                  <Row label="Nama" value={patient.name} />
                  <Row label="Usia Kehamilan" value={`${patient.gestationalWeeks} minggu`} />
                  <Row label="Status Skrining" value={record.riskLevel === 'RENDAH' ? 'Rendah' : record.riskLevel === 'SEDANG' ? 'Perlu Perhatian' : 'Prioritas Evaluasi'} />
                  <Row label="Prioritas" value={demoStateIndex(record.state) >= 4 ? 'Tervalidasi' : 'Menunggu validasi'} />
                  <Row label="Skrining Terakhir" value={record.screeningCreatedAt ? new Date(record.screeningCreatedAt).toLocaleString('id-ID') : '-'} />
                </dl>
                <Button
                  className="mt-3"
                  size="sm"
                  variant="outline"
                  icon={<FileText className="h-4 w-4" />}
                  onClick={() => setClinicalSummaryOpen((v) => !v)}
                >
                  {clinicalSummaryOpen ? 'Tutup Ringkasan Klinis' : 'Buka Ringkasan Klinis'}
                </Button>
                {clinicalSummaryOpen && (
                  <p className="mt-2 text-xs text-[var(--color-ink)]/60">
                    Ringkasan klinis lengkap (riwayat skrining, catatan tindak lanjut) hanya terbuka bagi
                    Nakes yang berwenang dan tercatat pada audit log — lihat halaman Detail Ibu pada
                    aplikasi utama untuk versi lengkapnya.
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {guidedStep && (
        <Card className="grid gap-4 p-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">Apa yang terjadi?</p>
            <p className="mt-1 text-sm text-[var(--color-ink)]/70">{guidedStep.whatHappened}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">Mengapa penting?</p>
            <p className="mt-1 text-sm text-[var(--color-ink)]/70">{guidedStep.whyItMatters}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">Selanjutnya?</p>
            <p className="mt-1 text-sm text-[var(--color-ink)]/70">{guidedStep.whatHappensNext}</p>
          </div>
        </Card>
      )}

      {record.state === 'FOLLOW_UP_COMPLETED' && <FeedbackWidget />}
    </div>
  );
}

function ResultPanel({
  record,
  onNext,
  nextLabel,
  showExplanation,
}: {
  record: DemoRecord;
  onNext: () => void;
  nextLabel: string;
  showExplanation?: boolean;
}) {
  const recommendation = resolveRecommendation(record.riskLevel);
  return (
    <Card className="p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink)]/50">Hasil Skrining</p>
      <div className="mt-2 flex items-center gap-3">
        <RiskBadge level={record.riskLevel} size="lg" />
        <p className="font-display text-lg font-semibold text-[var(--color-ink)]">{recommendation.headline}</p>
      </div>
      {record.suspectConditions.length > 0 && (
        <div className="mt-3 rounded-xl bg-[var(--color-amber-bg)] px-4 py-3 text-sm text-[var(--color-amber)]">
          <p className="font-semibold">Indikasi yang terdeteksi (bukan diagnosis pasti):</p>
          <ul className="mt-1 list-disc pl-4">
            {record.suspectConditions.map((s, i) => (
              <li key={i}>{s.label}</li>
            ))}
          </ul>
        </div>
      )}
      {showExplanation && (
        <p className="mt-3 text-sm text-[var(--color-ink)]/70">{recommendation.interpretation}</p>
      )}
      {SCREENING_CONFIG.showScoreToPatient && (
        <p className="mt-2 text-xs text-[var(--color-ink)]/40">Skor skrining: {record.score}</p>
      )}
      <Button className="mt-4" icon={<ArrowRight className="h-4 w-4" />} onClick={onNext}>
        {nextLabel}
      </Button>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-[var(--color-ink)]/50">{label}</dt>
      <dd className="text-xs font-medium text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}
