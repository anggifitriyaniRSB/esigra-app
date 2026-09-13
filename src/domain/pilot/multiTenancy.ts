/**
 * Future multi-tenancy shape (CONCEPTUAL — not wired into the running
 * application). Today, e-SIGRA has a single implicit "organization" and a
 * single "site" (the mock data set). This file exists so a future backend
 * migration has a concrete target shape to grow into: Organization → Site
 * → User/Role → Patient, so multiple pilot sites (e.g. Malang, Medan,
 * Vietnam) can share one deployment instead of one deployment per site.
 *
 * None of these interfaces are used by services/repository.ts today —
 * introducing them for real would mean adding `organizationId`/`siteId`
 * fields throughout the existing data model and repositories, which is
 * intentionally out of scope for this prototype (see PILOT_READINESS_ROADMAP
 * Phase 3/4 in pilotConfig.ts).
 */

export interface Organization {
  id: string;
  name: string;
  country: string;
}

export interface Site {
  id: string;
  organizationId: string;
  name: string;
  location: string;
  pilotConfigId: string; // references a PilotConfig.pilotId
}

export interface TenantScopedUser {
  userId: string;
  siteId: string;
  role: 'IBU_HAMIL' | 'NAKES' | 'ADMIN' | 'SITE_COORDINATOR';
}

export interface TenantScopedPatient {
  patientRecordId: string; // maps to PregnantWoman.id today
  siteId: string;
  organizationId: string;
}
