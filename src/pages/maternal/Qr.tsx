import { useAuth } from '../../context/AuthContext';
import { maternalService } from '../../services/maternalService';
import { screeningService } from '../../services/screeningService';
import { currentRiskFromHistory } from '../../domain/maternalRisk';
import { QRCodeCard } from '../../components/qr/QRCodeCard';
import { Card } from '../../components/ui/Card';
import { Info, ShieldAlert } from 'lucide-react';

export function QrPage() {
  const { user } = useAuth();
  if (!user) return null;
  const mother = maternalService.getByUserId(user.id);
  if (!mother) return null;

  const screenings = screeningService.listByMother(mother.id);
  const risk = currentRiskFromHistory(screenings);
  const isRevoked = mother.qrStatus === 'REVOKED';

  return (
    <div className="mx-auto max-w-sm space-y-5">
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">QR Saya</h1>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          Tempelkan stiker fisik ini pada Buku KIA Ibu.
        </p>
      </div>

      {isRevoked && (
        <Card className="flex items-start gap-2.5 border-[var(--color-red)]/30 bg-[var(--color-red-bg)] p-4 text-sm text-[var(--color-red)]">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            QR ini telah dicabut oleh tenaga kesehatan dan tidak lagi dapat divalidasi. Hubungi tenaga
            kesehatan Ibu untuk menerbitkan kode baru.
          </p>
        </Card>
      )}

      <QRCodeCard
        token={mother.qrToken}
        riskLevel={risk}
        lastScreeningAt={screenings[0]?.createdAt ?? null}
        revoked={isRevoked}
      />

      <Card className="flex items-start gap-2.5 p-4 text-xs text-[var(--color-ink)]/70">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-teal)]" />
        <p>
          Kode ini tidak menyimpan data pribadi Ibu secara langsung. Tenaga kesehatan yang berwenang dapat
          memindai kode ini untuk melihat ringkasan maternal seperlunya.
        </p>
      </Card>
    </div>
  );
}
