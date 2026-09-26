// Central content arrays for e-SIGRA landing page.
// All figures are proposed pilot hypotheses / development-readiness evidence,
// not achieved clinical or financial outcomes. See inline labels in each
// section for how each figure should be read.

export const workflowSteps = [
  {
    id: "detect",
    number: "01",
    title: "Detect",
    description:
      "A structured digital screening captures risk indicators using a rules- and scoring-based logic, field-tested through community midwifery practice."
  },
  {
    id: "understand",
    number: "02",
    title: "Understand",
    description:
      "Screening responses are organised into a clear risk profile, so a health worker can see what was flagged and why, without interpretation guesswork."
  },
  {
    id: "alert",
    number: "03",
    title: "Alert",
    description:
      "Risk signals are prioritised and surfaced to the relevant health worker, with critical indicators kept visible rather than diluted by additive scoring."
  },
  {
    id: "validate",
    number: "04",
    title: "Validate",
    description:
      "A health worker reviews the flagged case and makes the clinical call. e-SIGRA supports this review — it does not decide on the worker's behalf."
  },
  {
    id: "act",
    number: "05",
    title: "Act",
    description:
      "Validated cases move into a structured follow-up pathway, so a detected risk is connected to a defined next step rather than left open."
  },
  {
    id: "monitor",
    number: "06",
    title: "Monitor",
    description:
      "Follow-up status is tracked through to completion, giving a visible record of whether risk-to-action actually closed the loop."
  }
] as const;

export const platformCards = [
  {
    number: "01",
    title: "Screening",
    description: "Structured digital risk screening, built on rules- and scoring-based logic."
  },
  {
    number: "02",
    title: "Prioritisation",
    description: "Risk signals are surfaced for health-worker review, in order of urgency."
  },
  {
    number: "03",
    title: "Validation",
    description: "Health workers review each case and retain final clinical decision-making authority."
  },
  {
    number: "04",
    title: "Follow-up",
    description: "Validated cases move into structured action and monitoring through to completion."
  }
] as const;

export const productScreens = [
  {
    id: "screening",
    label: "Deteksi Dini",
    image: "/screenshots/deteksi-dini.jpg",
    title: "Digital Screening",
    description:
      "A guided, structured intake for capturing risk indicators in the field, using the platform's rules- and scoring-based screening logic."
  },
  {
    id: "alerts",
    label: "Dashboard",
    image: "/screenshots/dashboard.jpg",
    title: "Prioritised Risk Dashboard",
    description:
      "Flagged cases ordered by urgency, so a health worker's attention goes to the signals that need it first.",
    note: "This reflects e-SIGRA's safety model: risk levels are surfaced for health-worker review and action, not presented as an autonomous diagnosis."
  },
  {
    id: "followup",
    label: "Laporan",
    image: "/screenshots/laporan.jpg",
    title: "Reporting & Follow-up Tracking",
    description:
      "A shared view of validated cases and follow-up status, from review through to completed follow-up."
  }
] as const;

export const safetyPillars = [
  {
    icon: "shield-check",
    title: "Clinical Safety",
    description: "Critical indicators are not diluted by additive scoring — a single serious flag is treated as serious."
  },
  {
    icon: "user-check",
    title: "Human Validation",
    description: "Health workers retain final clinical decision-making authority at every step of the workflow."
  },
  {
    icon: "lock",
    title: "Security",
    description: "Role-based access control, access-control hardening and QR-code revocation are part of the platform's security approach."
  }
] as const;

export const evidenceTimeline = [
  {
    year: "2022",
    title: "Manual screening tool",
    description:
      "Developed as a professional midwifery final project under academic and clinical supervision, with risk scoring informed by the Poedji Rochjati maternal risk-screening framework.",
    tag: "Field origin"
  },
  {
    year: "2025",
    title: "Digital prototype",
    description: "The manual tool's screening logic was digitised into a functional prototype.",
    tag: "Development"
  },
  {
    year: "2026",
    title: "Security & clinical-safety hardening",
    description: "IDOR fix, role-based access control, critical-indicator override, and QR-code revocation.",
    tag: "Hardening"
  },
  {
    year: "2026–2027",
    title: "Urban pilot in Medan",
    description: "FGC 2.0 pilot testing the connected screening-to-follow-up workflow in the field.",
    tag: "Pilot"
  },
  {
    year: "Future",
    title: "Evidence-led scale",
    description: "Staged adoption contingent on validated pilot evidence.",
    tag: "Roadmap"
  }
] as const;

export const evidenceAtAGlance = [
  { label: "Origin", value: "2022" },
  { label: "Prototype", value: "2025–2026" },
  { label: "Software testing", value: "43 automated tests" },
  { label: "Security", value: "IDOR / RBAC / QR revocation" },
  { label: "Clinical safety", value: "Critical indicator override" },
  { label: "Pilot", value: "FGC 2.0 — Medan" },
  { label: "Evaluation", value: "Baseline → Midline → Endline" }
] as const;

export const readinessEvidence = [
  { value: 43, suffix: "", label: "Automated tests" },
  { value: 0, suffix: "", label: "TypeScript / lint errors" }
] as const;

export const pilotMetricCards = [
  { value: 500, suffix: "+", label: "Pilot participants target" },
  { value: 30, suffix: "+", label: "Health workers & cadres target" },
  { value: 6, suffix: "", label: "Months, pilot duration", isMonths: true }
] as const;

