# e-SIGRA

**Pelengkap Visual dan Skrining Terintegrasi Maternal**
*Digital Maternal Early Detection, Education & Risk Monitoring System — prototype*

This is a frontend prototype built with React 19, TypeScript, Vite, Tailwind CSS v4, React Router,
React Hook Form + Zod, and Recharts. Data is persisted to the browser's `localStorage` through a
repository abstraction (`src/services/repository.ts`) so a future backend (REST / GraphQL / Supabase /
FHIR-compatible) can be swapped in without touching the UI.

> e-SIGRA adalah alat bantu skrining dan pemantauan awal. Hasil skrining bukan diagnosis medis dan
> tidak menggantikan pemeriksaan tenaga kesehatan. Keputusan klinis tetap berada pada tenaga kesehatan
> yang berwenang.

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run typecheck  # tsc --noEmit
npm run build      # type-check + production build
npm run test       # run the unit/integration test suite (vitest)
npm run lint       # oxlint
npm run preview    # serve the production build locally
```

## Demo accounts (development only)

| Peran      | Email                     | Kata sandi |
|------------|---------------------------|------------|
| Ibu Hamil  | demo.ibu@esigra.test      | Demo123!   |
| Nakes      | demo.nakes@esigra.test    | Demo123!   |
| Admin      | demo.admin@esigra.test    | Demo123!   |

The login screen has tappable buttons that fill these in for you.

## Suggested demo flow

1. Log in as **Ibu Hamil** -> view the maternal dashboard -> **Deteksi Dini** -> select symptoms such as
   *Sakit kepala berat*, *Penglihatan kabur*, *Bengkak wajah/tangan* -> submit -> observe the **TINGGI**
   (high-priority) result with the "Preeklamsia Berat / Suspect" indication and the emergency safety card.
2. Log out, log in as **Nakes** -> the dashboard KPI cards and priority queue immediately show the new
   high-priority patient -> open her detail page -> **Validasi Skrining** -> **Buat Tindak Lanjut** (e.g.
   a referral) -> the mother's follow-up status becomes **AKTIF**.
3. Try **Scan QR** with one of the seeded tokens (e.g. `ESG-7F8K2P9Q`) to see the minimum-necessary
   maternal summary resolve from an opaque token — no PHI is ever encoded in the QR itself.
4. Log out, log in as **Admin** -> **Aturan Skrining** to see the versioned, read-only scoring
   configuration and combination-symptom rules, and **Audit Log** to see every action above recorded.

## Architecture

```
UI (pages/components) -> services/*.ts -> domain/*.ts (rules) -> services/repository.ts (storage)
```

- `src/domain/screeningRules.ts` — `SCREENING_CONFIG`: the single source of truth for symptom scores,
  RENDAH/SEDANG/TINGGI thresholds, and the suspect-combination engine. Editable in one place, versioned,
  and change-logged to the audit trail rather than hard-coded into UI components.
- `src/services/*.ts` — the only layer the UI talks to; each wraps a `LocalStorageRepository<T>` today
  and could wrap an `ApiRepository<T>` tomorrow with no UI changes.
- `src/tests/*.test.ts` — unit tests for the scoring/classification/combination engine, dental scoring,
  gestational-age calculation, and a full end-to-end integration test that walks the entire demo flow
  (login -> screen -> alert -> validate -> follow-up -> complete) through the service layer.

## Security & Clinical Safety Audit

This section is an honest internal audit, not a marketing claim. It documents what was checked, what was
found, what was fixed, and — just as importantly — what is still a known gap and why.

**Architecture map verified:** `UI (pages/components) → services/*.ts → domain/*.ts → services/repository.ts
(LocalStorageRepository) → [future backend]`. No screening-clinical logic was found embedded directly in a
UI component after this audit (see the extraction of `screeningInterpretation.ts` below); `SCREENING_CONFIG`
in `domain/screeningRules.ts` remains the single source of truth for scoring.

### Findings fixed in this pass

1. **False reassurance (real bug, fixed).** `perdarahan_vagina` reported alone scored 10 — below the
   SEDANG threshold of 15 — and classified as RENDAH ("no indication found"), which is a genuine false-
   reassurance failure for a symptom that should never be diluted by additive scoring. Fixed with a
   `criticalIndicators` override in `SCREENING_CONFIG`: any symptom on that list now forces a minimum
   SEDANG result even when reported alone. Explicitly marked "Requires clinical governance" — this is a
   prototype safety net, not a clinically validated rule. Covered by `tests/security.test.ts` Case E.
2. **IDOR on `/ibu/hasil/:id` (real vulnerability, fixed).** The result page had no ownership check —
   editing the URL's screening id let one mother view another mother's result. Fixed with a new
   `screeningService.getByIdForActor()` that enforces ownership (Ibu Hamil) or assignment (Nakes/Admin),
   wired into the page (shows an explicit unauthorized state) and covered by Case F.
3. **No service-layer RBAC (real gap, fixed for the highest-risk paths).** `validate()`,
   `followUpService.create/complete`, and `qrService.resolveToken` performed their actions for *any*
   caller regardless of role — only UI buttons were hidden per role. Added `services/authorization.ts`
   (explicit permission matrix + `can()` / `isAssignedOrAdmin()`) and wired it into all four methods, plus
   an assignment check on the Nakes patient-detail page. Covered by dedicated permission-denial tests.
4. **QR had no revocation path (real gap, fixed).** Added `qrStatus: ACTIVE | REVOKED` to the maternal
   record, `revokeQr` / `reissueQr` service methods (permission-gated, audited), and unified messaging:
   an invalid token and a revoked token both resolve to `null` with the identical caller-facing message
   ("QR tidak dapat divalidasi."), so revocation doesn't leak "this token used to exist." The mother-facing
   QR page now visually and textually reflects a revoked state instead of silently showing a dead sticker.
5. **Invalid state transitions were unguarded (fixed).** Re-validating an already-validated screening, or
   re-completing an already-completed follow-up, are now idempotent no-ops rather than silent re-writes.
6. **Duplicate submission (fixed, defense in depth).** A synchronous ref guard on the submit button plus a
   5-second identical-payload de-duplication window in `screeningService.submitScreening` — a real backend
   would use a proper idempotency key instead of this client-side heuristic.
7. **Hard-coded clinical copy inside a UI component (fixed).** `RiskResultCard.tsx` previously contained
   the interpretation/recommendation text as literals. Extracted into `domain/screeningInterpretation.ts`
   (a `resolveRecommendation()` resolver) so the component only renders domain output.
8. **Audit trail gaps (fixed).** `logout()` and `registerMother()` performed no audit logging despite the
   `LOGIN`/`USER_CREATED` concepts existing. Both now log. Added a `result: SUCCESS | DENIED` field so
   *denied* attempts are traceable, not only successful ones — every new authorization check above logs on
   denial too.
9. **Governance metadata added.** `SCREENING_CONFIG.clinicalValidationStatus = "PROTOTYPE — NOT CLINICALLY
   VALIDATED"`, `approvalStatus = "DRAFT"`, `sourceVersion`, and a `governanceRoadmap` (Clinical Validation
   → Pilot Testing → Safety Review → Regulatory Review → Production Approval) are now rendered on
   `/admin/screening-rules`, alongside per-combination-rule metadata (id, severity, message, recommendation,
   validation status, source version).
10. **False-reassurance copy removed.** The dashboard's low-risk label dropped its "Aman /" prefix; an
    explicit "this is not a guarantee of health" line was added next to any RENDAH status.

### Verified clean on inspection (no changes needed)

- No medication/dosage/prescription content anywhere in the codebase (`grep`-verified).
- No `dangerouslySetInnerHTML` or raw HTML rendering anywhere; all user-facing text is rendered through
  React's default escaping.
- No hard-coded diagnostic-certainty language ("Anda mengalami...", "Anda pasti...") anywhere.
- QR tokens are opaque, non-sequential, resolved server-side (conceptually) with no PHI encoded directly.

### Known gaps — not fixed, documented honestly

- **RBAC is enforced in the browser only.** Because this prototype has no real backend, every check above
  (including the new ones) runs in client-side JavaScript and is bypassable by a user manipulating their
  own client state. This is unavoidable without a real server and is called out explicitly rather than
  glossed over — production must re-implement this exact permission matrix server-side.
- **"Assigned patients only" is not yet enforced on list views.** The Nakes dashboard, priority queue, and
  screening log currently show *all* mothers/screenings, not filtered to the logged-in Nakes's assigned
  patients — only the *detail* page and the *action* methods (validate/follow-up) enforce assignment. In
  the current single-Nakes demo dataset this has no visible effect, but it is a real architectural gap that
  should be closed before adding a second Nakes account.
- **Free-text fields (follow-up notes, dental notes) are not passed through Zod schemas.** They are safe
  from injection because React escapes all rendered text by default, but they are not currently
  length-limited or pattern-validated at the service boundary.
- **Authentication remains mock/local**, as already documented below — this was audited again and the
  conclusion is unchanged: never use as-is in production.
- **No token expiration or rate limiting** on QR resolution — only revocation. Production requires both.
- **Retention policy is undefined.** No data-retention period is claimed or implemented; this is explicitly
  left as `"TO BE DETERMINED BY GOVERNANCE"` rather than inventing a number.

### Regulatory & compliance position

e-SIGRA is **designed with privacy and healthcare-data-governance principles in mind** (data minimization,
opaque QR tokens, RBAC, audit logging, masked PHI on shared views) but has **not** undergone legal or
regulatory verification. No claim of compliance with Indonesian healthcare, privacy, or electronic-system
regulations is made. Regulatory validation is required before any production deployment. FHIR-style mapping
(`PregnantWoman → Patient`, `Screening → Observation`, `SuspectMatch → Condition`, `FollowUp → CarePlan`,
`Nakes → Practitioner`) is a plausible future interoperability path, not an implemented integration.

### Test coverage added this pass

`src/tests/security.test.ts` — 13 new tests covering Cases A (low risk), B (medium risk), C (high risk),
D (suspect combination), E (false reassurance / critical override), F + F2 (unauthorized access / IDOR /
unassigned Nakes), G + G2 (invalid QR token / wrong-role QR scan), H (revoked QR), I (duplicate
submission), J (invalid follow-up transition), plus a permission-denial test for `validate()`. Combined
with the pre-existing suites, **36/36 tests pass**, `tsc --noEmit` is clean, `oxlint` reports zero errors,
and `vite build` succeeds.

## Grant / Pilot Demo Layer

A dedicated `/demo` experience was added on top of the existing e-SIGRA application for grant review,
stakeholder evaluation, and pilot-readiness demonstration. It is entirely additive: nothing in the regular
`/ibu`, `/nakes`, or `/admin` app was changed to build it, and the demo never reads or writes the regular
app's data.

### A. Demo architecture

```
/demo/*  (public, no login required)
  DemoLayout          — persistent "DEMO ENVIRONMENT" banner, nav, Reset Demo, Presentation Mode toggle
    ↓
  demoService.ts       — isolated localStorage namespace (esigra:demo:v1:*), separate from the real app
    ↓
  domain/demo/*         — deterministic state machine + fixed fictional patient data
    ↓
  domain/screeningRules.ts — the SAME real scoring/combination engine the rest of the app uses
```

The guided demo intentionally runs the **real** `calculateScore` / `classifyRisk` / `detectSuspectConditions`
functions from `domain/screeningRules.ts` on a fixed symptom set — the risk indication shown in the demo is
not a hard-coded fake number, it is the actual algorithm's output for a controlled input. This was a
deliberate choice: it's honest ("the demo shows what the real engine does"), and it's covered by
`demo.test.ts`.

### B. Demo flow

`/demo` → `/demo/guided` walks through the 7 canonical steps (spec section 4) as one continuous state
machine (`DEMO_INITIAL → SCREENING_COMPLETED → HIGH_PRIORITY_DETECTED → NAKES_NOTIFIED →
VALIDATION_PENDING → VALIDATED → FOLLOW_UP_ACTIVE → FOLLOW_UP_COMPLETED`), never randomized, always
resettable via "Reset Demo." Each step shows **What happened / Why it matters / What happens next**. From
there, `/demo/impact`, `/demo/innovation`, `/demo/before-after`, `/demo/pilot-readiness`, and
`/demo/stakeholder` are reachable both from the guided flow's end screen and from the always-visible demo
nav, for a reviewer who wants to jump straight to a specific question.

**Design choice, stated honestly:** rather than building "Demo Patient / Demo Screening / Demo Result /
Demo Nakes Dashboard / Demo Validation / Demo Follow-up" as seven separate, disconnected pages, they were
implemented as **one continuous guided sequence** (`/demo/guided`) that shows all of that content in order.
This was chosen because the spec's own objective is a reviewer understanding the product in 3–5 minutes —
seven separate pages a reviewer has to navigate between works against that goal. Impact, Innovation,
Before/After, Pilot Readiness, and Stakeholder Overview remain as distinct pages because they are reference
material a reviewer or stakeholder returns to, not sequential story beats.

### C. Files created

- `src/domain/demo/demoData.ts`, `demoStateMachine.ts`
- `src/services/demoService.ts`
- `src/components/demo/DemoLayout.tsx`, `ClosedLoopDiagram.tsx`, `StickerBridgeDiagram.tsx`,
  `GuidedStepIndicator.tsx`, `FeedbackWidget.tsx`
- `src/pages/demo/DemoHome.tsx`, `GuidedDemo.tsx`, `DemoImpact.tsx`, `DemoInnovation.tsx`,
  `DemoBeforeAfter.tsx`, `DemoPilotReadiness.tsx`, `DemoStakeholder.tsx`
- `src/domain/pilot/pilotConfig.ts`, `localization.ts`, `multiTenancy.ts`, `researchMode.ts`
- `src/tests/demo.test.ts`

### D. Files modified

- `src/App.tsx` — added public `/demo/*` routes (deliberately outside any `ProtectedRoute`, since grant
  reviewers should not need a login)
- `src/pages/Landing.tsx` — added a small, secondary "Peninjau/mitra hibah? Lihat Demo Terpandu" link

### E. New demo functionality

Guided 7-step patient journey · fixed fictional demo patient (Siti Rahmawati, clearly labeled "DEMO DATA —
BUKAN DATA PASIEN NYATA" everywhere) · closed-loop circular diagram (DETECT → EDUCATE → ALERT → VALIDATE →
FOLLOW UP → MONITOR ↺) · interactive KIA-book-to-QR-to-e-SIGRA bridge demonstration (sticker diagram +
"Simulasikan Scan QR" button that renders the real `QRCodeCard` and a minimum-necessary patient summary) ·
Reset Demo (deterministic, always returns to `DEMO_INITIAL`) · Presentation Mode (hides chrome, enlarges
content) · post-flow feedback micro-survey, explicitly labeled as feedback collection, not usability proof.

### F. Pilot-readiness features

`PILOT_CONFIG` interface + three fictional entries (`PILOT_MALANG`, `PILOT_MEDAN`, `PILOT_VIETNAM`) in
`domain/pilot/pilotConfig.ts`, each carrying location, language, health-worker roles, screening/education
content versions, referral workflow, and validation target — proving the "one codebase, many sites via
configuration" architecture the spec asks for. A 6-phase roadmap (Prototype → Clinical & User Validation →
Pilot Preparation → Pilot Implementation → Evaluation → Scale) with objective/activities/output/success
indicators per phase is rendered at `/demo/pilot-readiness`.

### G. Localization architecture

`domain/pilot/localization.ts` defines `LanguageCode` (`id-ID` / `vi-VN` / `en-US`) and a `LocaleMeta` shape
with an explicit `reviewStatus`. **Only `id-ID` is marked `REVIEWED`.** `vi-VN` is marked `NOT_LOCALIZED`
with a note that a Vietnam pilot requires a Vietnam-based clinical and linguistic reviewer — this codebase
does **not** machine-translate clinical content and present it as final, per the spec's explicit instruction
not to do that.

### H. Impact measurement architecture

`domain/pilot/researchMode.ts` defines a 12-indicator Input/Process/Outcome framework
(`EVALUATION_FRAMEWORK`), each marked `computable: true` (derivable from prototype data today, e.g.
screening completion rate) or `false` (requires real pilot data, e.g. Nakes trained). `/demo/impact` renders
this framework alongside clearly labeled **SIMULATED PILOT DATA** charts — no real usage numbers exist yet,
and none are claimed to.

### I. Simulated vs. real functionality (explicit)

| Shown in demo | Status |
|---|---|
| Risk score/classification/combination detection | **Real** — same engine as the main app |
| Screening → notification → validation → follow-up state transitions | **Real state machine**, but demo data is isolated from the real app's repository |
| "Notifikasi Nakes" | **Simulated** — labeled "Simulasi notifikasi Nakes," no real push/SMS/email is sent anywhere in this prototype |
| QR resolution | Real `qrService`/`QRCodeCard` reused directly; `/demo/guided` includes an interactive "Simulasikan Scan QR" step that renders the actual sticker component and a minimum-necessary summary panel — not just a description |
| Impact charts on `/demo/impact` | **Fabricated for illustration**, explicitly labeled SIMULATED PILOT DATA |
| Pilot configs (Malang/Medan/Vietnam) | **Planning fiction** — `status: 'PLANNING'`, no live site, no signed agreement |
| Localization | Architecture is real; `vi-VN` content is not (marked `NOT_LOCALIZED`) |
| Feedback widget | Real local capture; explicitly not claimed as a usability study |

### J. Remaining limitations

- The demo layer has no automated visual/E2E browser test — verification here is type-checking, unit
  tests on the state machine/service, and a production build, not a rendered-DOM assertion.
- Presentation Mode hides navigation chrome but does not change routing; a presenter must still click
  through `/demo/guided` — there is no auto-advancing slideshow timer.
- The "Scan QR" step uses a simulated scan trigger (a button), not an actual device camera — appropriate
  for a demo layer, but worth stating plainly rather than implying real camera hardware is involved.
- No multi-tenancy code path actually exists yet (`multiTenancy.ts` is intentionally types-only, per the
  spec's own instruction not to over-engineer the prototype).

### K. Production/pilot blockers (unchanged from the prior security audit, restated for this context)

RBAC still enforced client-side only · authentication is mock/local · no real backend, so "pilot
implementation" as described (multiple real sites, real Nakes accounts, real referral tracking) cannot run
on this codebase as-is — it requires the backend migration path already documented in
`services/repository.ts` (`LocalStorageRepository` → `ApiRepository`) · Vietnamese clinical content does not
exist and must not be machine-translated · no institutional consent/ethics process is implemented, only
typed placeholders with an explicit governance disclaimer (`researchMode.ts`).

### L. Recommended next steps

1. Clinical validation of `SCREENING_CONFIG` (already flagged `PROTOTYPE — NOT CLINICALLY VALIDATED`) —
   this blocks every pilot phase after Phase 1 in the roadmap shown at `/demo/pilot-readiness`.
2. Stand up a real backend implementing the `Repository<T>` interface already used throughout the service
   layer, so RBAC and QR resolution can be enforced server-side instead of in the browser.
3. Engage a Vietnam-based clinical and linguistic reviewer before writing any `vi-VN` content — do not
   translate `id-ID` strings mechanically.
4. Route real pilot metrics through the `EVALUATION_FRAMEWORK` definitions in `researchMode.ts` once a
   pilot site is live, replacing the SIMULATED numbers on `/demo/impact` with real, appropriately-evaluated
   data — and only then consider language like "reduced missed follow-up," never before.

## Notes on scope

This is a frontend-only prototype for demonstration and review purposes. Authentication is a mock
comparison against a seeded plaintext password and must never be used as-is in production. No claims of
regulatory certification (HIPAA, ISO, Kementerian Kesehatan approval, etc.) are made or implied anywhere
in the product.
