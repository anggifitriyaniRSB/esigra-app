import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppShell } from './components/common/AppShell';
import { IBU_NAV, IBU_BOTTOM_NAV, NAKES_NAV, ADMIN_NAV } from './components/common/navConfig';

import { LandingPage } from './pages/Landing';
import { LoginPage } from './pages/auth/Login';
import { RegisterPage } from './pages/auth/Register';

import { MotherDashboardPage } from './pages/maternal/Dashboard';
import { DeteksiDiniPage } from './pages/maternal/DeteksiDini';
import { HasilPage } from './pages/maternal/Hasil';
import { RiwayatPage } from './pages/maternal/Riwayat';
import { EdukasiPage } from './pages/maternal/Edukasi';
import { EdukasiDetailPage } from './pages/maternal/EdukasiDetail';
import { GigiPage } from './pages/maternal/Gigi';
import { QrPage } from './pages/maternal/Qr';
import { ProfilPage } from './pages/maternal/Profil';

import { NakesDashboardPage } from './pages/nakes/Dashboard';
import { PrioritasPage } from './pages/nakes/Prioritas';
import { SemuaIbuPage } from './pages/nakes/SemuaIbu';
import { IbuDetailPage } from './pages/nakes/IbuDetail';
import { TindakLanjutPage } from './pages/nakes/TindakLanjut';
import { ScanPage } from './pages/nakes/Scan';
import { NakesEdukasiPage } from './pages/nakes/NakesEdukasi';
import { NakesGigiPage } from './pages/nakes/NakesGigi';
import { NakesDeteksiPage } from './pages/nakes/NakesDeteksi';
import { LaporanPage } from './pages/nakes/Laporan';

import { AdminDashboardPage } from './pages/admin/Dashboard';
import { AdminUsersPage } from './pages/admin/Users';
import { AdminNakesPage } from './pages/admin/Nakes';
import { ScreeningRulesPage } from './pages/admin/ScreeningRules';
import { AdminEducationPage } from './pages/admin/Education';
import { AuditLogPage } from './pages/admin/AuditLog';
import { SettingsPage } from './pages/admin/Settings';

import { DemoLayout } from './components/demo/DemoLayout';
import { DemoHome } from './pages/demo/DemoHome';
import { GuidedDemoPage } from './pages/demo/GuidedDemo';
import { DemoImpactPage } from './pages/demo/DemoImpact';
import { DemoInnovationPage } from './pages/demo/DemoInnovation';
import { DemoBeforeAfterPage } from './pages/demo/DemoBeforeAfter';
import { DemoPilotReadinessPage } from './pages/demo/DemoPilotReadiness';
import { DemoStakeholderPage } from './pages/demo/DemoStakeholder';

function IbuLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell nav={IBU_NAV} bottomNav={IBU_BOTTOM_NAV} brandSubtitle="Calm Maternal Companion">
      {children}
    </AppShell>
  );
}

function NakesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell nav={NAKES_NAV} brandSubtitle="Maternal Safety Command Center">
      {children}
    </AppShell>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell nav={ADMIN_NAV} brandSubtitle="Panel Administrasi">
      {children}
    </AppShell>
  );
}