export const pilotPhases = [
  { title: "Baseline", description: "Establishing the starting point before workflow changes are introduced." },
  { title: "System Adaptation", description: "Onboarding the digital workflow into existing routines." },
  { title: "Clinical Validation", description: "Health workers reviewing screening logic against field cases." },
  { title: "Capacity Building", description: "Training health workers and community cadres." },
  { title: "Field Deployment", description: "Running the full screening-to-follow-up workflow in Medan." },
  { title: "Evaluation", description: "Baseline, midline and endline comparison against pilot metrics." }
] as const;

export const pilotOverview = [
  {
    label: "Why Medan",
    body: "Medan, North Sumatra is the site for e-SIGRA's first field pilot — an urban primary-care setting where the full screening-to-follow-up workflow can be tested against real day-to-day conditions before any wider rollout decision."
  },
  {
    label: "Pilot objective",
    body: "Test whether a connected screening-to-follow-up workflow can shorten the time between risk detection and appropriate action, and improve how completely risks are followed through."
  },
  {
    label: "Who",
    body: "500+ pregnant participants and 30+ health workers & community cadres — pilot targets, not enrolled numbers."
  },
  {
    label: "Expected deliverables",
    body: "A measured Risk-to-Action Completion Rate baseline, documented time-to-review and time-to-follow-up, validated health-worker acceptance of the workflow, and an evidence base for the scale-up decision."
  }
] as const;

export const riskToActionStages = ["Detected", "Reviewed", "Validated", "Followed Up"] as const;

export const secondaryMetrics = [
  "Time to Review",
  "Time to Follow-up",
  "Follow-up Completion Rate",
  "Screening & Data Completeness",
  "Participants Screened",
  "Health Workers/Cadres Trained",
  "User Adoption",
  "Health-Worker Acceptance"
] as const;

export const ecosystemFlow = [
  "Community",
  "e-SIGRA",
  "Health Worker",
  "FKTP",
  "Appropriate Action / Referral",
  "Health System"
] as const;

export const futureEvaluationChain = ["Risk", "Action", "Utilisation", "Potential Cost Avoidance"] as const;

export const roadmapYears = [
  {
    year: "Year 1",
    title: "Pilot",
    description: "Validation → Evidence. Running FGC 2.0 in Medan and completing baseline–midline–endline evaluation."
  },
  {
    year: "Year 2",
    title: "Adoption",
    description: "Target: Puskesmas and Dinas Kesehatan partnerships (not yet initiated), building on pilot evidence."
  },
  {
    year: "Year 3",
    title: "Scale",
    description: "Replication and sustainable B2G/B2B pathways in additional locations."
  }
] as const;

export const adoptionLadder = [
  "Individual",
  "Community",
  "Healthcare Facility",
  "Puskesmas Network",
  "Local Government",
  "Other Cities"
] as const;

export const teamGroups = [
  {
    title: "Founder / Project Lead",
    name: "Anggi Fitriyani",
    credential: "Bdn., S.Tr.Keb",
    photo: "/founder-anggi.jpg",
    bio: "e-SIGRA began as Anggi's professional midwifery final project in 2022, developed under academic and clinical supervision. Its screening indicators, risk scoring, thresholds and workflow were reviewed during development, with the scoring approach informed by the Poedji Rochjati maternal risk-screening framework.",
    responsibilities: ["Clinical oversight", "Screening-content review", "Pilot accountability"]
  },
  {
    title: "Academic & Clinical Supervision",
    name: "Erina Eka Hatini",
    credential: "S.S.T., M.P.H.",
    bio: "Supervised e-SIGRA's development as Anggi's final-project advisor, reviewing its screening indicators, scoring and thresholds. Formally listed as a co-creator in the e-SIGRA copyright registration.",
    responsibilities: ["Academic supervision (final project)", "Screening-indicator and scoring review"]
  },
  {
    title: "Community",
    responsibilities: ["Community engagement", "Cadre coordination"]
  },
  {
    title: "Technology",
    responsibilities: ["Platform engineering", "Security", "Data infrastructure"]
  }
] as const;

export const footerLinks = [
  { label: "Platform", href: "#platform" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Evidence", href: "#evidence" },
  { label: "Pilot", href: "#pilot" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Contact", href: "#contact" }
] as const;

export const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Evidence", href: "#evidence" },
  { label: "Pilot", href: "#pilot" },
  { label: "Roadmap", href: "#roadmap" }
] as const;

export const partnerTracks = [
  {
    emoji: "🏥",
    title: "Health Facility",
    focus: "Pilot / workflow collaboration",
    description:
      "Run e-SIGRA's screening-to-follow-up workflow alongside your existing care routine.",
    subject: "Partnership inquiry — Health Facility"
  },
  {
    emoji: "🏛️",
    title: "Health System",
    focus: "Evidence / policy / scale-up",
    description:
      "Help evaluate pilot evidence and shape the pathway to wider adoption.",
    subject: "Partnership inquiry — Health System"
  },
  {
    emoji: "🤝",
    title: "Technology & Impact Partner",
    focus: "Technology / research / ecosystem",
    description:
      "Contribute technical, research, or ecosystem capacity as the platform matures.",
    subject: "Partnership inquiry — Technology & Impact Partner"
  }
] as const;

export const contactEmail = "hello@esigra.health";