/** Sends a logged-in user to their role's home; otherwise to the landing page. */
function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <LandingPage />;
  if (user.role === 'IBU_HAMIL') return <Navigate to="/ibu" replace />;
  if (user.role === 'NAKES') return <Navigate to="/nakes" replace />;
  return <Navigate to="/admin" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* IBU HAMIL */}
      <Route
        path="/ibu"
        element={
          <ProtectedRoute allow={['IBU_HAMIL']}>
            <IbuLayout>
              <MotherDashboardPage />
            </IbuLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ibu/deteksi-dini"
        element={
          <ProtectedRoute allow={['IBU_HAMIL']}>
            <IbuLayout>
              <DeteksiDiniPage />
            </IbuLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ibu/hasil/:id"
        element={
          <ProtectedRoute allow={['IBU_HAMIL']}>
            <IbuLayout>
              <HasilPage />
            </IbuLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ibu/riwayat"
        element={
          <ProtectedRoute allow={['IBU_HAMIL']}>
            <IbuLayout>
              <RiwayatPage />
            </IbuLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ibu/edukasi"
        element={
          <ProtectedRoute allow={['IBU_HAMIL']}>
            <IbuLayout>
              <EdukasiPage />
            </IbuLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ibu/edukasi/:id"
        element={
          <ProtectedRoute allow={['IBU_HAMIL']}>
            <IbuLayout>
              <EdukasiDetailPage backTo="/ibu/edukasi" />
            </IbuLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ibu/gigi"
        element={
          <ProtectedRoute allow={['IBU_HAMIL']}>
            <IbuLayout>
              <GigiPage />
            </IbuLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ibu/qr"
        element={
          <ProtectedRoute allow={['IBU_HAMIL']}>
            <IbuLayout>
              <QrPage />
            </IbuLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ibu/profil"
        element={
          <ProtectedRoute allow={['IBU_HAMIL']}>
            <IbuLayout>
              <ProfilPage />
            </IbuLayout>
          </ProtectedRoute>
        }
      />

      {/* NAKES */}
      <Route
        path="/nakes"
        element={
          <ProtectedRoute allow={['NAKES']}>
            <NakesLayout>
              <NakesDashboardPage />
            </NakesLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nakes/prioritas"
        element={
          <ProtectedRoute allow={['NAKES']}>
            <NakesLayout>
              <PrioritasPage />
            </NakesLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nakes/ibu"
        element={
          <ProtectedRoute allow={['NAKES']}>
            <NakesLayout>
              <SemuaIbuPage />
            </NakesLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nakes/ibu/:id"
        element={
          <ProtectedRoute allow={['NAKES']}>
            <NakesLayout>
              <IbuDetailPage />
            </NakesLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nakes/tindak-lanjut"
        element={
          <ProtectedRoute allow={['NAKES']}>
            <NakesLayout>
              <TindakLanjutPage />
            </NakesLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nakes/scan"
        element={
          <ProtectedRoute allow={['NAKES']}>
            <NakesLayout>
              <ScanPage />
            </NakesLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nakes/gigi"
        element={
          <ProtectedRoute allow={['NAKES']}>
            <NakesLayout>
              <NakesGigiPage />
            </NakesLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nakes/deteksi"
        element={
          <ProtectedRoute allow={['NAKES']}>
            <NakesLayout>
              <NakesDeteksiPage />
            </NakesLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nakes/edukasi"
        element={
          <ProtectedRoute allow={['NAKES']}>
            <NakesLayout>
              <NakesEdukasiPage />
            </NakesLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nakes/edukasi/:id"
        element={
          <ProtectedRoute allow={['NAKES']}>
            <NakesLayout>
              <EdukasiDetailPage backTo="/nakes/edukasi" />
            </NakesLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nakes/laporan"
        element={
          <ProtectedRoute allow={['NAKES']}>
            <NakesLayout>
              <LaporanPage />
            </NakesLayout>
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allow={['ADMIN']}>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allow={['ADMIN']}>
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/nakes"
        element={
          <ProtectedRoute allow={['ADMIN']}>
            <AdminLayout>
              <AdminNakesPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/screening-rules"
        element={
          <ProtectedRoute allow={['ADMIN']}>
            <AdminLayout>
              <ScreeningRulesPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education"
        element={
          <ProtectedRoute allow={['ADMIN']}>
            <AdminLayout>
              <AdminEducationPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-log"
        element={
          <ProtectedRoute allow={['ADMIN']}>
            <AdminLayout>
              <AuditLogPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allow={['ADMIN']}>
            <AdminLayout>
              <SettingsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Demo layer — public, no auth required, for grant/stakeholder review */}
      <Route path="/demo" element={<DemoLayout><DemoHome /></DemoLayout>} />
      <Route path="/demo/guided" element={<DemoLayout><GuidedDemoPage /></DemoLayout>} />
      <Route path="/demo/impact" element={<DemoLayout><DemoImpactPage /></DemoLayout>} />
      <Route path="/demo/innovation" element={<DemoLayout><DemoInnovationPage /></DemoLayout>} />
      <Route path="/demo/before-after" element={<DemoLayout><DemoBeforeAfterPage /></DemoLayout>} />
      <Route path="/demo/pilot-readiness" element={<DemoLayout><DemoPilotReadinessPage /></DemoLayout>} />
      <Route path="/demo/stakeholder" element={<DemoLayout><DemoStakeholderPage /></DemoLayout>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
