const STORAGE_KEY = "pension-portfolio-v1";
const FULL_NEW_STATE_PENSION_WEEKLY_2026_27 = 241.3;
const FULL_NEW_STATE_PENSION_2026_27 = Math.round(241.3 * 52);
const STATE_PENSION_MIN_QUALIFYING_YEARS = 10;
const STATE_PENSION_FULL_RATE_YEARS = 35;
const PENSION_IHT_CHANGE_DATE = "6 April 2027";

const appState = {
  userName: "Sample Member",
  employerName: "Example Studio Ltd",
  schemeName: "Example Workplace Pension",
  employmentType: "employee",
  mainConcern: "contribution gap",
  age: 32,
  retireAge: 68,
  salary: 36000,
  emergencySavings: 900,
  targetMonthlyIncome: 1800,
  currentPot: 28450,
  dbAnnualPensionAtSchemeAge: 0,
  dbSchemePensionAge: 0,
  pensionType: "DC",
  employerContributionPct: 5,
  employeeContributionPct: 5,
  dcInvestmentAccess: "workplace-self-select",
  dcInvestmentStyle: "balanced",
  secondJobEnabled: false,
  secondJobAnnualIncome: 0,
  secondJobPensionParticipation: "unknown",
  secondJobEmployerContributionPct: 0,
  secondJobEmployeeContributionPct: 0,
  secondJobPensionablePayBasis: "qualifying earnings",
  statePension: 0,
  statePensionAge: 68,
  pensionablePayBasis: "qualifying earnings",
  payslipContribution: 124,
  providerContribution: 248,
  growthPct: 4,
  drawdownPct: 4,
  annualChargePct: 0,
  inflationPct: 2.5,
  moneyMode: "today",
  salaryGrowthPct: 0,
  contributionEscalationPct: 0,
  taxReliefMode: "net-pay",
  marginalTaxPct: 20,
  employeeNiPct: 8,
  dbAmountBasis: "at-scheme-age",
  dbRevaluationPct: 0,
  dbIndexationPct: 0,
  dbAdjustmentPct: 0,
  assumptionPreset: "base",
  jobOne: 36000,
  jobTwo: 6500,
  scenarioModel: {
    type: "none",
    retireLaterYears: 2,
    extraEmployeePct: 2,
    pauseMonths: 12,
    lowerEarningsPct: 10,
    splitExtraMonthly: 100,
  },
  projectionInspectorAge: 32,
  projectionInspectorSegment: "db",
  incomeMixAgeTouched: false,
  assistantTopic: "planning",
  caseFacts: {},
  pendingAssistantQuestion: "",
  lastAssistantQuestion: "",
  shortTermSavings: createDefaultShortTermSavings(),
  lifeFactors: createDefaultLifeFactors(),
  partnerProfile: createDefaultPartnerProfile(),
  householdGoal: createDefaultHouseholdGoal(),
  meta: {
    savedAt: null,
    starterMode: "example",
  },
};

const ASSUMPTION_PRESETS = {
  cautious: { label: "Cautious", growthPct: 3, drawdownPct: 3.5 },
  base: { label: "Base", growthPct: 4, drawdownPct: 4 },
  optimistic: { label: "Optimistic", growthPct: 5, drawdownPct: 4.5 },
};

const CORE_ASSISTANT_TOPICS = ["planning", "risk-pathways", "learn", "scenario", "contributions", "life-events", "household"];

let currentView = "dashboard";
let deferredInstallPrompt = null;
let uiRenderFrame = 0;
let onboardingMode = "starter";
let projectionCanvasMeta = null;

const UI_BREAKPOINTS = {
  mobile: 760,
  tablet: 1120,
};

let uiState = {
  viewport: "desktop",
  shell: "web",
  mode: "desktop-web",
  navStyle: "top",
};

const ONBOARDING_CONTENT = {
  starter: {
    eyebrow: "Personal pension portfolio",
    title: "Understand your pension path",
    copy: "Build a clear record, see whether you are on track, and learn the pension terms that affect your choices.",
    exampleEyebrow: "Quick start",
    exampleTitle: "Use DC example",
    exampleCopy: "Load a worked DC example to see how a current pension pot, contributions and retirement income fit together.",
    exampleButton: "Use DC example",
    dbEyebrow: "DB example",
    dbTitle: "Use DB example",
    dbCopy: "Load a worked DB example to compare a promised pension against the target.",
    dbButton: "Use DB example",
    stateEyebrow: "Mixed history example",
    stateTitle: "Use DC + previous DB example",
    stateCopy: "Load a worked current DC record with one previous deferred DB promise so the goal view can show what the DC side still needs to do.",
    stateButton: "Use DC + previous DB example",
    mixedEyebrow: "Mixed history + State Pension",
    mixedTitle: "Use DC + DB + State Pension example",
    mixedCopy:
      "Load a worked current DC record with one previous DB promise plus a qualifying full-rate State Pension forecast.",
    mixedButton: "Use DC + DB + State Pension example",
    blankEyebrow: "Blank start",
    blankTitle: "Start with an empty record",
    blankCopy: "Add your own job, pension and goal details, then compare the result with your target.",
    blankButton: "Start blank",
    note: "Saved locally in this browser only.",
  },
  saved: {
    eyebrow: "Saved portfolio",
    title: "Choose how to open your pension record",
    copy: "Continue entering your own details, or switch to a worked DC, DB, mixed-history, or mixed-history plus State Pension example.",
    resumeEyebrow: "Your portfolio",
    resumeTitle: "Continue entering my details",
    resumeCopy: "Open your saved pension record and update the employer, scheme, arrangement and balances.",
    resumeButton: "Enter my portfolio",
    exampleEyebrow: "DC example",
    exampleTitle: "Use DC example",
    exampleCopy: "Replace the current record with a worked DC example and open the goal view with sample numbers.",
    exampleButton: "Use DC example",
    dbEyebrow: "DB example",
    dbTitle: "Use DB example",
    dbCopy: "Replace the current record with a worked DB example that includes statement income and scheme age.",
    dbButton: "Use DB example",
    stateEyebrow: "Mixed history example",
    stateTitle: "Use DC + previous DB example",
    stateCopy: "Replace the current record with a worked DC example that also includes one previous DB promise in history.",
    stateButton: "Use DC + previous DB example",
    mixedEyebrow: "Mixed history + State Pension",
    mixedTitle: "Use DC + DB + State Pension example",
    mixedCopy:
      "Replace the current record with a worked DC example that also includes one previous DB promise and a qualifying State Pension forecast.",
    mixedButton: "Use DC + DB + State Pension example",
    blankEyebrow: "Start over",
    blankTitle: "Start blank",
    blankCopy: "Clear the saved record and enter everything again from scratch.",
    blankButton: "Start blank",
    note: "Saved locally in this browser only.",
  },
  demo: {
    eyebrow: "Demo portfolio",
    title: "This is a sample pension record",
    copy:
      "Switch between the DC example, the DB example, the mixed DC plus previous DB example, the mixed DC plus DB plus State Pension example, or clear the demo and enter your own job, pension and goal details.",
    exampleEyebrow: "Example data",
    exampleTitle: "Use DC example",
    exampleCopy: "Use the sample DC record to explore target paths, the pot projection chart and the assistant with working numbers.",
    exampleButton: "Use DC example",
    dbEyebrow: "DB example",
    dbTitle: "Use DB example",
    dbCopy: "Switch to the sample DB record to compare a promised pension against the target.",
    dbButton: "Use DB example",
    stateEyebrow: "Mixed history example",
    stateTitle: "Use DC + previous DB example",
    stateCopy: "Switch to the sample current DC record with one previous DB promise to see what the DC side still needs to do.",
    stateButton: "Use DC + previous DB example",
    mixedEyebrow: "Mixed history + State Pension",
    mixedTitle: "Use DC + DB + State Pension example",
    mixedCopy:
      "Switch to the sample current DC record with one previous DB promise and a qualifying full-rate State Pension forecast.",
    mixedButton: "Use DC + DB + State Pension example",
    blankEyebrow: "Your own record",
    blankTitle: "Enter my portfolio",
    blankCopy: "Clear the demo and start entering your own pension, contribution and retirement details.",
    blankButton: "Enter my portfolio",
    note: "The demo record is illustrative only.",
  },
};

const thresholds = {
  trigger: 10000,
  lowerBand: 6240,
  upperBand: 50270,
  statutoryMinimumPct: 8,
  emergencyTarget: 1500,
};

const benchmarkThresholds = {
  single: {
    minimum: 13400,
    moderate: 31700,
    comfortable: 43900,
  },
  couple: {
    minimum: 21600,
    moderate: 43900,
    comfortable: 60600,
  },
};

const titles = {
  dashboard: "Dashboard",
  finder: "Pension Record",
  coach: "AI Assistant",
};

const assistantQuestionGroups = {
  joining: {
    label: "Joining",
    description: "Automatic enrolment, joining rights, worker status and postponement.",
    starterIds: ["ae-rights", "worker-status", "postponement-backdating"],
  },
  contributions: {
    label: "Contributions",
    description: "Understand employer payments, your payments, pay basis and missing-money checks.",
    starterIds: ["minimum-contributions", "pay-definition", "late-missing-contributions"],
  },
  "opt-out": {
    label: "Opt-out",
    description: "Opt-out rights, refunds, rejoining and employer pressure.",
    starterIds: ["opt-out-rejoin", "opt-out-pressure-expanded", "opt-out-pressure"],
  },
  "employer-change": {
    label: "Employer changes",
    description: "Future changes, consultation, closure and contribution changes.",
    starterIds: ["scheme-change-broad", "consultation", "scheme-change"],
  },
  "db-rights": {
    label: "DB/accrued rights",
    description: "Final salary protection, subsisting rights, DB changes and PPF risk.",
    starterIds: ["accrued-rights", "db-final-salary-rights", "ppf"],
  },
  equality: {
    label: "Equality/GMP/Barber",
    description: "Equal treatment, Barber window, GMP equalisation and public-sector remedy issues.",
    starterIds: ["equality-barber-expanded", "gmp-expanded", "discrimination-expanded"],
  },
  leave: {
    label: "Leave",
    description: "Maternity, sickness, unpaid leave and death-in-service risk while absent.",
    starterIds: ["leave-absence", "death-divorce"],
  },
  tupe: {
    label: "TUPE",
    description: "Transfer, outsourcing, replacement pension duties and Fair Deal questions.",
    starterIds: ["tupe-expanded", "tupe"],
  },
  complaints: {
    label: "Complaints",
    description: "Documents, evidence, escalation routes and advice complaints.",
    starterIds: ["information-complaints", "complaints", "can-i-enforce"],
  },
  scenario: {
    label: "What-if scenarios",
    description: "Test retirement age, higher contributions, pauses, lower earnings or cash-to-pension choices.",
    starterIds: ["scenario-retire-later", "scenario-raise-contributions", "scenario-pause-saving"],
  },
  learn: {
    label: "Learn pension basics",
    description: "Plain-English explanations of pension types, State Pension, pensionable pay and drawdown.",
    starterIds: ["learn-dc", "learn-state-pension", "learn-pensionable-pay", "learn-drawdown"],
  },
  planning: {
    label: "On-track planning",
    description: "Check whether you are on track, what moves the result, and what to do next.",
    starterIds: ["planning-on-track", "planning-cash-vs-pension", "planning-next-step"],
  },
  "risk-pathways": {
    label: "Risk pathways",
    description: "Low earners, part-time workers, multiple jobs and missed employer-contribution checks.",
    starterIds: [
      "risk-low-earner",
      "risk-part-time",
      "risk-multiple-jobs",
      "risk-missing-employer-contributions",
    ],
  },
  "life-events": {
    label: "Life events",
    description: "Changing jobs, parental leave, sickness, separation and approaching retirement.",
    starterIds: ["life-event-job-change", "life-event-parental-leave", "life-event-retirement"],
  },
  household: {
    label: "Couple planning",
    description: "Spouse or partner planning, joint goals, household adequacy and survivor checks.",
    starterIds: ["household-joint-goal", "household-spouse-track", "household-survivor-check"],
  },
  "common-model": {
    label: "Common model answers",
    description: "High-demand employee questions across the most common pension disputes.",
    starterIds: ["scheme-change", "missing-contributions", "employer-contributions"],
  },
};

const assistantFollowUpSchemas = {
  joining: {
    intro: "These facts help separate automatic enrolment, opt-in rights and whether employer contributions should follow.",
    fields: [
      {
        id: "workerStatus",
        label: "Working status",
        help: "Use the closest match to how the employer treats the job.",
        required: true,
        options: [
          { value: "employee", label: "Employee or worker" },
          { value: "agency", label: "Agency worker" },
          { value: "zero-hours", label: "Zero-hours or casual worker" },
          { value: "self-employed", label: "Called self-employed or contractor" },
          { value: "unknown", label: "Not sure" },
        ],
      },
      {
        id: "ukStatus",
        label: "UK working position",
        help: "Automatic enrolment usually assumes the person ordinarily works in the UK.",
        required: true,
        options: [
          { value: "uk", label: "Ordinarily works in the UK" },
          { value: "outside-uk", label: "Does not ordinarily work in the UK" },
          { value: "unknown", label: "Not sure" },
        ],
      },
      {
        id: "ageBand",
        label: "Age band",
        help: "Use the statutory age group rather than the exact age if that is easier.",
        required: true,
        options: [
          { value: "under-22", label: "Under 22" },
          { value: "eligible-age", label: "22 to State Pension age" },
          { value: "over-spa", label: "Over State Pension age" },
          { value: "unknown", label: "Not sure" },
        ],
      },
      {
        id: "earningsBand",
        label: "Annual earnings band",
        help: "This helps separate automatic enrolment from the right to opt in or join.",
        required: true,
        options: [
          { value: "below-lower-band", label: "Below GBP 6,240" },
          { value: "opt-in-band", label: "GBP 6,240 to GBP 9,999" },
          { value: "trigger-band", label: "GBP 10,000 or more" },
          { value: "unknown", label: "Not sure" },
        ],
      },
      {
        id: "joinRequest",
        label: "Joining position",
        help: "Tell the assistant whether the employer refused or ignored a request to join.",
        required: true,
        options: [
          { value: "not-requested", label: "Have not asked to join yet" },
          { value: "asked-refused", label: "Asked to join and was refused" },
          { value: "asked-ignored", label: "Asked to join and was ignored" },
          { value: "postponed", label: "Told enrolment is postponed or delayed" },
          { value: "already-enrolled", label: "Already enrolled" },
        ],
      },
    ],
  },
  contributions: {
    intro: "These facts help the assistant tell apart a lawful pay-basis question from a missing-contribution problem.",
    fields: [
      {
        id: "payBasis",
        label: "Contribution basis used",
        help: "Use the wording shown by payroll or the provider if known.",
        required: true,
        options: [
          { value: "qualifying-earnings", label: "Qualifying earnings" },
          { value: "basic-salary", label: "Basic salary only" },
          { value: "total-earnings", label: "Total earnings" },
          { value: "unknown", label: "Not sure" },
        ],
      },
      {
        id: "excludedPay",
        label: "Excluded pay element",
        help: "This matters where overtime, bonus, commission or leave pay is left out.",
        required: false,
        options: [
          { value: "none", label: "Nothing obvious excluded" },
          { value: "overtime", label: "Overtime excluded" },
          { value: "bonus", label: "Bonus or commission excluded" },
          { value: "leave-pay", label: "Sick or family leave pay issue" },
          { value: "unknown", label: "Not sure" },
        ],
      },
      {
        id: "paymentTiming",
        label: "Provider timing",
        help: "Use this to separate delay from a likely missing-payment breach.",
        required: true,
        options: [
          { value: "within-30-days", label: "Still within normal processing time" },
          { value: "over-30-days", label: "Over one month late" },
          { value: "over-90-days", label: "Still missing after around 90 days" },
          { value: "unknown", label: "Not sure" },
        ],
      },
      {
        id: "lossConcern",
        label: "Loss concern",
        help: "Use this if the user may ask about lost growth or compensation.",
        required: false,
        options: [
          { value: "none", label: "No clear loss identified yet" },
          { value: "lost-growth", label: "Possible lost investment growth" },
          { value: "refund-or-correction", label: "Main issue is correction or back-payment" },
          { value: "unknown", label: "Not sure" },
        ],
      },
    ],
  },
  "opt-out": {
    intro: "These facts help the assistant decide whether the issue is ordinary opt-out, unlawful inducement, or detriment.",
    fields: [
      {
        id: "pressureSource",
        label: "Who is involved",
        help: "Identify whether the issue came from payroll, HR, a manager or a recruiter.",
        required: true,
        options: [
          { value: "none", label: "No pressure, just a normal opt-out question" },
          { value: "manager", label: "Manager or supervisor" },
          { value: "hr-payroll", label: "HR or payroll" },
          { value: "recruitment", label: "Recruitment or job-offer stage" },
          { value: "unknown", label: "Not sure" },
        ],
      },
      {
        id: "pressureType",
        label: "What happened",
        help: "Choose the closest description of the employer conduct.",
        required: true,
        options: [
          { value: "asked-neutrally", label: "Opt-out only explained neutrally" },
          { value: "told-to-opt-out", label: "Told to opt out" },
          { value: "extra-pay", label: "Offered extra pay or benefit to opt out" },
          { value: "job-treatment", label: "Hours, promotion or job treatment linked to pension" },
          { value: "dismissal-risk", label: "Dismissal or hiring threat linked to pension" },
        ],
      },
      {
        id: "membershipStage",
        label: "Membership stage",
        help: "This affects refund timing and whether rejoin/re-enrolment duties matter.",
        required: true,
        options: [
          { value: "considering-opt-out", label: "Considering opting out" },
          { value: "opted-out-within-month", label: "Opted out within the first month" },
          { value: "opted-out-after-month", label: "Opted out after the first month" },
          { value: "stayed-in-scheme", label: "Stayed in the scheme" },
        ],
      },
    ],
  },
  "employer-change": {
    intro: "These facts help the assistant tell apart a future policy change from an attempt to interfere with accrued rights.",
    fields: [
      {
        id: "changeType",
        label: "Type of change",
        help: "Use the closest description of the employer proposal.",
        required: true,
        options: [
          { value: "contribution-rate", label: "Change to contributions" },
          { value: "provider-switch", label: "Switch of provider or scheme" },
          { value: "close-dc-or-db", label: "Closure to new members or future accrual" },
          { value: "db-to-dc", label: "Move from DB/final salary to DC" },
          { value: "other", label: "Another pension change" },
        ],
      },
      {
        id: "rightsImpact",
        label: "What is affected",
        help: "This is the key distinction between future change and accrued-rights risk.",
        required: true,
        options: [
          { value: "future-only", label: "Future contributions or future accrual only" },
          { value: "past-rights", label: "Built-up or accrued rights may be affected" },
          { value: "not-sure", label: "Not sure yet" },
        ],
      },
      {
        id: "consultationStatus",
        label: "Consultation position",
        help: "Use this for 60-day consultation and sham-consultation questions.",
        required: true,
        options: [
          { value: "not-started", label: "No consultation seen" },
          { value: "running", label: "Consultation is running" },
          { value: "already-decided", label: "Looks already decided or sham" },
          { value: "completed", label: "Consultation completed" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "employerSize",
        label: "Employer size",
        help: "The 50-employee threshold can matter for employer consultation duties.",
        required: false,
        options: [
          { value: "under-50", label: "Under 50 employees" },
          { value: "50-plus", label: "50 or more employees" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
    ],
  },
  "db-rights": {
    intro: "These facts help the assistant spot subsisting-rights, final-salary-link and consent issues.",
    fields: [
      {
        id: "dbStatus",
        label: "Benefit position",
        help: "Use the closest description of the scheme or benefit in issue.",
        required: true,
        options: [
          { value: "db", label: "DB/final salary or career average benefit" },
          { value: "hybrid", label: "Hybrid with a DB element" },
          { value: "pension-in-payment", label: "Already receiving the pension" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "accruedImpact",
        label: "Change to accrued rights",
        help: "This is the main question for subsisting-rights analysis.",
        required: true,
        options: [
          { value: "future-only", label: "Only future service seems affected" },
          { value: "accrued-rights", label: "Past service or pension already built up seems affected" },
          { value: "already-paid", label: "Pension already in payment seems affected" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "consentStatus",
        label: "Consent or amendment position",
        help: "This helps with silence-is-not-consent and protected-modification issues.",
        required: true,
        options: [
          { value: "no-consent", label: "No written consent given" },
          { value: "asked-for-consent", label: "Asked for consent" },
          { value: "silence-treated-as-consent", label: "Silence or no reply treated as consent" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "transferHistory",
        label: "Transfer history",
        help: "This matters where the question touches GMP, DB transfer or historic value loss.",
        required: false,
        options: [
          { value: "none", label: "No transfer out" },
          { value: "historic-transfer", label: "Historic transfer out" },
          { value: "considering-transfer", label: "Considering transfer now" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
    ],
  },
  equality: {
    intro: "These facts help the assistant decide whether the question is about Barber, GMP equalisation, or another equality rule.",
    fields: [
      {
        id: "serviceType",
        label: "Scheme/service type",
        help: "Barber and GMP questions are usually occupational DB or contracted-out issues.",
        required: true,
        options: [
          { value: "dc-only", label: "DC only" },
          { value: "db-or-hybrid", label: "DB or hybrid" },
          { value: "contracted-out-db", label: "Contracted-out DB / GMP may exist" },
          { value: "public-sector", label: "Public-sector scheme" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "equalityConcern",
        label: "Main equality issue",
        help: "Choose the closest issue so the answer can target the right rule set.",
        required: true,
        options: [
          { value: "barber", label: "Barber window or equal pension age" },
          { value: "gmp", label: "GMP equalisation" },
          { value: "part-time-or-maternity", label: "Part-time, maternity or leave discrimination" },
          { value: "survivor", label: "Survivor or spouse benefit difference" },
          { value: "mccloud", label: "Public-sector / McCloud issue" },
        ],
      },
      {
        id: "historicTransfer",
        label: "Historic transfer or arrears issue",
        help: "This matters where the user asks about transfer top-ups, arrears or interest.",
        required: false,
        options: [
          { value: "none", label: "No historic transfer issue" },
          { value: "arrears", label: "Possible arrears or underpayment" },
          { value: "transfer-out", label: "Historic transfer out" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
    ],
  },
  leave: {
    intro: "These facts help distinguish paid-leave protections from unpaid-leave, sickness and cover disputes.",
    fields: [
      {
        id: "leaveType",
        label: "Type of leave or absence",
        help: "Use the closest description of the absence in issue.",
        required: true,
        options: [
          { value: "maternity-family", label: "Maternity, paternity, adoption or shared parental leave" },
          { value: "sickness", label: "Short- or long-term sickness" },
          { value: "unpaid-leave", label: "Unpaid leave or career break" },
          { value: "part-time-return", label: "Reduced hours or phased return" },
          { value: "other", label: "Another leave or absence issue" },
        ],
      },
      {
        id: "paidStatus",
        label: "Pay position during leave",
        help: "This changes whether employer and member contributions should continue.",
        required: true,
        options: [
          { value: "paid", label: "Paid leave or sick pay" },
          { value: "partly-paid", label: "Partly paid" },
          { value: "unpaid", label: "Unpaid leave" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "deathCoverIssue",
        label: "Death-in-service or insured-cover issue",
        help: "Use this where cover may have stopped while off sick or absent.",
        required: false,
        options: [
          { value: "none", label: "No death-in-service issue" },
          { value: "cover-stopped", label: "Told cover stopped or may stop" },
          { value: "cover-unclear", label: "Not sure whether cover continued" },
        ],
      },
    ],
  },
  tupe: {
    intro: "These facts help separate ordinary employer takeover questions from TUPE, outsourcing and Fair Deal issues.",
    fields: [
      {
        id: "transferType",
        label: "Transfer situation",
        help: "Use the closest description of the employment transfer.",
        required: true,
        options: [
          { value: "private-transfer", label: "Private-sector takeover or business transfer" },
          { value: "outsourcing", label: "Outsourcing or contractor change" },
          { value: "public-sector", label: "Public-sector outsourcing" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "oldSchemeType",
        label: "Old scheme type",
        help: "This helps with match obligations and old-age pension exclusions.",
        required: true,
        options: [
          { value: "dc", label: "DC workplace pension" },
          { value: "db", label: "DB/final salary scheme" },
          { value: "personal-pension-promise", label: "Employer paid into a personal pension" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "replacementOffer",
        label: "Replacement pension offer",
        help: "Use this for contribution-matching and broadly comparable issues.",
        required: false,
        options: [
          { value: "not-seen", label: "No replacement details yet" },
          { value: "lower-match", label: "New pension appears less generous" },
          { value: "similar-offer", label: "New pension looks broadly similar" },
          { value: "fair-deal-question", label: "Need public-sector / Fair Deal comparison" },
        ],
      },
    ],
  },
  complaints: {
    intro: "These facts help point the user to the right complaint route and evidence bundle.",
    fields: [
      {
        id: "complaintStage",
        label: "Current complaint stage",
        help: "Choose where the issue currently sits.",
        required: true,
        options: [
          { value: "not-raised", label: "Not raised formally yet" },
          { value: "with-employer-or-provider", label: "Raised with employer, provider or trustees" },
          { value: "final-response", label: "Have a final response or no response after waiting" },
          { value: "already-escalated", label: "Already escalated to an ombudsman or regulator" },
        ],
      },
      {
        id: "issueOwner",
        label: "Who is mainly responsible",
        help: "This directs the user toward TPR, TPO, FOS or another route.",
        required: true,
        options: [
          { value: "employer-compliance", label: "Employer compliance or payroll issue" },
          { value: "scheme-admin", label: "Scheme, provider or trustee administration issue" },
          { value: "financial-advice", label: "Regulated advice or pension marketing issue" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "lossType",
        label: "Main impact",
        help: "Use this to tailor the answer around correction, financial loss or distress.",
        required: false,
        options: [
          { value: "correction-only", label: "Need correction only" },
          { value: "financial-loss", label: "Possible financial loss or arrears" },
          { value: "distress", label: "Main impact is delay, stress or inconvenience" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
    ],
  },
  scenario: {
    intro: "These optional facts help the assistant show a clearer what-if comparison using your pension record.",
    fields: [
      {
        id: "scenarioType",
        label: "Scenario to explore",
        help: "Choose the what-if change you want the assistant to test.",
        required: false,
        options: [
          { value: "retire-later", label: "Retire later" },
          { value: "raise-contributions", label: "Raise contributions" },
          { value: "pause-saving", label: "Pause pension saving" },
          { value: "lower-earnings", label: "Lower earnings" },
          { value: "restart-after-pause", label: "Restart after a pause" },
          { value: "split-savings", label: "Split cash and pension differently" },
        ],
      },
      {
        id: "comparisonFocus",
        label: "Main comparison focus",
        help: "Use this if you mainly care about pot size, retirement income, or both.",
        required: false,
        options: [
          { value: "income", label: "Retirement income" },
          { value: "pot", label: "Pot value" },
          { value: "both", label: "Both income and pot" },
        ],
      },
    ],
  },
  planning: {
    intro: "These answers use the current retirement target, contribution settings and short-term savings settings already entered in the app.",
    fields: [],
  },
  "life-events": {
    intro: "These answers use the selected life event plus the current pension record to narrow what changed and what to check next.",
    fields: [],
  },
  household: {
    intro: "These answers use the current pension record and any spouse or partner details entered on the retirement-goal page.",
    fields: [],
  },
  "common-model": {
    intro: "These follow-up facts help tailor the most common model answers without forcing a full questionnaire.",
    fields: [
      {
        id: "issueFrame",
        label: "General issue frame",
        help: "Use the closest frame for the question you want answered.",
        required: false,
        options: [
          { value: "joining", label: "Joining or eligibility" },
          { value: "contributions", label: "Contributions or missing money" },
          { value: "change", label: "Employer changing the pension" },
          { value: "complaint", label: "Complaint or next step" },
        ],
      },
    ],
  },
};

function createEmptyCaseFacts() {
  return Object.fromEntries(
    Object.entries(assistantFollowUpSchemas).map(([topic, schema]) => [
      topic,
      Object.fromEntries(schema.fields.map((field) => [field.id, ""])),
    ])
  );
}

appState.caseFacts = createEmptyCaseFacts();

const personalAppQuestionLibrary = [
  {
    id: "learn-dc",
    category: "Learn",
    question: "What is a defined contribution pension in plain English?",
    label: "DC pension basics",
  },
  {
    id: "learn-state-pension",
    category: "Learn",
    question: "What is the State Pension in plain English?",
    label: "State Pension basics",
  },
  {
    id: "learn-pensionable-pay",
    category: "Learn",
    question: "What does pensionable pay mean in plain English?",
    label: "Pensionable pay",
  },
  {
    id: "learn-drawdown",
    category: "Learn",
    question: "What is drawdown in plain English?",
    label: "Drawdown basics",
  },
  {
    id: "planning-on-track",
    category: "Planning",
    question: "Am I on track for my retirement goal?",
    label: "On-track status",
  },
  {
    id: "planning-cash-vs-pension",
    category: "Planning",
    question: "Should I build cash savings first or pay more into my pension?",
    label: "Cash vs pension",
  },
  {
    id: "planning-next-step",
    category: "Planning",
    question: "What should I do next based on my record?",
    label: "Next best action",
  },
  {
    id: "risk-low-earner",
    category: "Risk pathways",
    question: "Am I in the low-earner pension pathway and what does that change?",
    label: "Low-earner pathway",
  },
  {
    id: "risk-part-time",
    category: "Risk pathways",
    question: "How does part-time work change my pension position?",
    label: "Part-time pathway",
  },
  {
    id: "risk-multiple-jobs",
    category: "Risk pathways",
    question: "How should my pension be assessed if I have multiple jobs?",
    label: "Multiple jobs pathway",
  },
  {
    id: "risk-missing-employer-contributions",
    category: "Risk pathways",
    question: "Am I missing employer contributions because of my earnings or job pattern?",
    label: "Missing employer contributions",
  },
  {
    id: "life-event-job-change",
    category: "Life events",
    question: "What should I check if I change jobs?",
    label: "Changing jobs",
  },
  {
    id: "life-event-parental-leave",
    category: "Life events",
    question: "What should I check during maternity or parental leave?",
    label: "Parental leave",
  },
  {
    id: "life-event-retirement",
    category: "Life events",
    question: "What should I check as I get close to retirement?",
    label: "Approaching retirement",
  },
  {
    id: "household-joint-goal",
    category: "Couple planning",
    question: "Can I track a joint retirement goal with my partner?",
    label: "Joint retirement goal",
  },
  {
    id: "household-spouse-track",
    category: "Couple planning",
    question: "How do I compare my pension with my spouse or partner's pension?",
    label: "Compare partner pension",
  },
  {
    id: "household-survivor-check",
    category: "Couple planning",
    question: "What survivor or dependant pension details should we review as a couple?",
    label: "Survivor checklist",
  },
];

const pensionIssueLibrary = [
  {
    id: "scheme-change",
    category: "Employer change",
    question: "Is my employer allowed to change my pension plan?",
    label: "Employer changing pension plan",
    triggers: [
      "change my pension plan",
      "change my pension scheme",
      "change my pensions scheme",
      "change pensions plan",
      "change pensions scheme",
      "change pension provider",
      "change my pension provider",
      "employer change pension",
      "employer change my pension",
      "employer change my scheme",
      "switch to dc",
      "switch to defined contribution",
      "close final salary",
      "close db",
      "replace final salary",
      "replace db",
      "amendment",
      "scheme amendment",
      "no real difference",
      "accrued rights",
    ],
    answer:
      "Potentially yes for future benefits, but not simply if the change cuts protected accrued rights or breaches the scheme rules, contract, consultation duties, or employer good-faith duties.",
    basis:
      "Pensions Act 1995 s67 protects subsisting rights; consultation may arise under the Occupational and Personal Pension Schemes (Consultation by Employers and Miscellaneous Amendment) Regulations 2006; key authorities include Re Courage Group's Pension Schemes, Imperial Group Pension Trust Ltd v Imperial Tobacco Ltd, IBM UK Holdings Ltd v Dalgleish, Barnardo's v Buckinghamshire, Danks v QinetiQ Holdings Ltd and Scally v Southern Health and Social Services Board.",
    application: () =>
      `Your record says ${getPlanLabel()} with ${appState.employerName || "the employer"} and ${appState.schemeName || "the scheme/provider"}. Check whether the change affects past service/accrued rights or only future accrual, and compare the notice with the amendment power in the scheme rules.`,
    conclusion:
      "Likely lawful only if the employer/trustees have power to make the change, use it for a proper purpose, preserve protected accrued rights, consult where required, and avoid misleading member communications. If members were told the change made no real difference, misrepresentation or maladministration may be arguable but loss and reliance still need proof.",
    documents: ["scheme rules and amendment deed", "member booklet", "consultation notice", "emails or presentations", "old and new benefit statements"],
    help: "Get legal advice if accrued DB/final salary rights, misleading statements, or a large pension loss are involved.",
  },
  {
    id: "employer-contributions",
    category: "Employer duty",
    question: "Can my employer reduce or stop pension contributions?",
    label: "Employer reducing or stopping contributions",
    triggers: [
      "employer stop",
      "employer reduce",
      "stop contributions",
      "reduce contributions",
      "employer contribution",
      "refuse to pay",
      "no longer pay",
      "suspend contributions",
    ],
    answer:
      "Sometimes for future contributions, but not below automatic-enrolment duties where they apply and not in breach of contract, scheme rules, or a binding pension promise.",
    basis:
      "Pensions Act 2008 automatic-enrolment duties, including s3; scheme rules and the employment contract; Pensions Act 1995 s67 if accrued rights are affected; Imperial and IBM are relevant to employer powers and good-faith/rationality limits in scheme-change contexts.",
    application: (projection) =>
      `Your record shows employer contributions of ${formatPct(appState.employerContributionPct)}, about ${formatMoney(projection.employerMonthly)} per month. The first question is whether the promised rate is contractual, discretionary, or only the statutory minimum on qualifying earnings.`,
    conclusion:
      "Likely not lawful if the employer is simply failing to meet auto-enrolment minimums or a contractual/scheme-rule promise. Potentially lawful if it is a properly notified future change that still satisfies minimum duties and any consultation requirements.",
    documents: ["contract", "pension policy", "auto-enrolment letter", "scheme booklet", "recent payslips", "notice of change"],
    help: "Escalate if the change is retrospective, unexplained, or pushes contributions below minimum duties.",
  },
  {
    id: "missing-contributions",
    category: "Payroll",
    question: "My payslip deducts pension but the provider does not show it. Is that legal?",
    label: "Payslip deduction or missing provider contribution",
    triggers: [
      "payslip",
      "deduct",
      "deduction",
      "provider does not show",
      "not show it",
      "missing contribution",
      "not paid",
      "not passed on",
      "provider record",
      "contribution schedule",
    ],
    answer:
      "Potentially unlawful if deductions or employer contributions are not paid to the scheme, but first rule out payroll timing and provider processing delays.",
    basis:
      "Pensions Act 2008 employer duties; Pensions Act 2004 and The Pensions Regulator enforcement framework; individual disputes may also go through the scheme/provider complaints process and the Pensions Ombudsman route under Pension Schemes Act 1993 ss145-152.",
    application: () => {
      const mismatch = getContributionMismatch();
      return `Your record shows ${formatMoney(appState.payslipContribution)} deducted from payslip and ${formatMoney(appState.providerContribution)} shown by provider. The current record difference is about ${formatMoney(Math.abs(mismatch))}. Ask payroll for a period-by-period reconciliation.`;
    },
    conclusion:
      "Likely a serious issue if there is no timing explanation and the contribution remains missing. The practical first step is written reconciliation from payroll and provider before complaint escalation.",
    documents: ["payslips", "provider transaction history", "payroll emails", "contribution schedule", "bank/payment dates"],
    help: "If unresolved, use the provider/employer complaint route and consider The Pensions Ombudsman or The Pensions Regulator depending on whether it is an individual dispute or employer compliance issue.",
  },
  {
    id: "opt-out-pressure",
    category: "Employer duty",
    question: "My manager told me to opt out of the pension. Can they do that?",
    label: "Opt-out pressure",
    triggers: ["opt out", "opt-out", "told to opt", "pressure to leave", "leave the pension", "forced out", "inducement"],
    answer:
      "No, an employer should not pressure or induce a worker to opt out of automatic enrolment or penalise pension membership.",
    basis:
      "Pensions Act 2008 automatic-enrolment framework and employer compliance duties; The Pensions Regulator can take action on inducement and non-compliance.",
    application: () =>
      `Your record lists main concern as '${appState.mainConcern}'. If pressure came from ${appState.employerName || "the employer"}, keep the wording, date, speaker and any link to pay, hours or promotion.`,
    conclusion:
      "Likely unlawful if the employer or manager is steering you to opt out or making pension membership disadvantageous. Ask for the instruction in writing and keep evidence.",
    documents: ["messages", "meeting notes", "HR policy", "opt-out notice", "contract", "payslips"],
    help: "Escalate quickly if pressure continues or your job treatment is linked to opting out.",
  },
  {
    id: "auto-enrolment",
    category: "Eligibility",
    question: "Am I eligible for automatic enrolment and minimum contributions?",
    label: "Automatic enrolment eligibility",
    triggers: [
      "auto enrol",
      "auto-enrol",
      "automatic enrol",
      "eligible",
      "qualifying earnings",
      "earnings trigger",
      "minimum contribution",
    ],
    answer:
      "Potentially yes if you are a worker of the right age and earn above the trigger in that employment. The minimum is usually assessed on qualifying earnings unless another valid basis is used.",
    basis:
      "Pensions Act 2008 automatic-enrolment duties, including s3; qualifying earnings concepts are used in the statutory minimum framework.",
    application: () => {
      const eligibility = getEligibilitySnapshot();
      return `Your main job income is ${formatMoney(appState.jobOne)}. Using the 2026/27 annual thresholds in this app, the current route reads as '${eligibility.route}' and the current earnings band reads as '${eligibility.earningsBand}'.`;
    },
    conclusion:
      "Ask payroll for the exact age, worker-status and pensionable-pay assessment in writing. The route can move between automatic enrolment, opt-in and join-right depending on those facts.",
    documents: ["contract", "auto-enrolment letter", "payslips", "payroll contribution basis", "scheme joining letter"],
    help: "Use professional help if worker status is disputed or the employer says you are outside the scheme despite regular earnings.",
  },
  {
    id: "multiple-jobs",
    category: "Eligibility",
    question: "I have multiple jobs. Should my pension earnings be combined?",
    label: "Multiple jobs and qualifying earnings",
    triggers: ["multiple jobs", "second job", "two jobs", "part-time jobs", "combine earnings", "job by job"],
    answer:
      "Usually no for automatic-enrolment trigger purposes: each employment is commonly assessed job by job, though each employer may have separate duties.",
    basis:
      "Pensions Act 2008 automatic-enrolment duties apply through each employer relationship; the practical check is each employment's worker status, age and earnings.",
    application: () =>
      `Your record has ${formatMoney(appState.jobOne)} for the main job and ${formatMoney(appState.jobTwo)} for the second job. The second job may fall below the trigger even when combined household earnings are higher.`,
    conclusion:
      "Likely each job needs its own eligibility and contribution check. Ask both employers for their auto-enrolment assessment and contribution basis.",
    documents: ["payslips for each job", "contracts", "auto-enrolment letters", "provider membership records"],
    help: "Get advice if either employer treats you as self-employed or outside worker status when the reality looks different.",
  },
  {
    id: "self-employed",
    category: "Eligibility",
    question: "I am self-employed. What pension should I use?",
    label: "Self-employed pension choice",
    triggers: ["self-employed", "self employed", "sole trader", "freelance", "contractor pension", "no employer pension"],
    answer:
      "There is usually no employer automatic-enrolment contribution for genuinely self-employed income, so the planning route is normally a personal pension or other retirement saving.",
    basis:
      "Pensions Act 2008 automatic-enrolment duties attach to employer/worker relationships. Personal pension contributions are usually governed by provider terms and tax-relief rules.",
    application: () =>
      `Your record employment type is ${getEmploymentLabel()}. If you are genuinely self-employed, the current employer contribution field should be treated as a planning assumption, not an employer duty.`,
    conclusion:
      "Likely you need to choose contribution level, provider, charges and tax-relief route yourself. If your 'self-employed' status is imposed by a company but you work like a worker, status may be arguable.",
    documents: ["provider fee schedule", "tax-relief explanation", "income records", "contractor agreement", "employment-status evidence"],
    help: "Use regulated financial advice for provider/investment choice and legal advice if employment status is disputed.",
    boundary: "Financial guidance and legal information only, not regulated financial or legal advice.",
  },
  {
    id: "pensionable-pay",
    category: "Pay basis",
    question: "What does pensionable pay mean and can my employer exclude overtime or bonus?",
    label: "Pensionable pay and salary sacrifice",
    triggers: [
      "pensionable pay",
      "qualifying earnings",
      "salary sacrifice",
      "bonus",
      "overtime",
      "commission",
      "basic salary",
      "pay basis",
    ],
    answer:
      "Potentially yes, depending on scheme rules and the statutory basis. Pensionable pay is not always the same as total pay.",
    basis:
      "Scheme rules and contract govern the agreed pensionable-pay definition; Pensions Act 2008 qualifying earnings may set a minimum framework for automatic enrolment.",
    application: () =>
      `Your record currently says the pensionable pay basis is '${appState.pensionablePayBasis}'. If your contribution looks low, the issue may be whether it is based on basic salary, qualifying earnings, or total earnings.`,
    conclusion:
      "Likely lawful if the exclusion matches scheme rules and minimum duties. Arguable if the employer uses a different basis from the contract, booklet, joining letter or statutory minimum.",
    documents: ["scheme booklet", "contract", "salary sacrifice agreement", "payslip", "payroll calculation"],
    help: "Get advice if a large pay element is excluded despite wording promising pension on total pay.",
  },
  {
    id: "unknown-scheme",
    category: "Scheme ID",
    question: "I do not know whether my pension is DC or DB. What should I check?",
    label: "Unknown scheme type",
    triggers: ["do not know", "don't know", "dc or db", "scheme type", "what pension am i", "pension type", "unknown scheme"],
    answer:
      "The app should not guess. You identify the scheme type from documents: pot/fund value usually points to DC wording; final salary, career average, accrual rate or pensionable service usually points to DB wording.",
    basis:
      "Scheme rules, member statement and provider documents are the source of the member's actual rights. The Pension Schemes Act 1993 and scheme-specific rules use technical labels that should be checked against the actual document wording.",
    application: () =>
      `Your dashboard currently says ${getPlanLabel()}. If that is wrong or unknown, change it manually after checking documents, or ask the provider to confirm the arrangement in writing.`,
    conclusion:
      "Conclusion: do not treat the assistant as identifying the scheme. Use it to generate the right questions for the employer or provider and then confirm from the scheme documents.",
    documents: ["statement heading", "scheme booklet", "employer portal", "provider letter", "payslip", "terms such as pot value, fund value, final salary, career average or accrual rate"],
    help: "If documents conflict, ask the provider for a written confirmation of scheme type and benefit basis.",
    boundary: "Information only. The app does not make a binding scheme classification.",
  },
  {
    id: "dc-basics",
    category: "Fundamentals",
    question: "What legal and financial points matter most in a DC pension?",
    label: "DC pension essentials",
    triggers: ["defined contribution", "dc pension", "dc scheme", "fund value", "pot value", "investment choice", "default fund"],
    answer:
      "A DC pension is mainly a pot-based arrangement. The key legal/financial checks are contributions, charges, investment choice, default fund, retirement access and transfer restrictions.",
    basis:
      "Member rights come from the scheme rules/contract and provider terms; occupational scheme investment duties may involve Pensions Act 1995 ss33-36A and s117 where trustees control assets.",
    application: () =>
      `Your record currently shows ${formatMoney(appState.currentPot)} in the current pot and combined contributions of ${formatPct(appState.employerContributionPct + appState.employeeContributionPct)} of salary.`,
    conclusion:
      "Likely the biggest practical risk is not legal entitlement but under-contribution, high charges, poor fund fit, missing pots, or misunderstanding drawdown risk.",
    documents: ["annual statement", "charges summary", "fund factsheet", "default fund description", "retirement options pack"],
    help: "Use regulated financial advice for investment selection, drawdown or tax-heavy decisions.",
    boundary: "Financial guidance only, not regulated financial advice.",
  },
  {
    id: "db-basics",
    category: "Fundamentals",
    question: "What legal and financial points matter most in a DB or final salary pension?",
    label: "DB pension essentials",
    triggers: ["defined benefit", "db pension", "final salary", "career average", "accrual rate", "pensionable service", "normal pension age"],
    answer:
      "A DB pension is mainly a promised-benefit arrangement. The key questions are pensionable service, pensionable salary, accrual rate, normal pension age, increases, spouse benefits and scheme amendment rules.",
    basis:
      "Scheme rules define the promise; Pensions Act 1995 s67 protects subsisting rights against certain detrimental modifications; PPF legislation may matter if the employer/scheme fails.",
    application: () =>
      `Your record says ${getPlanLabel()}. If the scheme is DB, the current pot number may be less important than the promised benefit formula and service record.`,
    conclusion:
      "Likely the highest-risk mistakes are treating DB like a DC pot, transferring without advice, or missing rule changes/equalisation issues.",
    documents: ["scheme booklet", "benefit statement", "service record", "normal pension age rule", "increase rule", "spouse/dependant benefit wording"],
    help: "DB transfer, closure, equalisation or large-value disputes should go to regulated advice or legal advice.",
  },
  {
    id: "hybrid-basics",
    category: "Fundamentals",
    question: "My pension says hybrid. What does that mean?",
    label: "Hybrid pension essentials",
    triggers: ["hybrid", "cash balance", "db and dc", "mixed pension", "underpin"],
    answer:
      "Hybrid usually means the arrangement has both promise-based and pot-based features, or an underpin/guarantee attached to a pot.",
    basis:
      "The legal answer turns on the scheme wording, not the label. Section 67 Pensions Act 1995 may matter if a protected promise is changed.",
    application: () =>
      `Your record says ${getPlanLabel()}. Keep the DB-like promise and DC-like pot separate when asking questions or checking projections.`,
    conclusion:
      "Potentially valuable guarantees can be missed if the scheme is treated as ordinary DC. Ask the provider exactly what is guaranteed and what is investment-linked.",
    documents: ["hybrid benefit statement", "underpin wording", "pot/fund statement", "accrual or guarantee explanation"],
    help: "Use professional advice before transferring or giving up any underpin or guarantee.",
  },
  {
    id: "state-pension",
    category: "State Pension",
    question: "Can I rely only on the State Pension?",
    label: "State Pension and private pension gap",
    triggers: ["state pension", "national insurance", "ni record", "state-only", "state pension only"],
    answer:
      "You can rely on State Pension only if it meets your retirement needs, but it is not a private pot, it is not automatic, and many people will still need other retirement income.",
    basis:
      `State Pension entitlement depends on your National Insurance record and government forecast rules rather than workplace scheme rules. In the simple new-State-Pension model, you usually need at least ${STATE_PENSION_MIN_QUALIFYING_YEARS} qualifying years for any amount, the full 2026/27 rate is ${formatPreciseMoney(
        FULL_NEW_STATE_PENSION_WEEKLY_2026_27
      )} / week, and the amount between ${STATE_PENSION_MIN_QUALIFYING_YEARS} and ${STATE_PENSION_FULL_RATE_YEARS} years is often explained as about 1/35 of the full weekly rate for each qualifying year. Contracted-out or pre-2016 histories can differ.`,
    application: (projection) =>
      `Your record uses a State Pension forecast of ${formatMoney(appState.statePension)} per year against a target of ${formatMoney(
        projection.displayTargetYearlyIncome ?? projection.targetYearlyIncome
      )} per year in the selected money view.`,
    conclusion:
      "Likely State Pension alone will not meet the entered target unless the target is low or other savings exist. Check your official forecast, NI record, and State Pension age, and remember you have to claim it.",
    documents: ["State Pension forecast", "National Insurance record", "workplace/private pension statements"],
    help: "Use MoneyHelper or official forecast tools for State Pension records; regulated advice may be needed for retirement planning.",
    boundary: "Financial guidance only, not regulated financial advice.",
  },
  {
    id: "transfer-consolidation",
    category: "Transfers",
    question: "Can I transfer or consolidate my pensions?",
    label: "Transfer and consolidation risk",
    triggers: ["transfer", "consolidate", "move my pension", "combine pensions", "old pot", "deferred pot", "small pot", "transfer value"],
    answer:
      "Potentially yes for many DC pots, but not automatically sensible. You may lose guarantees, protected pension ages, lower charges, fund options or DB protections.",
    basis:
      "Transfer rights and restrictions sit in pensions legislation and scheme/provider rules; DB transfers and safeguarded benefits can trigger regulated-advice requirements.",
    application: () =>
      `Your record includes active and deferred pension records. Before moving a small pot, compare charges and protections rather than using size alone as the reason.`,
    conclusion:
      "Likely sensible only after checking charges, guarantees, exit fees, protected ages and investment options. DB or safeguarded benefits should be treated as advice-required territory.",
    documents: ["transfer pack", "charges summary", "guarantees", "protected pension age wording", "exit fees", "receiving scheme details"],
    help: "Get regulated financial advice for DB transfers, safeguarded benefits or high-value decisions.",
  },
  {
    id: "db-transfer",
    category: "Transfers",
    question: "Should I transfer my DB or final salary pension?",
    label: "DB transfer warning",
    triggers: ["db transfer", "defined benefit transfer", "final salary transfer", "cash equivalent transfer", "cetv", "transfer my db"],
    answer:
      "Usually treat this as high risk. A transfer may be legally possible, but giving up a promised income can be a major irreversible decision.",
    basis:
      "DB/safeguarded-benefit transfer rules, scheme rules and regulated financial-advice requirements; the underlying DB promise is governed by the scheme rules.",
    application: () =>
      `Your record says ${getPlanLabel()}. If any part is DB, do not use the dashboard projection alone to decide whether to transfer.`,
    conclusion:
      "Likely not a do-it-yourself decision. The safer conclusion is to obtain regulated advice before giving up DB income, spouse benefits or inflation-linked increases.",
    documents: ["CETV statement", "scheme booklet", "spouse benefit", "increase rules", "normal pension age", "advice requirement notice"],
    help: "Use a regulated pension transfer adviser where required.",
  },
  {
    id: "charges",
    category: "DC checks",
    question: "What charges or default fund questions should I ask my provider?",
    label: "Charges and default fund",
    triggers: ["charges", "fees", "default fund", "fund choice", "investment", "performance", "provider questions", "ask provider"],
    answer:
      "Ask for total charges, fund choice, default strategy, investment risk, past performance, contribution history and any transfer costs.",
    basis:
      "Provider terms, scheme governance documents and member disclosure materials govern what you are shown; occupational scheme trustees also have investment-duty obligations where relevant.",
    application: () =>
      `For ${appState.schemeName || "your provider"}, connect charges to your target gap: even small annual charges can matter over ${Math.max(0, appState.retireAge - appState.age)} years.`,
    conclusion:
      "Likely the most practical provider questions are charges, fund allocation, default fund target retirement age, contribution records and transfer restrictions.",
    documents: ["charges summary", "fund factsheet", "statement", "default investment strategy", "provider transaction list"],
    help: "Use regulated advice if choosing investments or moving funds would materially affect retirement plans.",
    boundary: "Financial guidance only, not regulated financial advice.",
  },
  {
    id: "barber-equalisation",
    category: "Equality",
    question: "Is my pension equalised after Barber and what is a Barber window?",
    label: "Equal benefits and Barber window",
    triggers: ["barber", "barber window", "equal benefits", "equalise", "equalised", "equalisation", "normal retirement age", "men and women", "sex equality"],
    answer:
      "Potentially. Occupational pension benefits are treated as pay for sex-equality purposes, but the answer depends on service period, scheme wording, equalisation notices and any Barber-window period.",
    basis:
      "Article 157 TFEU; Barber v Guardian Royal Exchange Assurance Group (C-262/88); Coloroll Pension Trustees Ltd v Russell (C-200/91); Equality Act 2010 ss61, 62, 64-71 and Sch 7; Equality Act 2010 (Sex Equality Rule) (Exceptions) Regulations 2010; Safeway Ltd v Newton on equalisation timing.",
    application: () =>
      `This is mainly relevant if ${appState.schemeName || "the scheme"} has DB/final salary/career average service, different normal pension ages, or sex-differentiated benefit terms. For ordinary DC pots, Barber is usually less central.`,
    conclusion:
      "Conclusion: potentially arguable if your scheme had different male/female pension ages or benefits during the relevant service period. You need the scheme's equalisation history before saying yes or no.",
    documents: ["scheme rules before and after 17 May 1990", "equalisation notice", "normal pension age rule", "benefit statement by service period", "trustee announcements"],
    help: "Get pensions-law advice if Barber-window service, normal pension age or unequal benefits affect a material DB benefit.",
  },
  {
    id: "gmp-equalisation",
    category: "Equality",
    question: "What is GMP equalisation and could it affect my benefits?",
    label: "GMP equalisation",
    triggers: ["gmp", "guaranteed minimum pension", "gmp equalisation", "lloyds", "contracted-out", "contracting out"],
    answer:
      "Potentially yes if you have contracted-out DB service with Guaranteed Minimum Pension differences. It is a specialist equalisation calculation, not a general DC issue.",
    basis:
      "Lloyds Banking Group Pensions Trustees Ltd v Lloyds Bank plc decisions on GMP equalisation; Equality Act 2010 sex equality rule framework; scheme rules and contracted-out benefit records.",
    application: () =>
      `If ${appState.schemeName || "your scheme"} is DB, hybrid, or has contracted-out service, ask whether GMP equalisation has been completed and whether any past transfer was affected.`,
    conclusion:
      "Likely relevant only if your scheme has GMP/contracted-out DB benefits. If relevant, the provider should explain whether your statement already includes any equalisation adjustment.",
    documents: ["contracted-out service record", "GMP statement", "equalisation update", "transfer history", "benefit calculation"],
    help: "Use scheme/provider technical support or legal advice if GMP affects a transfer, divorce calculation or retirement quote.",
  },
  {
    id: "discrimination",
    category: "Equality",
    question: "Can pension benefits discriminate because of sex, age, disability or marital status?",
    label: "Pension discrimination and equal treatment",
    triggers: ["discriminate", "discrimination", "equal treatment", "sex discrimination", "age discrimination", "disability", "married", "civil partner", "same sex"],
    answer:
      "Potentially unlawful, but pension equality rules have specific exceptions and technical benefit rules, so the protected characteristic and benefit term matter.",
    basis:
      "Equality Act 2010 ss13, 39, 61, 62, 64-71 and Sch 7; Directive 2000/78/EC; Directive 2006/54/EC; Brewster [2017] UKSC 8 for survivor benefit nomination issues in a public-sector context.",
    application: () =>
      `For ${appState.userName || "you"}, identify the exact unequal term: contribution rate, normal pension age, spouse/dependant benefit, survivor nomination, ill-health rule or actuarial factor.`,
    conclusion:
      "Potentially arguable if the rule treats members differently because of a protected characteristic and no pension-specific exception or objective justification applies.",
    documents: ["scheme rule", "benefit quote", "survivor/dependant rule", "actuarial factor note", "correspondence explaining the reason"],
    help: "Get legal advice for discrimination, survivor benefit or actuarial-factor disputes.",
  },
  {
    id: "tupe",
    category: "Employment transfer",
    question: "If my employment transfers to a new employer, what happens to my pension?",
    label: "TUPE and pension protection",
    triggers: ["tupe", "transfer of employment", "new employer", "business transfer", "outsourcing", "insourcing"],
    answer:
      "Potentially protected, but ordinary old-age pension rights are treated differently from some early-retirement/redundancy pension rights. New-employer pension protection can also arise under specific regulations.",
    basis:
      "TUPE Regulations 2006 regs 4, 5 and 10; Pensions Act 2004 ss257-258; Transfer of Employment (Pension Protection) Regulations 2005; Beckmann v Dynamco and Martin v South Bank University on certain pension-related benefits.",
    application: () =>
      `If ${appState.employerName || "your employer"} changes because of a transfer, ask what pension promise the incoming employer is offering and whether it matches current contribution/value protection.`,
    conclusion:
      "Conclusion: not a simple yes/no. Basic old-age occupational pension rights may be excluded from ordinary TUPE transfer, but pension protection rules and Beckmann/Martin-type benefits can still matter.",
    documents: ["TUPE information letter", "old and new pension terms", "measure statement", "consultation documents", "scheme comparison"],
    help: "Get employment/pensions advice before agreeing to a materially worse post-transfer pension position.",
  },
  {
    id: "ppf",
    category: "Employer insolvency",
    question: "What happens if my employer or DB pension scheme goes into the PPF?",
    label: "Employer insolvency and PPF",
    triggers: [
      "ppf",
      "pension protection fund",
      "goes into the ppf",
      "db pension scheme goes into",
      "employer insolvent",
      "scheme insolvent",
      "insolvency",
      "compensation",
      "assessment period",
    ],
    answer:
      "Potentially the Pension Protection Fund may provide compensation for eligible DB occupational schemes, but it is not the same as receiving every scheme benefit in full.",
    basis:
      "Pensions Act 2004 ss126-131, ss143-145, ss160-162 and Sch 7; Directive 2008/94/EC Article 8; Robins, Hampshire, Hughes and related PPF compensation cases.",
    application: () =>
      `This matters most if ${appState.schemeName || "your scheme"} is DB or hybrid. A DC pot is normally different because it is an individual pot rather than an employer DB promise.`,
    conclusion:
      "Likely a protection route for eligible DB schemes, but benefit levels, caps/compensation rules and indexation can differ from the original scheme promise.",
    documents: ["PPF assessment notice", "scheme funding statement", "benefit statement", "retirement status", "PPF compensation estimate"],
    help: "Get specialist advice if insolvency, scheme funding or PPF compensation materially affects retirement income.",
  },
  {
    id: "employer-debt",
    category: "Scheme funding",
    question: "What does employer debt or section 75 mean for a pension scheme?",
    label: "Employer debt and scheme funding",
    triggers: ["section 75", "s75", "employer debt", "funding deficit", "scheme deficit", "financial support direction", "contribution notice", "moral hazard"],
    answer:
      "It usually concerns employer/sponsor liability to support a DB scheme, not an ordinary member contribution question. It can still affect scheme security.",
    basis:
      "Pensions Act 1995 ss75 and 75A; Occupational Pension Schemes (Employer Debt) Regulations 2005; Pensions Act 2004 ss38-51 contribution notice and financial support direction framework.",
    application: () =>
      `If your arrangement is ${getPlanLabel()}, section 75 language is most relevant to DB or multi-employer DB funding rather than a straightforward DC pot.`,
    conclusion:
      "Likely a scheme/sponsor funding issue. Members should ask trustees/provider for the funding position and whether any corporate transaction affects scheme support.",
    documents: ["summary funding statement", "valuation", "employer notices", "trustee update", "corporate transaction notice"],
    help: "Specialist pensions-law advice is needed for employer-debt or moral-hazard issues.",
  },
  {
    id: "trustee-investment",
    category: "Trustees",
    question: "Can trustees choose risky, ethical or climate investments for my pension?",
    label: "Trustee investment duties",
    triggers: ["trustee", "investment duty", "ethical", "climate", "esg", "cowan", "scargill", "green", "risky investment"],
    answer:
      "Potentially yes, but trustees must act within their powers, for proper purposes, and in members' financial interests unless the law and scheme context allow wider factors.",
    basis:
      "Pensions Act 1995 ss33-36A and s117; Pensions Act 2004 s255; Cowan v Scargill, Harries/Bishop of Oxford, Palestine Solidarity Campaign and modern climate-governance materials.",
    application: () =>
      `For ${appState.schemeName || "your scheme"}, the practical question is whether the investment is trustee-selected, default-fund selected by provider, or chosen by you in a DC fund menu.`,
    conclusion:
      "Likely lawful where trustees follow proper process, consider relevant financial risks and comply with investment regulations. Arguable if they ignore material risks, conflicts or scheme purposes.",
    documents: ["statement of investment principles", "default fund policy", "fund factsheet", "trustee investment update", "climate report if applicable"],
    help: "Use the scheme complaint route or legal advice if trustee process or conflicts are central.",
  },
  {
    id: "death-benefits",
    category: "Benefits",
    question: "Who gets my pension if I die and should I update my nomination?",
    label: "Death and survivor benefits",
    triggers: ["death benefit", "nomination", "expression of wish", "spouse", "partner", "survivor", "dependant", "beneficiary"],
    answer:
      "It depends on scheme rules. A nomination is important but may not be legally binding if trustees or the provider have discretion. For private pensions, a separate estate-planning change is planned from 6 April 2027: most unused pension funds and pension death benefits are due to come into scope of Inheritance Tax.",
    basis:
      "Scheme rules and trust or provider discretion govern death benefits; equality and survivor-benefit issues may engage Equality Act 2010 and cases such as Brewster where nomination or partner rules are disputed. HMRC's current 2025 to 2027 policy papers also say most unused pension funds and pension death benefits will move into estate IHT scope from 6 April 2027, while registered death-in-service benefits stay out and spouse, civil-partner or charity exemptions remain.",
    application: () =>
      `Your record does not yet store beneficiaries. Add this as a next action for ${appState.schemeName || "your provider"} if death benefits matter to your planning, and separate State Pension from any private-pension death-benefit discussion.`,
    conclusion:
      "Likely the practical answer is to update the expression of wish, check spouse, civil partner, cohabiting partner and dependant rules, and re-check estate planning if unused private pension wealth is material. State Pension is separate, and most estates still will not pay IHT.",
    documents: ["expression of wish form", "death benefit rule", "spouse/dependant rule", "beneficiary confirmation", "estate or IHT note"],
    help: "Get advice for disputed survivor benefits, divorce, cohabitation, large death benefits or estate-planning questions.",
  },
  {
    id: "retirement-access",
    category: "Retirement choices",
    question: "Can I take money out of my pension early or choose drawdown?",
    label: "Retirement access, drawdown and tax",
    triggers: ["take money out", "withdraw", "early retirement", "drawdown", "annuity", "tax free cash", "lump sum", "access pension"],
    answer:
      "Potentially, but access depends on age, scheme rules, tax rules and product options. Early access can trigger tax and scam risks.",
    basis:
      "Finance Act 2004 registered pension tax framework and scheme/provider rules; DB early-retirement terms are scheme-specific.",
    application: () =>
      `Your dashboard assumes ${formatPct(appState.drawdownPct)} yearly drawdown from projected private wealth. That is only an illustration, not an access recommendation.`,
    conclusion:
      "Likely you should check available options, tax impact and sustainability before withdrawing. Pension Wise or regulated advice is sensible before major access decisions.",
    documents: ["retirement options pack", "tax-free cash quote", "drawdown charges", "annuity quote", "early-retirement factors"],
    help: "Use Pension Wise, MoneyHelper or regulated financial advice before accessing pension savings.",
    boundary: "Financial guidance only, not regulated financial advice.",
  },
  {
    id: "ill-health",
    category: "Benefits",
    question: "Can I retire early because of ill health?",
    label: "Ill-health early retirement",
    triggers: ["ill health", "ill-health", "medical retirement", "incapacity", "disabled", "serious illness"],
    answer:
      "Potentially yes if the scheme rules and medical evidence satisfy the ill-health criteria. The test varies by scheme.",
    basis:
      "Scheme rules, trustee/provider discretion and tax rules for registered pension schemes; decision-making may be challenged if process is irrational or ignores relevant evidence.",
    application: () =>
      `For ${appState.schemeName || "your provider"}, ask for the exact ill-health definition, medical evidence requirement and appeal route before applying.`,
    conclusion:
      "Likely fact-sensitive. A strong medical record and the precise scheme-rule test matter more than general hardship.",
    documents: ["ill-health rule", "medical reports", "occupational health report", "decision letter", "appeal route"],
    help: "Get advice if the decision ignores medical evidence or applies the wrong test.",
  },
  {
    id: "complaints",
    category: "Escalation",
    question: "Where do I complain if my pension issue is not resolved?",
    label: "Complaints and escalation",
    triggers: ["complain", "complaint", "ombudsman", "escalate", "regulator", "moneyhelper", "pension wise", "legal advice"],
    answer:
      "Start with written clarification and the scheme/provider complaint process. Then choose the route depending on whether the issue is individual maladministration/dispute, employer compliance, financial advice, or legal claim.",
    basis:
      "Pension Schemes Act 1993 ss145-152 for the Pensions Ombudsman framework; The Pensions Regulator handles employer/compliance issues; FCA/Financial Ombudsman routes may matter for regulated advice/provider conduct.",
    application: () =>
      `Your current concern is '${appState.mainConcern}'. Build a dated evidence bundle before escalating so the issue is clear.`,
    conclusion:
      "Likely route: employer/payroll/provider in writing first, formal complaint next, Ombudsman/regulator/advice route after that depending on the issue.",
    documents: ["timeline", "contract", "scheme booklet", "payslips", "provider records", "complaint letters", "final response"],
    help: "Use legal advice where the question is high value, time-sensitive, discriminatory, or about scheme-rule interpretation.",
  },
  {
    id: "scams",
    category: "Transfers",
    question: "How do I know if a pension transfer or investment is a scam?",
    label: "Pension scam warning",
    triggers: ["scam", "cold call", "high return", "overseas investment", "unlock pension", "loan", "free pension review", "suspicious transfer"],
    answer:
      "Treat it as high risk if there is pressure, cold contact, unrealistic returns, early-access promises, overseas structures or unclear adviser authorisation.",
    basis:
      "Transfer due-diligence rules, provider scam warnings and regulated-advice requirements; unauthorised early access can create serious tax consequences under the registered-pension tax regime.",
    application: () =>
      `Do not move money from ${appState.schemeName || "your provider"} until you verify the receiving scheme, adviser authorisation and any warning flags.`,
    conclusion:
      "Likely unsafe if the offer promises quick access before normal pension age or guaranteed high returns. Pause and verify before signing anything.",
    documents: ["transfer forms", "adviser FCA details", "receiving scheme details", "fee schedule", "risk warnings"],
    help: "Use MoneyHelper, FCA register checks and regulated advice before transferring.",
  },
];

const frequentQuestionRules = [
  {
    id: "scenario-retire-later",
    category: "Scenario modelling",
    question: "What happens if I retire 2 years later?",
    label: "Retire later scenario",
    patterns: [["what happens if", "retire", "later"], ["if i retire", "later"]],
    pensionType: "Illustrative scenario modelling using the current projection assumptions.",
    action: "Compare the current path with a later-retirement version of the same record.",
    answer: "Retiring later usually gives the pot more time to grow and more time for contributions to be paid in.",
    basis: "Same projection assumptions for this record, adjusted only for the scenario being tested.",
    conclusion: "Use the scenario modeller to compare how much later retirement changes the projected pot and income.",
    documents: ["latest statement", "retirement age assumption", "target-income working"],
    help: "Use financial advice if a retirement-timing decision is material or irreversible.",
    boundary: "Financial guidance only, not regulated financial advice.",
  },
  {
    id: "scenario-raise-contributions",
    category: "Scenario modelling",
    question: "What happens if I raise my pension contributions?",
    label: "Raise contributions scenario",
    patterns: [["what happens if", "raise", "contribution"], ["if i increase", "contribution"]],
    pensionType: "Illustrative scenario modelling using the current projection assumptions.",
    action: "Compare the current path with a higher-contribution version of the same record.",
    answer: "Higher contributions usually improve the projected retirement pot and income, especially over long time periods.",
    basis: "Same projection assumptions for this record, adjusted only for the scenario being tested.",
    conclusion: "Small contribution changes can compound materially over time, but affordability still matters now.",
    documents: ["latest payslip", "provider statement", "budget/affordability check"],
    help: "Use financial advice before making large contribution or investment changes.",
    boundary: "Financial guidance only, not regulated financial advice.",
  },
  {
    id: "scenario-pause-saving",
    category: "Scenario modelling",
    question: "What happens if I pause pension saving for a year?",
    label: "Pause saving scenario",
    patterns: [["what happens if", "pause", "saving"], ["if i pause", "contribution"]],
    pensionType: "Illustrative scenario modelling using the current projection assumptions.",
    action: "Compare the current path with a temporary contribution pause.",
    answer: "Pausing pension saving can reduce the final pot both because less money goes in and because that money loses time to grow.",
    basis: "Same projection assumptions for this record, adjusted only for the scenario being tested.",
    conclusion: "A short pause can have a longer-term effect than it first appears because of compounding.",
    documents: ["latest statement", "contribution record", "budget/affordability check"],
    help: "Use financial guidance or advice if affordability pressure may force a pension pause.",
    boundary: "Financial guidance only, not regulated financial advice.",
  },
  {
    id: "scenario-lower-earnings",
    category: "Scenario modelling",
    question: "What happens if my earnings fall?",
    label: "Lower earnings scenario",
    patterns: [["what happens if", "earn"], ["if my", "earnings", "fall"], ["if i", "earn less"]],
    pensionType: "Illustrative scenario modelling using the current projection assumptions.",
    action: "Compare the current path with a lower-earnings version of the same record.",
    answer: "Lower earnings usually reduce the monthly amount going into the pension if contribution percentages stay the same.",
    basis: "Same projection assumptions for this record, adjusted only for the scenario being tested.",
    conclusion: "Lower pay can affect both short-term affordability and long-term retirement income.",
    documents: ["updated pay figure", "contribution basis", "budget/affordability check"],
    help: "Use financial guidance if a pay change affects pension affordability or retirement timing.",
    boundary: "Financial guidance only, not regulated financial advice.",
  },
  {
    id: "ae-rights",
    category: "Joining",
    question: "Do I have a legal right to a workplace pension?",
    label: "Workplace pension rights",
    patterns: [
      "legal right to a workplace pension",
      ["employer", "put me", "pension"],
      ["employer", "have to", "pension scheme"],
      ["employer", "refuse", "join"],
      ["can my employer refuse", "join"],
      ["cannot refuse", "join"],
      ["eligible", "automatic enrol"],
      ["under 22", "pension"],
      ["over state pension age", "pension"],
      ["state pension age", "join"],
      ["earn less", "10000"],
      ["less than", "10000"],
      ["ask to join", "pension"],
      ["not automatically enrolled", "join"],
      ["opt in", "employer contribute"],
      ["very low earnings", "contribute"],
    ],
    pensionType: "Automatic enrolment workplace pension.",
    action: "The employer is assessing, enrolling, postponing, or allowing the worker to opt in/join.",
    answer:
      "Yes if you are an eligible worker. If you are not automatically enrolled, you may still have an opt-in or joining right, but employer contributions depend on your age and earnings category.",
    basis:
      "Pensions Act 2008 automatic-enrolment duties and TPR/GOV.UK guidance. Eligible workers are generally workers aged 22 to State Pension age, earning at least GBP10,000 a year and usually working in the UK.",
    conclusion:
      "Likely yes if the statutory criteria are met. If you are under 22, over State Pension age, or below GBP10,000, automatic enrolment may not apply, but you can usually ask to join or opt in.",
    documents: ["contract or worker-status documents", "auto-enrolment letter", "payslips", "scheme joining notice"],
    help: "Use TPR or legal advice if the employer says you are outside the scheme despite working like a worker.",
  },
  {
    id: "worker-status",
    category: "Joining",
    question: "Do zero-hours, agency, casual, apprentice, fixed-term or part-time workers get pension rights?",
    label: "Worker status and non-standard work",
    patterns: [
      ["zero hours", "pension"],
      ["zero-hours", "pension"],
      ["agency", "pension"],
      ["agency workers", "pension"],
      ["casual", "pension"],
      ["apprentice", "pension"],
      ["fixed-term", "pension"],
      ["fixed term", "pension"],
      ["part-time", "pension"],
      ["part time", "pension"],
      ["probation", "pension"],
      ["temporary", "exclude"],
      ["probation", "exclude"],
      ["work from home", "exclude"],
      ["hourly", "exclude"],
      ["irregular shifts", "exclude"],
    ],
    pensionType: "Automatic enrolment workplace pension.",
    action: "The employer is deciding whether the worker is in scope.",
    answer:
      "Usually yes if the person is a worker and meets the age and earnings criteria. Temporary, probationary, part-time, hourly, home-working or irregular-shift status does not by itself remove pension rights.",
    basis:
      "Pensions Act 2008 automatic-enrolment duties apply by worker status, age and earnings, not simply by job label.",
    conclusion:
      "Likely eligible if worker status and pay thresholds are met. The label used by the employer is not conclusive.",
    documents: ["contract", "rota/timesheets", "payslips", "agency terms", "auto-enrolment assessment"],
    help: "Get advice if the legal status is disputed or the employer uses the label to avoid pension duties.",
  },
  {
    id: "directors-contractors",
    category: "Joining",
    question: "Do directors, contractors or self-employed people get workplace pension rights?",
    label: "Directors, contractors and self-employment",
    patterns: [
      ["director", "automatic enrol"],
      ["director", "pension rights"],
      ["contractor", "workplace pension"],
      ["self-employed", "workplace pension"],
      ["self employed", "workplace pension"],
      ["called self-employed", "pension"],
      ["says i am self-employed", "pension"],
      ["false self-employment"],
      ["avoid pension duties"],
    ],
    pensionType: "Automatic enrolment, personal pension, or status dispute.",
    action: "The employer or engager is classifying the person as worker, employee, director, contractor or self-employed.",
    answer:
      "Potentially. Genuine self-employed people usually do not get employer automatic-enrolment contributions, but false self-employment can be challenged. Directors are special cases and depend on contract and worker status.",
    basis:
      "Pensions Act 2008 employer duties attach to worker relationships. Employment-status law and the contract decide whether the label matches reality.",
    conclusion:
      "Likely no employer duty for genuine self-employment; potentially yes if the person is really a worker or employee.",
    documents: ["contract", "working-practice evidence", "invoices/payslips", "control/substitution evidence", "auto-enrolment assessment"],
    help: "Use legal advice for status disputes because the answer is fact-sensitive.",
  },
  {
    id: "postponement-backdating",
    category: "Joining",
    question: "Can my employer delay enrolment, and what if they forgot to enrol me?",
    label: "Postponement and missed enrolment",
    patterns: [
      ["delay", "enrolling"],
      ["delay", "automatic enrol"],
      ["postpone", "automatic enrol"],
      ["postponement", "join"],
      ["forgot", "enrol"],
      ["backdate", "missed pension"],
      ["backdated", "missed contributions"],
      ["ask to join", "postponement"],
    ],
    pensionType: "Automatic enrolment workplace pension.",
    action: "The employer is postponing enrolment or correcting missed enrolment.",
    answer:
      "Yes, postponement can usually last up to 3 months if the worker is told in writing. If enrolment was missed, the employer may need to enrol you and correct missed contributions.",
    basis:
      "Pensions Act 2008 automatic-enrolment framework and TPR/GOV.UK guidance on postponement and compliance.",
    conclusion:
      "Likely lawful if written postponement is valid and you can still opt in during the period. Likely a correction issue if the employer simply forgot to enrol you.",
    documents: ["postponement notice", "auto-enrolment letter", "payslips", "payroll correction", "provider contribution record"],
    help: "Report unresolved missed enrolment or unpaid contributions to TPR.",
  },
  {
    id: "minimum-contributions",
    category: "Contributions",
    question: "How much must my employer pay into my pension?",
    label: "Minimum automatic-enrolment contributions",
    patterns: [
      ["how much", "employer pay", "pension"],
      ["minimum employer", "contribution"],
      ["total minimum", "contribution"],
      ["3%", "employer"],
      ["8%", "contribution"],
      ["legal minimum", "pension"],
      ["qualifying earnings", "minimum"],
    ],
    pensionType: "Usually automatic-enrolment DC workplace pension.",
    action: "The employer is calculating minimum contributions.",
    answer:
      "Usually at least 3% employer contribution and 8% total contribution on qualifying earnings in most automatic-enrolment DC schemes.",
    basis:
      "Pensions Act 2008 automatic-enrolment contribution framework and TPR/GOV.UK guidance. Qualifying earnings are usually between GBP6,240 and GBP50,270.",
    application: (projection) =>
      `Your record uses ${formatPct(appState.employerContributionPct)} employer and ${formatPct(appState.employeeContributionPct)} employee contributions, giving about ${formatMoney(projection.totalMonthly)} per month combined.`,
    conclusion:
      "Likely compliant on headline percentages if the employer pays at least 3% and total contributions reach 8% on the correct pay basis. Check whether the calculation uses qualifying earnings, basic pay, or another certified basis.",
    documents: ["payslip", "scheme contribution basis", "payroll calculation", "provider contribution history"],
    help: "Escalate if the employer pays less than the legal minimum or uses the wrong pay basis.",
  },
  {
    id: "pay-definition",
    category: "Contributions",
    question: "Should overtime, bonus, commission, sick pay or family leave pay count for pension contributions?",
    label: "Qualifying earnings and pensionable pay",
    patterns: [
      ["all my pay", "pension"],
      ["overtime", "pension"],
      ["bonus", "pension"],
      ["commission", "pension"],
      ["statutory sick pay", "pension"],
      ["maternity pay", "pension"],
      ["paternity pay", "pension"],
      ["adoption pay", "pension"],
      ["shared parental pay", "pension"],
      ["pensionable pay"],
      ["basic salary", "pension"],
    ],
    pensionType: "Automatic enrolment and scheme-specific pensionable pay.",
    action: "The employer is deciding what pay counts for contributions.",
    answer:
      "Potentially yes for qualifying earnings, because salary/wages, overtime, bonuses, commission and statutory sick/family pay can count. But pensionable pay under a scheme can be narrower if legally compliant.",
    basis:
      "Pensions Act 2008 qualifying earnings rules and the scheme rules/contract definition of pensionable pay.",
    application: () =>
      `Your record says the pay basis is '${appState.pensionablePayBasis}'. If a pay element is excluded, ask whether that is because the scheme uses qualifying earnings, basic salary, or another certified basis.`,
    conclusion:
      "Likely lawful if the scheme uses a valid basis and minimum contributions are met. Potentially arguable if the employer excludes pay contrary to the contract, booklet or statutory basis.",
    documents: ["scheme booklet", "contract", "payslips", "payroll contribution calculation", "bonus/overtime records"],
    help: "Get advice if excluded pay is large or the employer's calculation contradicts written terms.",
  },
  {
    id: "contribution-changes",
    category: "Contributions",
    question: "Can my employer change contribution rates or force me to reduce contributions?",
    label: "Changing contribution rates",
    patterns: [
      ["change", "contribution rates"],
      ["increase my pension contributions"],
      ["reduce its pension contributions"],
      ["reduce employer contributions"],
      ["pay more than", "minimum"],
      ["pay more", "minimum"],
      ["can i pay more"],
      ["reduce my own contributions"],
      ["force me", "reduce my contributions"],
      ["cash instead of pension"],
    ],
    pensionType: "Automatic enrolment, DC or contractual workplace pension.",
    action: "The employer or worker is changing contribution levels.",
    answer:
      "Potentially yes for future contributions if scheme rules, contract and consultation requirements are met, but the employer cannot reduce below statutory minimums where automatic enrolment applies. You can usually pay more if the scheme allows.",
    basis:
      "Pensions Act 2008 minimum duties; scheme rules and employment contract; Pensions Act 2004 consultation rules may apply for listed changes by larger employers.",
    conclusion:
      "Likely lawful for future changes only if the process is followed and minimum duties remain satisfied. Usually not lawful to force an employee to reduce contributions without a proper legal basis.",
    documents: ["contract", "scheme rules", "change notice", "consultation documents", "payslip"],
    help: "Get advice if the change is imposed, retrospective, or linked to opt-out pressure.",
  },
  {
    id: "late-missing-contributions",
    category: "Contributions",
    question: "What if pension money was deducted from wages but not paid to the provider?",
    label: "Late or missing contributions",
    patterns: [
      ["deducted", "not paid"],
      ["money was deducted", "provider"],
      ["contributions are missing"],
      ["not pay pension contributions on time"],
      ["when must pension contributions be paid"],
      ["22nd", "following month"],
      ["lost investment growth"],
      ["when should i report", "missing contributions"],
      ["wait", "90 days"],
      ["90 days", "missing contributions"],
      ["report to the pensions regulator"],
      ["contribution audit"],
      ["report unpaid contributions"],
      ["recover", "after i leave"],
      ["deduct pension", "final salary"],
      ["withhold pension", "notice"],
    ],
    pensionType: "Workplace pension contribution administration.",
    action: "The employer/payroll/provider is paying, recording or correcting contributions.",
    answer:
      "Potentially unlawful if required contributions are deducted or due but not paid across. Electronic payments are commonly expected by the 22nd of the following month.",
    basis:
      "Pensions Act 2008 duties, scheme contribution rules, TPR compliance powers and Pensions Ombudsman complaint routes for individual loss/maladministration.",
    application: () =>
      `Your record shows payslip deduction of ${formatMoney(appState.payslipContribution)} and provider amount of ${formatMoney(appState.providerContribution)}. Ask for a payroll/provider reconciliation by pay period.`,
    conclusion:
      "Likely a serious issue if the employer cannot explain timing or processing differences. Lost investment growth may be claimable if a late payment caused provable loss.",
    documents: ["payslips", "provider transactions", "contribution schedule", "payroll emails", "leaver statement"],
    help: "Report compliance issues to TPR and use the scheme/provider complaint route for individual correction or compensation.",
  },
  {
    id: "opt-out-rejoin",
    category: "Opt-out",
    question: "Can I opt out, get a refund, rejoin, or be re-enrolled?",
    label: "Opting out, refund and rejoining",
    patterns: [
      ["can i opt out"],
      ["how do i opt out"],
      ["opt out before"],
      ["refund", "opt out"],
      ["opt out after one month"],
      ["rejoin", "opting out"],
      ["re-enrol"],
      ["re-enrolment"],
      ["every 3 years"],
      ["every three years"],
    ],
    pensionType: "Automatic enrolment workplace pension.",
    action: "The worker is opting out, rejoining or being re-enrolled.",
    answer:
      "Yes, you can opt out through the proper provider process. A refund usually applies only within the statutory opt-out window; after that, contributions usually stay invested. You can usually rejoin, and re-enrolment usually happens about every 3 years if you are eligible.",
    basis:
      "Pensions Act 2008 automatic-enrolment and re-enrolment framework, plus scheme/provider opt-out procedures.",
    conclusion:
      "Likely yes to opting out or rejoining, but the employer must not pressure the decision and must still comply with re-enrolment duties.",
    documents: ["opt-out notice", "provider opt-out confirmation", "re-enrolment letter", "payslips"],
    help: "Escalate if the employer handles opt-out in a way that pressures you.",
  },
  {
    id: "opt-out-pressure-expanded",
    category: "Opt-out",
    question: "Can my employer ask, force, pay, dismiss or treat me worse because I stay in the pension?",
    label: "Opt-out pressure and detriment",
    patterns: [
      ["ask me to opt out"],
      ["give me an opt-out form"],
      ["force me to opt out"],
      ["extra pay", "opt out"],
      ["refuse to hire", "opt out"],
      ["dismiss", "staying in the pension"],
      ["cut my hours", "pension"],
      ["treat me worse", "pension"],
      ["pressured to opt out"],
      ["evidence", "pressures me to opt out"],
    ],
    pensionType: "Automatic enrolment workplace pension.",
    action: "The employer is inducing, pressuring, penalising or discouraging pension membership.",
    answer:
      "No. An employer should not encourage, force or induce opt-out, refuse work because of pension membership, or treat someone worse for staying in the pension or complaining about contributions.",
    basis:
      "Pensions Act 2008 employer compliance duties and TPR/GOV.UK guidance on inducement and prohibited recruitment conduct.",
    conclusion:
      "Likely unlawful if the employer links pay, hiring, hours or treatment to opting out or staying out. Keep evidence and ask for the instruction in writing.",
    documents: ["emails/messages", "meeting notes", "witness names", "job advert/offer", "payslips", "provider records"],
    help: "Use TPR for employer compliance and legal advice for dismissal or detriment claims.",
  },
  {
    id: "scheme-change-broad",
    category: "Employer change",
    question: "Can my employer close, replace, transfer, wind up or change my pension scheme?",
    label: "Employer pension changes",
    patterns: [
      ["close", "pension scheme"],
      ["close", "db"],
      ["close", "future accrual"],
      ["new members only"],
      ["move me from db to dc"],
      ["replace", "final salary"],
      ["reduce future pension benefits"],
      ["reduce benefits", "already built up"],
      ["change scheme rules"],
      ["trustees agree changes"],
      ["increase normal pension age"],
      ["change early retirement factors"],
      ["change pension increases"],
      ["change revaluation"],
      ["remove spouse"],
      ["death-in-service"],
      ["change provider"],
      ["master trust"],
      ["wind up", "scheme"],
      ["use pension surplus"],
      ["take money back", "pension scheme"],
      ["fire and rehire", "pension"],
      ["employer", "change", "pension"],
      ["employer", "change", "pensions"],
      ["employer", "change", "scheme"],
    ],
    pensionType: "Occupational pension, DB/final salary, DC or master trust depending on scheme.",
    action: "The employer is changing future benefits, provider, scheme rules, accrual, retirement age or scheme structure.",
    answer:
      "Potentially yes for future benefits, but usually no for simply reducing protected accrued occupational pension rights. If a workplace pension is closed, eligible workers normally still need compliant replacement automatic-enrolment provision.",
    basis:
      "Pensions Act 1995 ss67-67I for protected/subsisting rights; Pensions Act 2004 ss259-261 and the 2006 Consultation Regulations for listed changes; Pensions Act 2008 automatic-enrolment duties; employment contract rules and Acas/GOV.UK guidance for contract variation.",
    conclusion:
      "Likely lawful only for future changes made under the rules and proper process. Likely unlawful or challengeable if it cuts accrued rights without the required consent, actuarial equivalence and trustee approval.",
    documents: ["scheme rules", "amendment power", "consultation notice", "old/new benefit comparison", "contract", "trustee decision record"],
    help: "Use pensions-law advice for DB closure, accrued rights, surplus, wind-up or fire-and-rehire pension changes.",
  },
  {
    id: "consultation",
    category: "Employer change",
    question: "Does my employer have to consult for 60 days before pension changes?",
    label: "Pension-change consultation",
    patterns: [
      ["consult", "60 days"],
      ["did not consult", "60 days"],
      ["consultation", "pension reduction"],
      ["fake consultation"],
      ["sham consultation"],
      ["already decided", "consultation"],
      ["consultation", "make it lawful"],
      ["consultation alone"],
      ["what should i ask", "consultation"],
      ["listed pension changes"],
      ["employer", "50 employees", "consult"],
    ],
    pensionType: "Occupational or workplace pension change.",
    action: "The employer is making a listed pension change such as closing accrual, increasing member contributions, increasing pension age or worsening increases/revaluation.",
    answer:
      "Potentially yes. Employers with at least 50 employees in Great Britain may need to consult affected members for generally 60 days before listed pension changes.",
    basis:
      "Pensions Act 2004 ss259-261 and the Occupational and Personal Pension Schemes (Consultation by Employers and Miscellaneous Amendment) Regulations 2006.",
    conclusion:
      "A consultation breach does not automatically make every change void, but it can create regulatory and challenge risk. Consultation must be genuine, not just a decision already made.",
    documents: ["consultation notice", "business reasons", "impact statement", "Q&A", "trustee/employer decision timeline"],
    help: "Escalate if the employer refuses consultation information or has already implemented a listed change.",
  },
  {
    id: "accrued-rights",
    category: "DB/accrued rights",
    question: "What are accrued rights, subsisting rights, protected modifications and actuarial equivalence?",
    label: "Accrued rights and statutory modifications",
    patterns: [
      ["what are accrued pension rights"],
      ["subsisting rights"],
      ["protected modification"],
      ["detrimental modification"],
      ["actuarial equivalence"],
      ["member consent", "required"],
      ["silence", "consent"],
      ["silence count as consent"],
      ["email", "written consent"],
      ["not properly informed", "consent"],
      ["announcement", "did not amend the rules"],
      ["rules were not amended"],
      ["announcement only", "scheme rules"],
      ["void", "scheme amendment"],
      ["tpr", "modification void"],
    ],
    pensionType: "Occupational pension, especially DB/final salary or protected non-money-purchase rights.",
    action: "The employer/trustees are modifying rights already built up.",
    answer:
      "Accrued/subsisting rights are existing occupational pension rights. Protected or detrimental modifications generally need the statutory process. Silence should not be treated as informed consent.",
    basis:
      "Pensions Act 1995 ss67-67I. Protected modifications usually require informed member consent; detrimental modifications may require consent or actuarial equivalence plus trustee approval.",
    conclusion:
      "Likely challengeable if existing rights are reduced without the required statutory process. The key evidence is the rule change, member consent and actuarial/trustee material.",
    documents: ["trust deed and rules", "amendment deed", "consent form", "actuarial certificate/advice", "benefit statements"],
    help: "Use pensions-law advice because invalid modification questions can be technical and high value.",
  },
  {
    id: "db-final-salary-rights",
    category: "DB/accrued rights",
    question: "Can my employer change my final salary link, revaluation, increases or pension already in payment?",
    label: "DB and final salary protections",
    patterns: [
      ["db pension already earned", "reduced"],
      ["final salary link"],
      ["final salary is calculated"],
      ["cap pensionable salary"],
      ["remove future salary linkage"],
      ["career-average revaluation"],
      ["pension already in payment", "reduced"],
      ["pension increases in payment", "reduced"],
      ["deferred pension revaluation"],
      ["convert db benefits to dc"],
      ["trust deed and rules"],
      ["actuarial advice", "change"],
    ],
    pensionType: "DB/final salary/career average occupational pension.",
    action: "The employer or trustees are changing benefit formula, increases, revaluation or salary link.",
    answer:
      "Usually not for benefits already built up unless the statutory modification conditions are satisfied. Future accrual can often be changed more easily, but still depends on the rules, contract and consultation.",
    basis:
      "Pensions Act 1995 ss67-67I, scheme amendment power, and case law on amendment powers/proper purpose/good faith including Imperial, IBM, Barnardo's and QinetiQ-type issues.",
    conclusion:
      "Likely strongest challenge where the change cuts earned DB rights, pension in payment, statutory revaluation/increases or a protected final-salary link. Future service changes are more often lawful if process is followed.",
    documents: ["scheme rules", "benefit statement", "service record", "salary-link wording", "revaluation/increase rules", "actuarial comparison"],
    help: "Get specialist advice before accepting a DB-to-DC conversion or final-salary link change.",
  },
  {
    id: "equality-barber-expanded",
    category: "Equality",
    question: "What is Barber, the Barber window, valid equalisation and equal pension age?",
    label: "Barber and equal pension benefits",
    patterns: [
      ["different pension ages", "men"],
      ["different pension ages", "women"],
      ["barber judgment"],
      ["barber window"],
      ["affected by the barber window"],
      ["lower retirement age", "barber"],
      ["valid equalisation"],
      ["announcement only", "equalise"],
      ["rules were not properly amended", "barber"],
      ["pension age", "different because of sex"],
      ["early retirement benefits", "barber"],
      ["evidence", "barber-window"],
    ],
    pensionType: "DB/final salary occupational pension or other occupational pension with sex-based benefit terms.",
    action: "The scheme is equalising normal pension age or sex-based benefits.",
    answer:
      "Potentially. Barber means occupational pension benefits are pay for equal-pay purposes. The Barber window usually runs from 17 May 1990 to the scheme's valid equalisation date.",
    basis:
      "Barber v Guardian Royal Exchange, Article 119/157 equal-pay principles, Coloroll and Safeway equalisation timing principles, plus Equality Act 2010 pension equality rules.",
    conclusion:
      "Potentially arguable if the scheme had unequal male/female pension ages or benefits during the window, or if equalisation was attempted by an ineffective announcement rather than a valid rule change.",
    documents: ["pre/post-1990 scheme rules", "equalisation deed", "member announcements", "normal pension age history", "benefit calculations"],
    help: "Use legal advice if Barber affects retirement age, early retirement, spouse benefits or a material DB calculation.",
  },
  {
    id: "gmp-expanded",
    category: "Equality",
    question: "What is GMP equalisation and can I get arrears, interest or transfer top-up?",
    label: "GMP equalisation and arrears",
    patterns: [
      ["what is gmp"],
      ["gmp equalisation"],
      ["affected by gmp"],
      ["gmp", "17 may 1990"],
      ["gmp", "5 april 1997"],
      ["gmp arrears"],
      ["interest", "gmp"],
      ["transferred out", "gmp"],
      ["transfer value", "gmp equalisation"],
      ["spouse", "gmp"],
      ["lump sum", "gmp"],
    ],
    pensionType: "Contracted-out DB pension with Guaranteed Minimum Pension.",
    action: "The scheme is correcting unequal GMP effects for men and women.",
    answer:
      "Potentially yes if you had contracted-out DB service with GMP built up between 17 May 1990 and 5 April 1997. Arrears, interest or transfer top-ups can be possible depending on scheme method and history.",
    basis:
      "Lloyds GMP equalisation decisions and sex-equality principles. GAD notes that Lloyds confirmed no member should be worse off compared with a member of the opposite sex.",
    conclusion:
      "Likely relevant only if you have DB/contracted-out GMP service. Ask whether the scheme has completed GMP equalisation and whether your statement or past transfer already reflects it.",
    documents: ["GMP statement", "contracted-out service record", "equalisation method notice", "arrears calculation", "transfer history"],
    help: "Use specialist advice for past transfers, divorce values or disputed equalisation calculations.",
  },
  {
    id: "discrimination-expanded",
    category: "Equality",
    question: "Can pension rules discriminate because of sex, part-time work, maternity, age, disability or survivor status?",
    label: "Pension equality and discrimination",
    patterns: [
      ["widowers", "widows"],
      ["same-sex spouses", "survivor pension"],
      ["civil partners", "survivor"],
      ["unmarried partners", "survivor"],
      ["part-time workers", "worse pension"],
      ["women", "part-time"],
      ["maternity leave", "reduced my pension"],
      ["parental leave", "pension accrual"],
      ["age-based pension rules"],
      ["younger employees", "worse pension"],
      ["older employees", "better pension"],
      ["disability", "pension rules"],
      ["race", "pension rules"],
      ["religion", "pension rules"],
      ["sexual orientation", "pension rules"],
    ],
    pensionType: "Workplace or occupational pension with equality/discrimination issue.",
    action: "The scheme or employer is applying a rule that treats groups differently.",
    answer:
      "Potentially unlawful, but pensions have specific equality rules, exceptions and justification defences. Identify the exact protected characteristic and benefit term.",
    basis:
      "Equality Act 2010, including ss13, 39, 61, 62, 64-71 and Sch 7; Directive 2000/78/EC and 2006/54/EC principles; Barber/Brewster-type authorities where relevant.",
    conclusion:
      "Potentially arguable if the rule disadvantages a protected group and no pension-specific exception or objective justification applies.",
    documents: ["scheme rule", "benefit quote", "employer reason", "comparator evidence", "leave/part-time records"],
    help: "Use legal advice for discrimination, survivor pension and actuarial-factor disputes.",
  },
  {
    id: "leave-absence",
    category: "Leave",
    question: "What happens to pension contributions during maternity, paternity, adoption, sick or unpaid leave?",
    label: "Leave, absence and pension accrual",
    patterns: [
      ["paid leave", "pension"],
      ["unpaid leave", "pension"],
      ["maternity leave", "pension"],
      ["employer contributions", "maternity"],
      ["normal salary", "maternity pay"],
      ["paternity leave", "pension"],
      ["adoption leave", "pension"],
      ["shared parental leave", "pension"],
      ["sick leave", "pension"],
      ["long-term sickness", "pension"],
      ["buy back", "missing pension"],
      ["career break", "pension"],
      ["sabbatical", "pension"],
      ["strike action", "pension"],
      ["flexible working", "pensionable pay"],
      ["phased retirement"],
      ["death in service", "off sick"],
      ["stop death in service cover"],
      ["cover while off sick"],
    ],
    pensionType: "Workplace pension and employment leave rules.",
    action: "The employer is calculating contributions/accrual during leave or reduced work.",
    answer:
      "Potentially. Paid leave usually continues contributions under scheme rules. During paid maternity leave, employer contributions are generally based on normal pre-leave pay while employee contributions usually reflect actual pay.",
    basis:
      "Employment/family leave protections, scheme rules and automatic-enrolment contribution rules. Discrimination law may matter where leave or part-time work disadvantages protected groups.",
    conclusion:
      "Likely contributions continue during paid leave, but unpaid leave, career breaks, strike action and flexible/phased work depend heavily on scheme rules and pay/service definitions.",
    documents: ["family leave policy", "scheme booklet", "payslips before/during leave", "absence records", "buy-back rules"],
    help: "Get advice if maternity, disability, part-time work or long-term sickness caused pension loss.",
  },
  {
    id: "tupe-expanded",
    category: "TUPE",
    question: "What happens to my pension if my employer is taken over, outsourced or transferred?",
    label: "TUPE, outsourcing and pension protection",
    patterns: [
      ["employer is taken over"],
      ["tupe protect my pension"],
      ["old pension transfer", "new employer"],
      ["different pension scheme", "new employer"],
      ["match contributions up to 6%"],
      ["old employer contributed", "personal pension"],
      ["final salary pension before tupe"],
      ["public-sector pension", "outsourcing"],
      ["fair deal pension"],
      ["public sector outsourcing"],
      ["broadly comparable"],
      ["reduce pension contributions after tupe"],
      ["pension changes after tupe"],
      ["eto reason", "pension"],
      ["early retirement rights", "tupe"],
      ["redundancy-related pension benefits"],
      ["object to a transfer", "pension"],
    ],
    pensionType: "TUPE transfer, occupational pension, personal pension or public-sector outsourcing.",
    action: "Employment is transferring and the new employer is changing future pension terms.",
    answer:
      "Potentially protected, but TUPE pension protection is limited. Accrued rights remain protected; future provision may be different, with specific minimum replacement duties in some cases.",
    basis:
      "TUPE Regulations 2006, Pensions Act 2004 ss257-258, Transfer of Employment (Pension Protection) Regulations 2005, and Beckmann/Martin for some early-retirement/redundancy pension rights.",
    conclusion:
      "Likely not a full guarantee that the new employer must match every old pension term. But a replacement pension duty and protection for accrued or certain transfer-related benefits may apply.",
    documents: ["TUPE consultation papers", "old/new pension comparison", "measure statement", "employment liability information", "public-sector/Fair Deal documents"],
    help: "Use employment and pensions advice before accepting materially worse post-transfer pension terms.",
  },
  {
    id: "redundancy-leaving",
    category: "Leaving work",
    question: "What happens to my pension if I am redundant, dismissed, resign or leave employment?",
    label: "Redundancy, dismissal and leaving",
    patterns: [
      ["made redundant", "pension"],
      ["redundancy", "early retirement"],
      ["take my pension early", "redundancy"],
      ["refuse early retirement", "redundancy"],
      ["pension contributions", "notice"],
      ["garden leave", "pension"],
      ["payment in lieu", "pension"],
      ["redundancy pay", "pension contributions"],
      ["when i resign", "pension"],
      ["if i am dismissed", "pension"],
      ["less than 2 years", "db scheme"],
      ["refund of contributions", "leaving"],
      ["employer keep its contributions"],
      ["forfeited", "misconduct"],
      ["death-in-service", "notice"],
      ["settlement agreements", "pension claims"],
      ["pension loss", "unfair dismissal"],
    ],
    pensionType: "Workplace pension, DB early-retirement terms and employment settlement.",
    action: "Employment is ending and pension contributions, benefits, early retirement or claims are being calculated.",
    answer:
      "Accrued pension normally remains yours. Future contributions usually stop when employment ends, but contributions during notice depend on whether pay remains pensionable. Pension loss can form part of employment claims or settlement.",
    basis:
      "Scheme rules, employment contract, redundancy/notice terms, and employment tribunal principles on pension loss. DB early retirement depends on scheme discretion/rules.",
    conclusion:
      "Likely your built-up pot/rights are protected, but notice/PILON, redundancy pay and early-retirement treatment need document checks.",
    documents: ["notice letter", "settlement agreement", "scheme booklet", "payslips", "early-retirement rule", "benefit/leaver statement"],
    help: "Get legal advice before waiving pension claims in a settlement agreement.",
  },
  {
    id: "transfer-scams",
    category: "Transfers",
    question: "Do I have a right to transfer and what scam checks can delay or stop it?",
    label: "Transfer rights, delays and scam checks",
    patterns: [
      ["right to transfer"],
      ["scheme refuse a transfer"],
      ["transfer delayed"],
      ["pension scam red flags"],
      ["amber flags"],
      ["moneyhelper scam guidance"],
      ["transfer a db pension to a dc pension"],
      ["financial advice", "db pension"],
      ["pressure me to transfer out"],
      ["overseas pension"],
      ["qrops"],
      ["overseas transfer", "tax charges"],
      ["lose guarantees", "transferring"],
      ["protected pension age", "transferring"],
      ["guaranteed annuity rates"],
      ["undo a pension transfer"],
      ["badly advised to transfer"],
      ["unsafe transfer"],
    ],
    pensionType: "DC transfer, DB/safeguarded-benefit transfer, overseas transfer or scam-risk case.",
    action: "The member, provider, trustees or adviser is transferring pension rights.",
    answer:
      "Potentially yes, but transfer rights are not unlimited. Scam checks can delay or stop transfers, and DB/safeguarded-benefit transfers can require regulated advice.",
    basis:
      "Transfer legislation and scheme rules; pension scam due-diligence rules; regulated-advice requirements for DB/safeguarded benefits over GBP30,000; FCA/FOS routes for advice complaints.",
    conclusion:
      "Likely a valid transfer only after due diligence, required advice and checks for guarantees, protected ages, tax charges and scam flags.",
    documents: ["transfer pack", "CETV", "advice confirmation", "scam warning records", "receiving scheme details", "guarantee/protected-age wording"],
    help: "Use regulated financial advice for DB transfers and FCA/FOS routes for unsuitable advice.",
  },
  {
    id: "retirement-access-expanded",
    category: "Retirement",
    question: "When can I take pension, retire early, use drawdown or take tax-free cash?",
    label: "Retirement age and taking benefits",
    patterns: [
      ["when can i take", "workplace pension"],
      ["normal minimum pension age"],
      ["minimum pension age", "57"],
      ["2028", "minimum pension age"],
      ["protected pension age"],
      ["scheme pension age", "higher"],
      ["early retirement", "reduce my pension"],
      ["employer refuse early retirement"],
      ["trustees refuse early retirement"],
      ["ill-health retirement"],
      ["appeal refusal", "ill-health"],
      ["tax-free lump sum"],
      ["take all my pension as cash"],
      ["future contributions", "taking pension"],
      ["money purchase annual allowance"],
      ["buy an annuity"],
      ["use drawdown"],
      ["pension while still employed"],
      ["retire and return"],
      ["force me to retire"],
      ["delay taking my pension"],
      ["late retirement"],
      ["pension be suspended", "return to work"],
    ],
    pensionType: "DC retirement access, DB early/late retirement or ill-health retirement.",
    action: "The member is accessing pension benefits or the employer/trustees are deciding retirement terms.",
    answer:
      "Potentially. Normal minimum pension age is generally 55, rising to 57 from 6 April 2028 unless a protected pension age or ill-health rule applies. Scheme rules can set a later normal pension age.",
    basis:
      "Finance Act 2004 registered-pension tax framework, scheme rules, protected pension age rules and provider/DB consent rules. Pension Wise/regulated advice may matter for access decisions.",
    conclusion:
      "Likely possible only if both tax rules and scheme rules allow it. Early access can reduce benefits, trigger tax consequences or activate the money purchase annual allowance.",
    documents: ["retirement options pack", "scheme pension age rule", "protected age wording", "early/late retirement factors", "ill-health decision"],
    help: "Use Pension Wise or regulated financial advice before drawdown, annuity, cash-out or major retirement timing decisions.",
  },
  {
    id: "death-divorce",
    category: "Benefits",
    question: "Who receives pension death benefits, and how is pension dealt with on divorce?",
    label: "Death benefits, dependants and divorce",
    patterns: [
      ["die before retirement"],
      ["die after retirement"],
      ["spouse get a pension"],
      ["civil partner get a pension"],
      ["unmarried partner get a pension"],
      ["children get pension"],
      ["nominate", "death benefits"],
      ["nomination binding"],
      ["trustees ignore", "nomination"],
      ["forgot to update", "nomination"],
      ["ex-spouse", "pension benefits"],
      ["pension divided on divorce"],
      ["pension sharing order"],
      ["pension attachment"],
      ["earmarking"],
      ["offset against other assets"],
      ["death benefits", "estate"],
      ["death benefits", "taxable"],
      ["life assurance", "off sick"],
    ],
    pensionType: "Death benefits, survivor pension, discretionary lump sum, or divorce pension rights.",
    action: "Trustees/provider or family court is deciding death benefits or divorce division.",
    answer:
      "It depends on scheme rules. Nomination forms are important but often not binding where trustees have discretion. Divorce can divide pension through sharing, attachment/earmarking or offsetting.",
    basis:
      "Scheme rules/trustee discretion, tax rules, family-court pension sharing law and equality principles for survivor benefits.",
    conclusion:
      "Likely the practical first step is to update nomination/expression-of-wish forms and check spouse, civil partner, cohabiting partner, child and ex-spouse rules.",
    documents: ["expression of wish form", "death-benefit rule", "survivor pension rule", "divorce order", "pension sharing annex", "benefit statement"],
    help: "Get legal advice for disputed death benefits, divorce, cohabitation or large survivor pensions.",
  },
  {
    id: "funding-insolvency",
    category: "Protection",
    question: "Is my DB pension safe if the scheme has a deficit or the employer goes bust?",
    label: "Scheme funding, insolvency and protection",
    patterns: [
      ["db pension safe", "deficit"],
      ["pension deficit"],
      ["deficit mean", "pension will be cut"],
      ["recovery plan"],
      ["underfunded", "reduce benefits"],
      ["trustees demand more money"],
      ["employer cannot afford contributions"],
      ["employer goes bust"],
      ["pension protection fund"],
      ["ppf pay my full pension"],
      ["ppf compensation"],
      ["assessment period"],
      ["pension assets", "company debts"],
      ["borrow from the pension scheme"],
      ["employer-related investment"],
      ["fraud compensation fund"],
      ["provider goes bust"],
      ["master trust fails"],
      ["administrator makes a mistake"],
      ["maladministration"],
    ],
    pensionType: "DB scheme funding/PPF, DC provider/master trust protection or administration complaint.",
    action: "The employer, scheme or provider is underfunded, insolvent or making an administration error.",
    answer:
      "A DB deficit does not automatically cut benefits, but employer insolvency can lead to PPF assessment. The PPF may pay compensation, commonly 100% for members already at scheme pension age and 90% for those below scheme pension age, subject to detailed rules.",
    basis:
      "Pensions Act 2004 PPF provisions, scheme funding rules, employer-related investment restrictions, Fraud Compensation Fund and FCA/FSCS-style protection where relevant.",
    conclusion:
      "Likely DB members have a protection route through scheme funding/PPF, but PPF compensation may differ from full scheme benefits. Administration mistakes can support correction and compensation claims.",
    documents: ["summary funding statement", "recovery plan", "PPF notice", "administrator correspondence", "provider protection information"],
    help: "Use specialist advice for insolvency, fraud, PPF compensation or large maladministration losses.",
  },
  {
    id: "information-complaints",
    category: "Complaints",
    question: "What pension documents can I request and where do I complain?",
    label: "Information, IDRP and complaints",
    patterns: [
      ["ask for my pension statement"],
      ["annual benefit statement"],
      ["scheme rules"],
      ["trust deed"],
      ["schedule of contributions"],
      ["statement of investment principles"],
      ["chair's statement"],
      ["actuarial valuation"],
      ["recovery plan"],
      ["how my pension was calculated"],
      ["why my pension changed"],
      ["contribution history"],
      ["missing contribution evidence"],
      ["barber equalisation documents"],
      ["gmp equalisation calculations"],
      ["early retirement factors"],
      ["transfer value calculations"],
      ["complain to hr"],
      ["complain to the pension provider"],
      ["what is idrp"],
      ["pensions ombudsman"],
      ["pensions regulator"],
      ["financial ombudsman"],
      ["financial ombudsman service"],
      ["fca"],
      ["fscs"],
      ["bad pension advice"],
      ["financial advice complaint"],
      ["time limit", "pension complaints"],
      ["distress and inconvenience"],
      ["financial loss"],
      ["delayed my retirement payment"],
      ["wrong information"],
      ["incorrect pension estimate"],
      ["misleading pension information"],
    ],
    pensionType: "Scheme information, administration dispute, employer compliance issue or regulated-advice complaint.",
    action: "The member is requesting documents or escalating a dispute.",
    answer:
      "For documents, yes, you can usually request key scheme and calculation records. For complaints, start with the employer/provider/trustees, then IDRP or the appropriate ombudsman/regulator route.",
    basis:
      "Disclosure rules, scheme IDRP, Pension Schemes Act 1993 ss145-152 for The Pensions Ombudsman, TPR compliance role, and FCA/FOS routes for regulated advice or personal-pension provider issues.",
    conclusion:
      "Likely route: ask in writing, keep a timeline, use IDRP/complaints process, then TPO/TPR/FOS depending on whether it is scheme administration, employer compliance or regulated advice.",
    documents: ["timeline", "payslips", "benefit statements", "scheme rules", "calculation request", "complaint letters", "final response"],
    help: "Use legal advice where limitation, large loss, discrimination or scheme-rule interpretation is involved.",
  },
  {
    id: "tax-salary-sacrifice",
    category: "Tax",
    question: "How do tax relief, salary sacrifice and pension allowances affect me?",
    label: "Tax, salary sacrifice and allowances",
    patterns: [
      ["tax relief", "pension contributions"],
      ["relief at source"],
      ["net pay arrangement"],
      ["low earner", "tax relief"],
      ["salary sacrifice", "pension"],
      ["force salary sacrifice"],
      ["salary sacrifice", "take-home pay"],
      ["salary sacrifice", "maternity pay"],
      ["salary sacrifice", "mortgage"],
      ["salary sacrifice", "state benefits"],
      ["national minimum wage", "salary sacrifice"],
      ["leave salary sacrifice"],
      ["annual allowance"],
      ["carry forward"],
      ["tapered annual allowance"],
      ["money purchase annual allowance"],
      ["lifetime allowance"],
      ["lump sum allowance"],
      ["death benefit allowance"],
      ["tax charges", "unauthorised payments"],
      ["early access", "tax penalties"],
    ],
    pensionType: "Personal tax, salary sacrifice and registered pension tax limits.",
    action: "The worker or employer is changing taxable salary, contributions or pension access.",
    answer:
      "Potentially. Pension tax relief may be relief at source or net pay. Salary sacrifice needs agreement and must not reduce cash pay below National Minimum Wage. Allowance breaches or unauthorised early access can trigger tax charges. A separate estate-planning change is planned from 6 April 2027 so that most unused private pension funds and pension death benefits fall into estate IHT scope.",
    basis:
      "Finance Act 2004 registered-pension tax framework, salary-sacrifice contract principles, National Minimum Wage rules, HMRC pension allowance rules and HMRC's 2025 to 2027 pension IHT policy papers.",
    conclusion:
      "Likely useful where it is voluntary and properly explained, but risky if it affects statutory pay, benefits, mortgage affordability, low-earner tax relief or allowances. Re-check pension-versus-ISA or drawdown strategy if estate planning matters, because the post-2027 IHT position for unused private pensions is changing.",
    documents: ["salary sacrifice agreement", "pension savings statement", "payslips", "tax-relief method", "allowance/tax charge notice"],
    help: "Use regulated financial/tax advice before opting out, salary-sacrificing large amounts or accessing pension early.",
  },
  {
    id: "public-sector",
    category: "Public sector",
    question: "Can public-sector pension schemes change and what is the McCloud remedy?",
    label: "Public-sector pensions and McCloud",
    patterns: [
      ["government change", "public-sector pension"],
      ["public-sector pension reforms"],
      ["age discrimination", "public-sector pension"],
      ["mccloud remedy"],
      ["transitional protection"],
      ["nhs pension"],
      ["teachers' pension"],
      ["lgps"],
      ["civil service pension"],
      ["police pension"],
      ["firefighter pension"],
      ["public-sector", "contribution rates"],
      ["public-sector", "retirement ages"],
      ["public-sector", "accrual rates"],
      ["public-sector", "flexible retirement"],
      ["public-sector", "ill-health retirement"],
      ["abatement"],
      ["outsourcing", "public-sector pension rights"],
    ],
    pensionType: "Public-service statutory pension scheme.",
    action: "Government or scheme regulations are changing public-sector benefits, remedy or retirement terms.",
    answer:
      "Potentially yes, public-sector schemes can be changed by legislation/regulations, but accrued protections, discrimination law and McCloud remedy rules may apply.",
    basis:
      "Public-service pension legislation/regulations, Equality Act 2010 age-discrimination principles and the McCloud remedy for unlawful transitional protection.",
    conclusion:
      "Likely scheme-specific. Check the exact public-sector scheme, service dates, remedy-period status and retirement/ill-health/abatement rules.",
    documents: ["scheme guide", "remedy statement", "service record", "retirement quote", "ill-health/abatement decision"],
    help: "Use scheme guidance or legal advice for McCloud, ill-health refusal, flexible retirement or outsourcing disputes.",
  },
  {
    id: "dc-investment",
    category: "DC investment",
    question: "Who chooses my DC investments and can I complain about losses, charges or default fund problems?",
    label: "DC investment and charges",
    patterns: [
      ["who chooses", "dc pension"],
      ["default fund"],
      ["employer change", "default fund"],
      ["choose my own pension investments"],
      ["investment losses", "employer"],
      ["pension fund falls"],
      ["poor investment performance"],
      ["trustees", "unsuitable investments"],
      ["charges", "too high"],
      ["hidden pension charges"],
      ["transaction cost information"],
      ["environmental", "investment"],
      ["ethical investment"],
      ["object to my pension investing"],
      ["invest pension assets", "employer"],
      ["high-risk investments"],
      ["default fund", "unsuitable"],
      ["lifestyling", "wrong time"],
      ["invested contributions late"],
    ],
    pensionType: "DC pot, default fund, trustee/provider investment governance.",
    action: "Trustees/provider/member are selecting investments, charging fees or administering investment switches.",
    answer:
      "Usually market losses alone are not employer liability. But poor administration, unsuitable default governance, undisclosed charges or breach of trustee/provider duties may be complaint issues.",
    basis:
      "Scheme/provider terms, trustee investment duties including Pensions Act 1995 ss33-36A where relevant, charge/disclosure rules and Ombudsman/FCA routes depending on product type.",
    conclusion:
      "Likely no claim for normal investment loss, but potentially arguable if there was maladministration, breach of duty, misleading disclosure, excessive charges or late investment of contributions.",
    documents: ["fund factsheet", "default strategy", "charges/transaction costs", "switch history", "contribution investment date", "statement of investment principles"],
    help: "Use regulated advice for investment choice and complaint routes for administration or disclosure failures.",
  },
  {
    id: "can-i-enforce",
    category: "Practical rights",
    question: "Can I force, complain, sue, request data or challenge a pension decision?",
    label: "Practical enforcement routes",
    patterns: [
      ["force my employer", "enrol"],
      ["force my employer", "missed contributions"],
      ["better pension scheme"],
      ["choose a different pension provider"],
      ["contribute to my sipp"],
      ["stop contributions temporarily"],
      ["restart contributions"],
      ["transfer old pensions into"],
      ["transfer workplace pension out", "still employed"],
      ["compensation", "underpayment"],
      ["pension loss after dismissal"],
      ["sue trustees"],
      ["sue the employer"],
      ["complain anonymously"],
      ["subject access request", "pension"],
      ["request all pension data"],
      ["challenge a transfer value"],
      ["challenge early retirement reductions"],
      ["challenge ill-health refusal"],
      ["challenge survivor pension refusal"],
      ["challenge gmp"],
      ["challenge barber"],
      ["financial advice paid by the employer"],
      ["extra pension instead of a pay rise"],
      ["salary-sacrifice bonus"],
      ["pay avcs"],
      ["stop avcs"],
      ["recover pension losses"],
    ],
    pensionType: "Enforcement, complaint, data request, transfer, AVC or pension-loss claim.",
    action: "The member is seeking correction, documents, complaint escalation, compensation or scheme changes.",
    answer:
      "Potentially. You can usually request records, complain, report compliance issues and challenge calculations or decisions. Forcing a better scheme or different provider is much harder unless the employer breaches a legal duty.",
    basis:
      "Contract and scheme rules, Pensions Act 2008/1995/2004 duties where relevant, UK GDPR subject access rights, IDRP/TPO, TPR and employment tribunal/legal claim routes.",
    conclusion:
      "Likely strongest where there is missed contribution, wrong calculation, refusal to follow rules, maladministration or unlawful dismissal. Weaker where you simply prefer a better provider or higher benefit.",
    documents: ["all pension statements", "payslips", "calculation letters", "decision reasons", "complaint timeline", "data request response"],
    help: "Get legal advice before suing trustees/employer or signing any settlement that waives pension claims.",
  },
];

const moneyFormat = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 0,
});

const percentFormat = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 1,
});

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  setOnboardingContent("starter");
  applyUiMode();
  bindNavigation();
  bindInputs();
  bindOnboarding();
  bindPortfolioTools();
  bindCoach();
  bindInstallPrompt();
  bindUiModeListeners();
  registerServiceWorker();
  loadPersistedPortfolio();
  if (!applyDemoStateFromQuery()) {
    seedChat();
    render();
    showOnboarding(getOpeningOnboardingMode());
  }
});

function bindNavigation() {
  document.querySelectorAll("[data-view], [data-view-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view || button.dataset.viewJump;
      setView(view);
    });
  });
}

function bindOnboarding() {
  if (els.resumePortfolioButton) {
    els.resumePortfolioButton.addEventListener("click", () => {
      hideOnboarding();
      setView("finder");
    });
  }

  if (els.useExampleButton) {
    els.useExampleButton.addEventListener("click", () => {
      const mode = onboardingMode;
      applyExamplePortfolio();
      hideOnboarding();
      if (mode === "demo") setView("goal");
    });
  }

  if (els.useDbExampleButton) {
    els.useDbExampleButton.addEventListener("click", () => {
      const mode = onboardingMode;
      applyDbExamplePortfolio();
      hideOnboarding();
      if (mode === "demo") setView("goal");
    });
  }

  if (els.useStateExampleButton) {
    els.useStateExampleButton.addEventListener("click", () => {
      const mode = onboardingMode;
      applyMixedExamplePortfolio();
      hideOnboarding();
      if (mode === "demo") setView("goal");
    });
  }

  if (els.useMixedExampleButton) {
    els.useMixedExampleButton.addEventListener("click", () => {
      const mode = onboardingMode;
      applyMixedStateExamplePortfolio();
      hideOnboarding();
      if (mode === "demo") setView("goal");
    });
  }

  if (els.useLowEarnerExampleButton) {
    els.useLowEarnerExampleButton.addEventListener("click", () => {
      const mode = onboardingMode;
      applyLowEarnerExamplePortfolio();
      hideOnboarding();
      if (mode === "demo") setView("dashboard");
    });
  }

  if (els.usePartTimeExampleButton) {
    els.usePartTimeExampleButton.addEventListener("click", () => {
      const mode = onboardingMode;
      applyPartTimeExamplePortfolio();
      hideOnboarding();
      if (mode === "demo") setView("dashboard");
    });
  }

  if (els.useMultipleJobsExampleButton) {
    els.useMultipleJobsExampleButton.addEventListener("click", () => {
      const mode = onboardingMode;
      applyMultipleJobsExamplePortfolio();
      hideOnboarding();
      if (mode === "demo") setView("dashboard");
    });
  }

  if (els.useSelfEmployedExampleButton) {
    els.useSelfEmployedExampleButton.addEventListener("click", () => {
      const mode = onboardingMode;
      applySelfEmployedExamplePortfolio();
      hideOnboarding();
      if (mode === "demo") setView("dashboard");
    });
  }

  if (els.startBlankButton) {
    els.startBlankButton.addEventListener("click", () => {
      applyBlankPortfolio();
      hideOnboarding();
      setView("finder");
    });
  }
}

function getViewportContext(width = window.innerWidth) {
  if (width < UI_BREAKPOINTS.mobile) return "mobile";
  if (width < UI_BREAKPOINTS.tablet) return "tablet";
  return "desktop";
}

function isStandaloneDisplayMode() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isAppleTouchDevice() {
  const ua = window.navigator.userAgent || "";
  return /iPhone|iPad|iPod/i.test(ua) || (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
}

function canOfferIosInstallHint() {
  return isAppleTouchDevice() && uiState.shell === "web" && /^https?:$/i.test(window.location.protocol);
}

function deriveUiState() {
  const viewport = getViewportContext();
  const shell = isStandaloneDisplayMode() ? "app" : "web";
  const navStyle = viewport === "mobile" || shell === "app" ? "bottom" : "top";
  return {
    viewport,
    shell,
    mode: `${viewport}-${shell}`,
    navStyle,
  };
}

function applyUiMode() {
  uiState = deriveUiState();
  document.body.dataset.viewport = uiState.viewport;
  document.body.dataset.shell = uiState.shell;
  document.body.dataset.uiMode = uiState.mode;
  document.body.dataset.navStyle = uiState.navStyle;
}

function scheduleUiRender() {
  if (uiRenderFrame) window.cancelAnimationFrame(uiRenderFrame);
  uiRenderFrame = window.requestAnimationFrame(() => {
    uiRenderFrame = 0;
    render();
  });
}

function bindUiModeListeners() {
  window.addEventListener("resize", scheduleUiRender);
  const displayModeMedia = window.matchMedia("(display-mode: standalone)");
  const handleDisplayModeChange = () => scheduleUiRender();
  if (typeof displayModeMedia.addEventListener === "function") {
    displayModeMedia.addEventListener("change", handleDisplayModeChange);
  } else if (typeof displayModeMedia.addListener === "function") {
    displayModeMedia.addListener(handleDisplayModeChange);
  }
}

function bindInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    renderPortfolioChrome();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    scheduleUiRender();
  });

  if (els.installAppButton) {
    els.installAppButton.addEventListener("click", async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        try {
          await deferredInstallPrompt.userChoice;
        } catch (error) {
          console.warn("Install prompt was dismissed or unavailable.", error);
        }
        deferredInstallPrompt = null;
        renderPortfolioChrome();
        return;
      }

      if (canOfferIosInstallHint()) {
        window.alert("To install this app on iPhone or iPad, tap Share and choose Add to Home Screen.");
      }
    });
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !/^https?:$/i.test(window.location.protocol)) return;
  navigator.serviceWorker.register("./sw.js").catch((error) => {
    console.warn("Service worker registration failed.", error);
  });
}

function bindPortfolioTools() {
  if (els.exportJsonButton) {
    els.exportJsonButton.addEventListener("click", exportPortfolioJson);
  }

  if (els.importJsonButton && els.importJsonInput) {
    els.importJsonButton.addEventListener("click", () => {
      els.importJsonInput.click();
    });
    els.importJsonInput.addEventListener("change", importPortfolioJson);
  }
}

function hideOnboarding() {
  setOnboardingContent("starter");
  els.onboardingOverlay.classList.remove("active");
}

function isExampleStarterMode(mode = appState.meta?.starterMode) {
  return (
    mode === "example" ||
    mode === "example-dc" ||
    mode === "example-db" ||
    mode === "example-state" ||
    mode === "example-mixed" ||
    mode === "example-mixed-state" ||
    mode === "example-low-earner" ||
    mode === "example-part-time" ||
    mode === "example-multiple-jobs" ||
    mode === "example-self-employed"
  );
}

function getOpeningOnboardingMode() {
  if (!appState.meta?.savedAt) return "starter";
  return isExampleStarterMode() ? "demo" : "saved";
}

function setOnboardingContent(mode = "starter") {
  onboardingMode = mode;
  const content = ONBOARDING_CONTENT[mode] || ONBOARDING_CONTENT.starter;
  const showResume = mode === "saved";
  if (els.resumeOption) els.resumeOption.hidden = !showResume;
  if (els.resumeOptionEyebrow) els.resumeOptionEyebrow.textContent = content.resumeEyebrow || "Your portfolio";
  if (els.resumeOptionTitle) els.resumeOptionTitle.textContent = content.resumeTitle || "Continue entering my details";
  if (els.resumeOptionCopy) {
    els.resumeOptionCopy.textContent =
      content.resumeCopy || "Open your saved pension record and update the employer, scheme, arrangement and balances.";
  }
  if (els.resumePortfolioButton) els.resumePortfolioButton.textContent = content.resumeButton || "Enter my portfolio";
  if (els.onboardingEyebrow) els.onboardingEyebrow.textContent = content.eyebrow;
  if (els.onboardingTitle) els.onboardingTitle.textContent = content.title;
  if (els.onboardingCopy) els.onboardingCopy.textContent = content.copy;
  if (els.exampleOptionEyebrow) els.exampleOptionEyebrow.textContent = content.exampleEyebrow;
  if (els.exampleOptionTitle) els.exampleOptionTitle.textContent = content.exampleTitle;
  if (els.exampleOptionCopy) els.exampleOptionCopy.textContent = content.exampleCopy;
  if (els.useExampleButton) els.useExampleButton.textContent = content.exampleButton;
  if (els.dbOptionEyebrow) els.dbOptionEyebrow.textContent = content.dbEyebrow;
  if (els.dbOptionTitle) els.dbOptionTitle.textContent = content.dbTitle;
  if (els.dbOptionCopy) els.dbOptionCopy.textContent = content.dbCopy;
  if (els.useDbExampleButton) els.useDbExampleButton.textContent = content.dbButton;
  if (els.stateOptionEyebrow) els.stateOptionEyebrow.textContent = content.stateEyebrow;
  if (els.stateOptionTitle) els.stateOptionTitle.textContent = content.stateTitle;
  if (els.stateOptionCopy) els.stateOptionCopy.textContent = content.stateCopy;
  if (els.useStateExampleButton) els.useStateExampleButton.textContent = content.stateButton;
  if (els.mixedOptionEyebrow) els.mixedOptionEyebrow.textContent = content.mixedEyebrow;
  if (els.mixedOptionTitle) els.mixedOptionTitle.textContent = content.mixedTitle;
  if (els.mixedOptionCopy) els.mixedOptionCopy.textContent = content.mixedCopy;
  if (els.useMixedExampleButton) els.useMixedExampleButton.textContent = content.mixedButton;
  if (els.blankOptionEyebrow) els.blankOptionEyebrow.textContent = content.blankEyebrow;
  if (els.blankOptionTitle) els.blankOptionTitle.textContent = content.blankTitle;
  if (els.blankOptionCopy) els.blankOptionCopy.textContent = content.blankCopy;
  if (els.startBlankButton) els.startBlankButton.textContent = content.blankButton;
  if (els.onboardingNote) els.onboardingNote.textContent = content.note;
}

function showOnboarding(mode = "starter") {
  setOnboardingContent(mode);
  els.onboardingOverlay.classList.add("active");
}

function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value;
}

function createDefaultShortTermSavings() {
  return {
    emergencyTarget: 3000,
    monthlyBudget: 300,
    cashSharePct: 60,
    incomePattern: "steady",
    pauseMonths: 6,
  };
}

function createDefaultLifeFactors() {
  return {
    housingStatus: "unknown",
    monthlyHousingCost: 0,
    debtPressure: "none",
    dependants: 0,
    survivorNeed: "unknown",
  };
}

function createDefaultPartnerProfile() {
  return {
    enabled: false,
    name: "Partner",
    age: 32,
    retireAge: 68,
    pensionType: "DC",
    currentPot: 18000,
    monthlyContribution: 250,
    statePension: FULL_NEW_STATE_PENSION_2026_27,
    statePensionAge: 68,
  };
}

function createDefaultHouseholdGoal() {
  return {
    jointMonthlyIncome: 3200,
    scenarioType: "none",
    scenarioValue: 2,
  };
}

function syncEmploymentButtons() {
  document.querySelectorAll("[data-employment]").forEach((button) => {
    button.classList.toggle("active", button.dataset.employment === appState.employmentType);
  });
}

function createDefaultScenarioModel() {
  return {
    type: "none",
    retireLaterYears: 2,
    extraEmployeePct: 2,
    pauseMonths: 12,
    lowerEarningsPct: 10,
    splitExtraMonthly: 100,
  };
}

function ensureScenarioState() {
  const defaults = createDefaultScenarioModel();
  appState.scenarioModel = { ...defaults, ...(appState.scenarioModel || {}) };
  const minAge = Number.isFinite(appState.age) ? appState.age : 0;
  const maxAge = Math.max(minAge, Number.isFinite(appState.retireAge) ? appState.retireAge : minAge);
  const selectedAge = Number.isFinite(appState.projectionInspectorAge) ? appState.projectionInspectorAge : minAge;
  appState.projectionInspectorAge = Math.min(Math.max(Math.round(selectedAge), minAge), maxAge);
}

function ensureExtendedAssumptionState() {
  appState.annualChargePct = Math.max(0, toNumber(appState.annualChargePct));
  appState.inflationPct = Math.max(0, toNumber(appState.inflationPct));
  appState.moneyMode = normalizeMoneyMode(appState.moneyMode);
  appState.salaryGrowthPct = Math.max(0, toNumber(appState.salaryGrowthPct));
  appState.contributionEscalationPct = Math.max(0, toNumber(appState.contributionEscalationPct));
  appState.taxReliefMode = normalizeTaxReliefMode(appState.taxReliefMode);
  appState.marginalTaxPct = Math.min(45, Math.max(0, toNumber(appState.marginalTaxPct)));
  appState.employeeNiPct = Math.min(12, Math.max(0, toNumber(appState.employeeNiPct)));
  appState.dbAmountBasis = normalizeDbAmountBasis(appState.dbAmountBasis);
  appState.dbRevaluationPct = Math.max(0, toNumber(appState.dbRevaluationPct));
  appState.dbIndexationPct = Math.max(0, toNumber(appState.dbIndexationPct));
  appState.dbAdjustmentPct = Math.min(15, Math.max(-15, toNumber(appState.dbAdjustmentPct)));
  appState.lifeFactors = {
    ...createDefaultLifeFactors(),
    ...(appState.lifeFactors || {}),
    housingStatus: normalizeHousingStatus(appState.lifeFactors?.housingStatus),
    monthlyHousingCost: Math.max(0, toNumber(appState.lifeFactors?.monthlyHousingCost)),
    debtPressure: normalizeDebtPressure(appState.lifeFactors?.debtPressure),
    dependants: Math.max(0, toNumber(appState.lifeFactors?.dependants)),
    survivorNeed: normalizeSurvivorNeed(appState.lifeFactors?.survivorNeed),
  };
}

function isProjectedDcArrangement(type) {
  return type === "DC" || type === "Hybrid";
}

function hasDbArrangementComponent(type) {
  return type === "DB" || type === "Hybrid";
}

function supportsDcInvestmentSettings(type) {
  return type === "DC" || type === "Hybrid";
}

function isUnknownProjectionBlocker(record) {
  return record?.pensionType === "Unknown" && record.status === "current";
}

function getProjectionModeDetails(state = appState) {
  const current = getCurrentEmploymentRecord(state);
  const blockedUnknownRecords = current && isUnknownProjectionBlocker(current) ? [current] : [];
  const hasUnknownBlocker = blockedUnknownRecords.length > 0;
  const hasCurrentDbSource = hasDbArrangementComponent(current?.pensionType);
  const hasCurrentDcSource = isProjectedDcArrangement(current?.pensionType);
  const isStateOnlyCurrent = current?.pensionType === "State-only";
  const isPureStateOnly = isStateOnlyCurrent;
  const hasPreviousDbHistory = current?.pensionType === "DC" && getPreviousDbBenefitSummary(state, state.retireAge).hasDb;
  const hasStatePensionForecast = Math.max(0, toNumber(state.statePension)) > 0;
  const includesMixedStatePension = hasPreviousDbHistory && hasStatePensionForecast;
  let mode = "dc-only";

  if (hasUnknownBlocker) {
    mode = "blocked";
  } else if (hasCurrentDbSource || isStateOnlyCurrent) {
    mode = "income-mix";
  }

  return {
    mode,
    currentType: current?.pensionType || "Unknown",
    hasUnknownBlocker,
    blockedUnknownRecords,
    hasAnyDbSource: hasCurrentDbSource,
    hasAnyDcSource: hasCurrentDcSource,
    isPureStateOnly,
    isStateOnlyCurrent,
    hasPreviousDbHistory,
    hasStatePensionForecast,
    includesMixedStatePension,
  };
}

function isDbLedPortfolio(state = appState) {
  return getProjectionModeDetails(state).mode === "income-mix";
}

function currentRecordSupportsDcProjection(state = appState) {
  return isProjectedDcArrangement(getCurrentEmploymentRecord(state)?.pensionType);
}

function getCurrentRecordDcInvestmentAccess(state = appState) {
  const current = getCurrentEmploymentRecord(state);
  return normalizeDcInvestmentAccess(current?.dcInvestmentAccess ?? state.dcInvestmentAccess);
}

function getCurrentRecordDcInvestmentStyle(state = appState) {
  const current = getCurrentEmploymentRecord(state);
  return normalizeDcInvestmentStyle(current?.dcInvestmentStyle ?? state.dcInvestmentStyle);
}

function currentRecordSupportsSelfSelectInvesting(state = appState) {
  return supportsDcInvestmentSettings(getCurrentEmploymentRecord(state)?.pensionType)
    && ["workplace-self-select", "sipp"].includes(getCurrentRecordDcInvestmentAccess(state));
}

function hasProjectedDcAssets(state = appState) {
  const current = getCurrentEmploymentRecord(state);
  const hasDcPot = current && isProjectedDcArrangement(current.pensionType) && toNumber(current.potValue) > 0;
  const hasCurrentDcContributionStream =
    current &&
    isProjectedDcArrangement(current.pensionType) &&
    (toNumber(current.employerContributionPct) > 0 || toNumber(current.employeeContributionPct) > 0);
  return Boolean(hasDcPot || hasCurrentDcContributionStream);
}

function getDbIncomeDetails(record, state = appState, atAge = state.retireAge) {
  const enteredAnnual = Math.max(0, toNumber(record?.dbAnnualPensionAtSchemeAge));
  const schemeAge = toNumber(record?.dbSchemePensionAge) > 0 ? toNumber(record.dbSchemePensionAge) : null;
  const selectedAge = toNumber(atAge);
  const basis = normalizeDbAmountBasis(record?.dbAmountBasis ?? state.dbAmountBasis);
  const revaluationPct = Math.max(0, toNumber(record?.dbRevaluationPct ?? state.dbRevaluationPct));
  const indexationPct = Math.max(0, toNumber(record?.dbIndexationPct ?? state.dbIndexationPct));
  const adjustmentPct = toNumber(record?.dbAdjustmentPct ?? state.dbAdjustmentPct);
  const yearsToSchemeAge = schemeAge !== null ? Math.max(0, schemeAge - toNumber(state.age)) : 0;
  const amountAtSchemeAge =
    basis === "current-deferred" ? enteredAnnual * getAnnualFactor(revaluationPct, yearsToSchemeAge) : enteredAnnual;
  let included = false;
  let annual = 0;
  let startsLater = false;
  let adjustedEarly = false;
  let adjustedLate = false;

  if (amountAtSchemeAge > 0 && schemeAge !== null) {
    if (selectedAge < schemeAge) {
      startsLater = true;
      if (adjustmentPct !== 0 && selectedAge >= 55) {
        annual = amountAtSchemeAge * getAnnualFactor(adjustmentPct, schemeAge - selectedAge);
        included = annual > 0;
        adjustedEarly = included;
        startsLater = !included;
      }
    } else {
      const yearsAfterSchemeAge = selectedAge - schemeAge;
      const indexationFactor = getAnnualFactor(indexationPct, yearsAfterSchemeAge);
      const lateFactor = adjustmentPct > 0 ? getAnnualFactor(adjustmentPct, yearsAfterSchemeAge) : 1;
      annual = amountAtSchemeAge * indexationFactor * lateFactor;
      included = annual > 0;
      adjustedLate = yearsAfterSchemeAge > 0 && lateFactor !== 1;
    }
  }

  return {
    enteredAnnual,
    annual,
    amountAtSchemeAge,
    schemeAge,
    included,
    startsLater,
    basis,
    revaluationPct,
    indexationPct,
    adjustmentPct,
    adjustedEarly,
    adjustedLate,
  };
}

function getDbBenefitSummary(state = appState, atAge = state.retireAge) {
  const current = getCurrentEmploymentRecord(state);
  const entries = [current]
    .filter((record) => record && hasDbArrangementComponent(record.pensionType))
    .map((record) => {
      const details = getDbIncomeDetails(record, state, atAge);
      return {
        id: record.id,
        employerName: record.employerName,
        periodLabel: record.periodLabel,
        annual: details.annual,
        enteredAnnual: details.enteredAnnual,
        amountAtSchemeAge: details.amountAtSchemeAge,
        schemeAge: details.schemeAge,
        included: details.included,
        startsLater: details.startsLater,
        details,
      };
    })
    .filter((entry) => entry.enteredAnnual > 0 || entry.schemeAge !== null);

  const eligibleEntries = entries.filter((entry) => entry.included);
  const laterEntries = entries.filter((entry) => entry.startsLater && entry.amountAtSchemeAge > 0 && entry.schemeAge !== null);
  const missingAgeEntries = entries.filter((entry) => entry.enteredAnnual > 0 && entry.schemeAge === null);

  return {
    entries,
    eligibleYearlyIncome: eligibleEntries.reduce((sum, entry) => sum + entry.annual, 0),
    laterYearlyIncome: laterEntries.reduce((sum, entry) => sum + entry.amountAtSchemeAge, 0),
    nextStartAge: laterEntries.length ? Math.min(...laterEntries.map((entry) => entry.schemeAge)) : null,
    hasDb: entries.some((entry) => entry.enteredAnnual > 0 || entry.amountAtSchemeAge > 0),
    missingAgeCount: missingAgeEntries.length,
  };
}

function isPreviousDbBearingRecord(record) {
  return Boolean(
    record &&
      record.status !== "current" &&
      hasDbArrangementComponent(record.pensionType) &&
      Math.max(0, toNumber(record.dbAnnualPensionAtSchemeAge)) > 0
  );
}

function getPreviousDbBenefitSummary(state = appState, atAge = state.retireAge) {
  const entries = getEmploymentHistoryForState(state)
    .filter((record) => isPreviousDbBearingRecord(record))
    .map((record) => {
      const details = getDbIncomeDetails(record, state, atAge);
      return {
        id: record.id,
        employerName: record.employerName,
        periodLabel: record.periodLabel,
        annual: details.annual,
        enteredAnnual: details.enteredAnnual,
        amountAtSchemeAge: details.amountAtSchemeAge,
        schemeAge: details.schemeAge,
        included: details.included,
        startsLater: details.startsLater,
        details,
      };
    });

  const eligibleEntries = entries.filter((entry) => entry.included);
  const laterEntries = entries.filter((entry) => entry.startsLater && entry.amountAtSchemeAge > 0 && entry.schemeAge !== null);
  const missingAgeEntries = entries.filter((entry) => entry.enteredAnnual > 0 && entry.schemeAge === null);

  return {
    entries,
    eligibleYearlyIncome: eligibleEntries.reduce((sum, entry) => sum + entry.annual, 0),
    laterYearlyIncome: laterEntries.reduce((sum, entry) => sum + entry.amountAtSchemeAge, 0),
    nextStartAge: laterEntries.length ? Math.min(...laterEntries.map((entry) => entry.schemeAge)) : null,
    hasDb: entries.some((entry) => entry.enteredAnnual > 0 || entry.amountAtSchemeAge > 0),
    missingAgeCount: missingAgeEntries.length,
  };
}

function currentDcUsesMixedHistory(state = appState) {
  const current = getCurrentEmploymentRecord(state);
  return current?.pensionType === "DC" && getPreviousDbBenefitSummary(state, state.retireAge).hasDb;
}

function currentDcUsesMixedHistoryWithState(state = appState) {
  return currentDcUsesMixedHistory(state) && Math.max(0, toNumber(state.statePension)) > 0;
}

function getSimpleStatePensionWeeklyForYears(years) {
  const qualifyingYears = Math.max(0, Math.min(STATE_PENSION_FULL_RATE_YEARS, Math.round(toNumber(years))));
  if (qualifyingYears < STATE_PENSION_MIN_QUALIFYING_YEARS) return 0;
  return FULL_NEW_STATE_PENSION_WEEKLY_2026_27 * (qualifyingYears / STATE_PENSION_FULL_RATE_YEARS);
}

function getStatePensionIllustrationRows() {
  return [9, 10, 20, 30, 35].map((years) => {
    const weekly = getSimpleStatePensionWeeklyForYears(years);
    return [
      years < STATE_PENSION_MIN_QUALIFYING_YEARS ? "Under 10 years" : `${years} qualifying years`,
      years < STATE_PENSION_MIN_QUALIFYING_YEARS ? `${formatPreciseMoney(0)} / week` : `${formatPreciseMoney(weekly)} / week`,
    ];
  });
}

function getStatePensionQualificationNote(state = appState) {
  const tenthYearWeekly = getSimpleStatePensionWeeklyForYears(STATE_PENSION_MIN_QUALIFYING_YEARS);
  const intro = `Simple new-State-Pension illustration: fewer than ${STATE_PENSION_MIN_QUALIFYING_YEARS} qualifying years usually means no pension, ${STATE_PENSION_MIN_QUALIFYING_YEARS} years usually unlock about ${formatPreciseMoney(
    tenthYearWeekly
  )} / week, between ${STATE_PENSION_MIN_QUALIFYING_YEARS} and ${STATE_PENSION_FULL_RATE_YEARS - 1} years the simple illustration is about 1/35 of the full weekly rate for each qualifying year, and ${STATE_PENSION_FULL_RATE_YEARS} years usually reach the full ${formatPreciseMoney(
    FULL_NEW_STATE_PENSION_WEEKLY_2026_27
  )} / week rate.`;
  if (state.meta?.starterMode === "example-mixed-state" || state.meta?.starterMode === "example-state") {
    return `${intro} This demo uses the full-rate example.`;
  }
  return `${intro} Contracted-out or pre-2016 records can differ from this simple rule.`;
}

function projectionHasPrivatePensionIhtExposure(projection) {
  return Boolean(projection && (isProjectedDcArrangement(projection.currentType) || hasMixedHistoryGoalView(projection)));
}

function shouldSurfaceEstatePlanningNote(projection) {
  if (!projectionHasPrivatePensionIhtExposure(projection)) return false;
  return (
    projection.projectedPot >= 300000 ||
    toNumber(appState.lifeFactors?.dependants) > 0 ||
    normalizeSurvivorNeed(appState.lifeFactors?.survivorNeed) === "high" ||
    appState.assistantTopic === "household"
  );
}

function getPrivatePensionIhtShortNote(projection) {
  if (!projectionHasPrivatePensionIhtExposure(projection)) return "";
  return `From ${PENSION_IHT_CHANGE_DATE}, unused private pension money may count for Inheritance Tax. Most estates still pay no IHT, so treat this as an estate-planning check, not a monthly-income warning.`;
}

function getPrivatePensionIhtLongNote(projection) {
  if (!projectionHasPrivatePensionIhtExposure(projection)) return "";
  return `From ${PENSION_IHT_CHANGE_DATE}, unused private pension money may count for Inheritance Tax. Most estates still pay no IHT, and State Pension is separate. Check this only if estate planning or death benefits matter to you.`;
}

function getStatePensionSummary(state = appState, atAge = state.retireAge) {
  const annual = Math.max(0, toNumber(state.statePension));
  const startAge = normalizeStatePensionAge(state.statePensionAge);
  const included = annual > 0 && atAge >= startAge;
  return {
    annual,
    startAge,
    included,
    yearlyIncome: included ? annual : 0,
  };
}

function getAnnualNetGrowthPct(state = appState) {
  return toNumber(state.growthPct) - Math.max(0, toNumber(state.annualChargePct));
}

function getProjectionMonthlyRate(state = appState) {
  return getAnnualNetGrowthPct(state) / 100 / 12;
}

function getAnnualFactor(percent, years) {
  return (1 + toNumber(percent) / 100) ** Math.max(0, toNumber(years));
}

function getInflationFactor(state = appState, years = Math.max(0, toNumber(state.retireAge) - toNumber(state.age))) {
  return getAnnualFactor(Math.max(0, toNumber(state.inflationPct)), years);
}

function getDisplayMoneyFactor(state = appState, years = Math.max(0, toNumber(state.retireAge) - toNumber(state.age))) {
  return normalizeMoneyMode(state.moneyMode) === "today" ? 1 / getInflationFactor(state, years) : 1;
}

function displayYearlyIncome(projection, yearlyIncome, age = projection.state.retireAge) {
  return yearlyIncome * getDisplayMoneyFactor(projection.state, Math.max(0, toNumber(age) - toNumber(projection.state.age)));
}

function formatProjectionMoney(projection, value, age = projection.state.retireAge) {
  return formatMoney(value * getDisplayMoneyFactor(projection.state, Math.max(0, toNumber(age) - toNumber(projection.state.age))));
}

function getContributionEscalationFactorForMonth(state, monthIndex) {
  return getAnnualFactor(Math.max(0, toNumber(state.contributionEscalationPct)), Math.max(0, monthIndex) / 12);
}

function futureValueOfEscalatingMonthly(baseMonthly, monthlyRate, months, escalationPct = 0) {
  let value = 0;
  for (let month = 1; month <= months; month += 1) {
    const contribution = baseMonthly * getAnnualFactor(escalationPct, (month - 1) / 12);
    value = monthlyRate === 0 ? value + contribution : value * (1 + monthlyRate) + contribution;
  }
  return value;
}

function getAnnualContributionBase(state = appState, annualSalaryOverride = null) {
  const hasOverride = annualSalaryOverride !== null && annualSalaryOverride !== undefined && annualSalaryOverride !== "";
  const annualSalary = Math.max(0, hasOverride ? toNumber(annualSalaryOverride) : toNumber(state.salary));
  return getContributionBaseForPayBasis(annualSalary, state.pensionablePayBasis);
}

function getContributionBreakdown(state) {
  const contributionEnabled = currentRecordSupportsDcProjection(state);
  const annualContributionBase = contributionEnabled ? getAnnualContributionBase(state) : 0;
  const monthlyContributionBase = annualContributionBase / 12;
  const employerMonthly = monthlyContributionBase * (state.employerContributionPct / 100);
  const employeeMonthly = monthlyContributionBase * (state.employeeContributionPct / 100);
  return {
    employerMonthly,
    employeeMonthly,
    totalMonthly: employerMonthly + employeeMonthly,
  };
}

function buildProjectionSeries(state, options = {}) {
  const years = Math.max(0, state.retireAge - state.age);
  const months = years * 12;
  const monthlyRate = getProjectionMonthlyRate(state);
  const contributionEnabled = currentRecordSupportsDcProjection(state);
  const currentPrivateWealth = totalPrivatePensionWealth(state);
  let pot = currentPrivateWealth;
  const points = [{ age: state.age, months: 0, pot }];

  for (let month = 1; month <= months; month += 1) {
    const salaryFactor = options.salaryFactorForMonth ? options.salaryFactorForMonth(month - 1, state) : 1;
    const salaryGrowthFactor = getAnnualFactor(Math.max(0, toNumber(state.salaryGrowthPct)), (month - 1) / 12);
    const scenarioContributionFactor = options.contributionFactorForMonth ? options.contributionFactorForMonth(month - 1, state) : 1;
    const contributionEscalationFactor = getContributionEscalationFactorForMonth(state, month - 1);
    const contributionFactor = scenarioContributionFactor * contributionEscalationFactor;
    const annualContributionBase = contributionEnabled ? getAnnualContributionBase(state, state.salary * salaryGrowthFactor * salaryFactor) : 0;
    const monthlyContributionBase = annualContributionBase / 12;
    const extraMonthlyContribution = options.extraMonthlyContributionForMonth
      ? options.extraMonthlyContributionForMonth(month - 1, state)
      : 0;
    const monthlyContribution =
      (monthlyContributionBase * (state.employerContributionPct / 100) + monthlyContributionBase * (state.employeeContributionPct / 100)) *
        contributionFactor +
      extraMonthlyContribution;

    pot = monthlyRate === 0 ? pot + monthlyContribution : pot * (1 + monthlyRate) + monthlyContribution;

    if (month % 12 === 0 || month === months) {
      points.push({ age: state.age + month / 12, months: month, pot });
    }
  }

  return {
    years,
    months,
    monthlyRate,
    currentPrivateWealth,
    projectedPot: pot,
    points,
  };
}

function buildProjectionResult(state, series, extras = {}) {
  const { employerMonthly, employeeMonthly, totalMonthly } = getContributionBreakdown(state);
  const modeDetails = getProjectionModeDetails(state);
  const dbSummary = getDbBenefitSummary(state, state.retireAge);
  const previousDbSummary = getPreviousDbBenefitSummary(state, state.retireAge);
  const statePensionSummary = getStatePensionSummary(state, state.retireAge);
  const projectedPot = series.projectedPot;
  const dcProjectedYearlyIncome = projectedPot * (state.drawdownPct / 100);
  const dbYearlyIncome = dbSummary.eligibleYearlyIncome;
  const previousDbYearlyIncome = previousDbSummary.eligibleYearlyIncome;
  const privateYearlyIncome = dcProjectedYearlyIncome + dbYearlyIncome + previousDbYearlyIncome;
  const includesMixedStatePension = modeDetails.includesMixedStatePension;
  const stateYearlyIncome = statePensionSummary.yearlyIncome;
  const projectedYearlyIncome = privateYearlyIncome + stateYearlyIncome;
  const enteredTargetYearlyIncome = state.targetMonthlyIncome * 12;
  const inflationFactor = getInflationFactor(state, series.years);
  const moneyMode = normalizeMoneyMode(state.moneyMode);
  const targetYearlyIncome = enteredTargetYearlyIncome * inflationFactor;
  const gap = targetYearlyIncome - projectedYearlyIncome;
  const targetPot =
    Math.max(0, targetYearlyIncome - stateYearlyIncome - dbYearlyIncome - previousDbYearlyIncome) / ((state.drawdownPct / 100) || 0.04);
  const hasGoal = targetYearlyIncome > 0;

  return {
    years: series.years,
    months: series.months,
    employerMonthly,
    employeeMonthly,
    totalMonthly,
    currentPrivateWealth: series.currentPrivateWealth,
    projectedPot,
    dcProjectedYearlyIncome,
    dbYearlyIncome,
    dbSummary,
    previousDbSummary,
    previousDbYearlyIncome,
    statePensionSummary,
    stateYearlyIncome,
    privateYearlyIncome,
    projectedYearlyIncome,
    enteredTargetYearlyIncome,
    targetYearlyIncome,
    hasGoal,
    gap,
    inflationFactor,
    moneyMode,
    displayFactor: moneyMode === "today" ? 1 / inflationFactor : 1,
    displayProjectedYearlyIncome: moneyMode === "today" ? projectedYearlyIncome / inflationFactor : projectedYearlyIncome,
    displayTargetYearlyIncome: moneyMode === "today" ? enteredTargetYearlyIncome : targetYearlyIncome,
    displayGap: moneyMode === "today" ? enteredTargetYearlyIncome - projectedYearlyIncome / inflationFactor : gap,
    netGrowthPct: getAnnualNetGrowthPct(state),
    coverage: hasGoal ? projectedYearlyIncome / targetYearlyIncome : 0,
    targetPot,
    series: series.points,
    state,
    mode: modeDetails.mode,
    hasDcAssets: hasProjectedDcAssets(state),
    isDbLed: modeDetails.mode === "income-mix",
    usesIncomeMix: modeDetails.mode === "income-mix",
    isBlocked: modeDetails.mode === "blocked",
    currentType: modeDetails.currentType,
    hasUnknownBlocker: modeDetails.hasUnknownBlocker,
    blockedUnknownRecords: modeDetails.blockedUnknownRecords,
    hasDbSource: modeDetails.hasAnyDbSource,
    hasDcSource: modeDetails.hasAnyDcSource,
    isPureStateOnly: modeDetails.isPureStateOnly,
    hasPreviousDbHistory: modeDetails.hasPreviousDbHistory,
    hasStatePensionForecast: modeDetails.hasStatePensionForecast,
    includesMixedStatePension,
    ...extras,
  };
}

function calculateProjection(overrides = {}) {
  const state = { ...appState, ...overrides };
  const series = buildProjectionSeries(state);
  return buildProjectionResult(state, series);
}

function getScenarioControlConfig(type = appState.scenarioModel?.type) {
  const config = {
    none: { label: "Scenario value", value: 0, min: 0, max: 0, step: 1, hidden: true },
    "retire-later": { label: "Years later", value: appState.scenarioModel?.retireLaterYears || 2, min: 1, max: 15, step: 1, hidden: false },
    "raise-contributions": {
      label: "Extra employee contribution %",
      value: appState.scenarioModel?.extraEmployeePct || 2,
      min: 0.5,
      max: 15,
      step: 0.5,
      hidden: false,
    },
    "pause-saving": { label: "Months paused", value: appState.scenarioModel?.pauseMonths || 12, min: 1, max: 36, step: 1, hidden: false },
    "lower-earnings": { label: "Lower earnings %", value: appState.scenarioModel?.lowerEarningsPct || 10, min: 1, max: 50, step: 1, hidden: false },
    "restart-after-pause": {
      label: "Restart contribution increase %",
      value: appState.scenarioModel?.extraEmployeePct || 2,
      min: 0.5,
      max: 15,
      step: 0.5,
      hidden: false,
    },
    "split-savings": {
      label: "Extra pension saving / month",
      value: appState.scenarioModel?.splitExtraMonthly || 100,
      min: 25,
      max: 1000,
      step: 25,
      hidden: false,
    },
  };
  return config[type] || config.none;
}

function calculateScenarioProjection(model = appState.scenarioModel, baseState = appState) {
  const nextModel = { ...createDefaultScenarioModel(), ...(model || {}) };
  if (nextModel.type === "none") return null;

  const state = { ...baseState };
  let series;
  let label = "";
  let shortEffect = "";
  const assumptions = [];

  if (nextModel.type === "retire-later") {
    const yearsLater = Math.max(1, Math.round(nextModel.retireLaterYears || 2));
    state.retireAge = state.retireAge + yearsLater;
    label = `Retire ${yearsLater} year${yearsLater === 1 ? "" : "s"} later`;
    shortEffect = `Work and contribute for ${yearsLater} extra year${yearsLater === 1 ? "" : "s"} before retiring.`;
    assumptions.push(`Retirement age moves from ${appState.retireAge} to ${state.retireAge}.`);
    series = buildProjectionSeries(state);
  } else if (nextModel.type === "raise-contributions") {
    const extraPct = Math.max(0.5, nextModel.extraEmployeePct || 2);
    state.employeeContributionPct = state.employeeContributionPct + extraPct;
    label = `Increase your contribution by ${formatPct(extraPct)}`;
    shortEffect = `Your own contribution rises from ${formatPct(appState.employeeContributionPct)} to ${formatPct(state.employeeContributionPct)}.`;
    assumptions.push("Employer contribution stays at the current percentage.");
    series = buildProjectionSeries(state);
  } else if (nextModel.type === "pause-saving") {
    const pauseMonths = Math.max(1, Math.round(nextModel.pauseMonths || 12));
    label = `Pause pension saving for ${pauseMonths} month${pauseMonths === 1 ? "" : "s"}`;
    shortEffect = `Assumes both employer and user pension contributions stop for ${pauseMonths} month${pauseMonths === 1 ? "" : "s"}, then restart at the current rate.`;
    assumptions.push("The current pot remains invested during the pause.");
    series = buildProjectionSeries(state, {
      contributionFactorForMonth: (monthIndex) => (monthIndex < pauseMonths ? 0 : 1),
    });
  } else if (nextModel.type === "lower-earnings") {
    const dropPct = Math.max(1, nextModel.lowerEarningsPct || 10);
    state.salary = state.salary * (1 - dropPct / 100);
    label = `Earnings stay ${formatPct(dropPct)} lower`;
    shortEffect = `Salary is modelled at ${formatMoney(state.salary)} instead of ${formatMoney(appState.salary)}.`;
    assumptions.push("Contribution percentages stay the same but are applied to lower pay.");
    series = buildProjectionSeries(state);
  } else if (nextModel.type === "restart-after-pause") {
    const pauseMonths = Math.max(1, Math.round(appState.shortTermSavings?.pauseMonths || 6));
    const extraPct = Math.max(0.5, nextModel.extraEmployeePct || 2);
    label = `Restart saving after ${pauseMonths} month${pauseMonths === 1 ? "" : "s"} with +${formatPct(extraPct)}`;
    shortEffect = `Assumes contributions pause for ${pauseMonths} month${pauseMonths === 1 ? "" : "s"}, then your own rate restarts ${formatPct(
      extraPct
    )} higher than now.`;
    assumptions.push("Employer contribution returns at the current percentage once saving restarts.");
    series = buildProjectionSeries(state, {
      contributionFactorForMonth: (monthIndex) => (monthIndex < pauseMonths ? 0 : 1),
      extraMonthlyContributionForMonth: (monthIndex, currentState) =>
        monthIndex < pauseMonths ? 0 : ((currentState.salary / 12) * extraPct) / 100,
    });
  } else if (nextModel.type === "split-savings") {
    const extraMonthly = Math.max(25, nextModel.splitExtraMonthly || appState.scenarioModel?.splitExtraMonthly || 100);
    label = `Put ${formatMoney(extraMonthly)} more per month into pension`;
    shortEffect = `Models an extra ${formatMoney(extraMonthly)} a month into pension from flexible saving money after the current cash plan.`;
    assumptions.push("This does not reduce the existing pension contribution percentages already entered in the record.");
    series = buildProjectionSeries(state, {
      extraMonthlyContributionForMonth: () => extraMonthly,
    });
  }

  return buildProjectionResult(state, series, {
    type: nextModel.type,
    label,
    shortEffect,
    assumptions,
  });
}

function getActiveScenarioProjection(baseProjection = calculateProjection()) {
  ensureScenarioState();
  return calculateScenarioProjection(appState.scenarioModel, baseProjection.state);
}

function compoundMonthly(presentValue, monthlyContribution, monthlyRate, months) {
  if (months <= 0) return presentValue;
  if (monthlyRate === 0) return presentValue + monthlyContribution * months;
  const growth = (1 + monthlyRate) ** months;
  return presentValue * growth + monthlyContribution * ((growth - 1) / monthlyRate);
}

function formatMoney(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `GBP ${moneyFormat.format(Math.round(safeValue))}`;
}

function formatPct(value) {
  return `${percentFormat.format(value)}%`;
}

function formatPreciseMoney(value, decimals = 2) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `GBP ${safeValue.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getEmploymentLabel(value = appState.employmentType) {
  const type = normalizeEmploymentType(value);
  const labels = {
    employee: "Employee",
    multiple: "Multiple jobs",
    "part-time": "Part-time worker",
    self: "Self-employed",
  };
  return labels[type] || "Employee";
}

function getPlanLabel(type = appState.pensionType) {
  const labels = {
    DC: "DC (Defined contribution pension)",
    DB: "DB (Defined benefit pension)",
    Hybrid: "Hybrid pension",
    "State-only": "State Pension only",
    Unknown: "Unknown arrangement",
  };
  return labels[type] || labels.Unknown;
}

function getPlanDetail(type = appState.pensionType) {
  const details = {
    DC: "This is a pension savings pot in your name. Money usually goes in from you, your employer and tax relief, then it is invested. The final amount is not guaranteed and depends on contributions, investment performance, charges and how you take the money later.",
    DB: "This is a benefit promise entered in the record. Pensionable salary, service, accrual rate and scheme rules matter most.",
    Hybrid: "This is a mixed arrangement entered in the record. Capture both the DC pot side and the statement-based DB promise separately.",
    "State-only":
      "Only State Pension has been entered. It is not automatic: under the simple new-State-Pension model you usually need at least 10 qualifying National Insurance years for any amount, and the full 2026/27 rate is usually reached at 35 qualifying years after April 2016 rules.",
    Unknown: "No scheme type has been entered. The app should not guess; check documents or ask the provider.",
  };
  return details[type] || details.Unknown;
}

function getGoalInputModeCopy(type = appState.pensionType) {
  if (type === "DC" && currentDcUsesMixedHistory()) {
    return currentDcUsesMixedHistoryWithState()
      ? "Using the current DC record as the main projection, with one or more previous DB promises and the entered State Pension forecast added separately."
      : "Using the current DC record as the main projection, with one or more previous DB promises added separately.";
  }
  const copy = {
    DC: "Using the current DC record for the pot projection, with any entered State Pension forecast added at State Pension age.",
    DB: "Using the current DB pension amount and scheme age, with any entered State Pension forecast added at State Pension age.",
    Hybrid: "Using the current hybrid record for a combined DC and DB comparison, with any entered State Pension forecast added at State Pension age.",
    "State-only": "Using the current State Pension only record for this comparison.",
    Unknown: "Confirm the current arrangement in Pension Record to unlock the right comparison.",
  };
  return copy[type] || copy.Unknown;
}

function formatMonthlyGoalValue(projection) {
  if (!projection?.hasGoal) return "Not entered yet";
  const monthly = projection.moneyMode === "today" ? projection.enteredTargetYearlyIncome / 12 : projection.targetYearlyIncome / 12;
  return `${formatMoney(monthly)} ${projection.moneyMode === "today" ? "today" : "nominal"}`;
}

function formatCoverageValue(projection) {
  return projection?.hasGoal ? `${Math.round(projection.coverage * 100)}%` : "Enter goal first";
}

function formatGapToGoalValue(projection, suffix = "") {
  if (!projection?.hasGoal) return "Enter goal first";
  const gap = projection.displayGap ?? projection.gap;
  const value = gap > 0 ? `${formatMoney(gap / 12)} short` : `${formatMoney(Math.abs(gap / 12))} above`;
  return suffix ? `${value}${suffix}` : value;
}

function formatStatePensionProjectionValue(projection, unit = "month") {
  if (!projection?.statePensionSummary) return unit === "year" ? formatMoney(appState.statePension) : formatMoney(appState.statePension / 12);
  if (!projection.statePensionSummary.included) {
    return `Starts at age ${projection.statePensionSummary.startAge}`;
  }
  return unit === "year"
    ? formatProjectionMoney(projection, projection.statePensionSummary.yearlyIncome)
    : formatProjectionMoney(projection, projection.statePensionSummary.yearlyIncome / 12);
}

function getGoalProgressStatusCopy(projection) {
  if (!projection?.hasGoal) return "Add a monthly retirement goal to measure coverage and gap";
  return (projection.displayGap ?? projection.gap) > 0 ? "Still short per month" : "Above target per month";
}

function getProjectionBlockerCopy(projection) {
  return "The current record is still marked Unknown. Confirm whether it is DC, DB, Hybrid or State Pension only before using the retirement projection.";
}

function getProjectionMixBadge(projection) {
  if (projection.hasPreviousDbHistory && projection.includesMixedStatePension) {
    return "DC + previous DB + State Pension";
  }
  if (projection.hasPreviousDbHistory) {
    return "DC + previous DB";
  }
  if (projection.currentType === "DB" && projection.hasStatePensionForecast) {
    return "DB + State Pension";
  }
  if (projection.currentType === "Hybrid" && projection.hasStatePensionForecast) {
    return "Hybrid + State Pension";
  }
  if (projection.hasDcAssets && projection.hasStatePensionForecast) {
    return "DC + State Pension";
  }
  if (projection.currentType === "DB") {
    return "DB only";
  }
  if (projection.currentType === "Hybrid") {
    return "Hybrid only";
  }
  if (projection.currentType === "State-only") {
    return "State Pension only";
  }
  if (projection.hasDcAssets) {
    return "DC only";
  }
  return "Current record";
}

function getProjectionAssumptionCopy(projection) {
  if (projection.isBlocked) {
    return "Projection blocked until the arrangement is confirmed.";
  }
  const stateForecastCopy = projection.hasStatePensionForecast ? " The entered State Pension forecast is added when the selected age has reached State Pension age." : "";
  const dcAssumptionCopy = `${formatPct(projection.state.growthPct)} growth, ${formatPct(projection.state.annualChargePct)} charges, ${formatPct(projection.netGrowthPct)} net growth, ${formatPct(projection.state.drawdownPct)} withdrawal`;
  if (projection.hasPreviousDbHistory) {
    return projection.includesMixedStatePension
      ? `${dcAssumptionCopy} on the current DC record, with previous DB promises and the entered State Pension forecast treated as fixed supplements.`
      : `${dcAssumptionCopy} on the current DC record, with previous DB promises treated as fixed supplements.`;
  }
  if (projection.dbSummary?.hasDb) {
    return projection.currentType === "Hybrid"
      ? `${dcAssumptionCopy}, plus the current DB statement amount.${stateForecastCopy}`
      : `Current DB statement amount and scheme age.${stateForecastCopy}`;
  }
  if (projection.currentType === "State-only") {
    return "State Pension forecast and State Pension age entered as shown";
  }
  return `${dcAssumptionCopy} on the current DC record.${stateForecastCopy}`;
}

function getGoalLayoutConfig(projection) {
  const type = projection.isBlocked ? "Unknown" : projection.currentType;
  const hasDcTools = !projection.isBlocked && projection.hasDcAssets;
  const hasInvestmentGuide = !projection.isBlocked && supportsDcInvestmentSettings(projection.currentType);

  const shared = {
    showAssumptionPanel: hasDcTools,
    showScenarioPanel: false,
    showSelfSelectPanel: hasInvestmentGuide,
    showStatusPanel: !projection.isBlocked && !projection.usesIncomeMix,
    assumptionEyebrow: "Projection assumptions",
    assumptionCopy: "Compare cautious, base and optimistic paths for the current DC record.",
    scenarioSummary: "Assistant what-if",
    scenarioIntro: "Ask the AI Assistant for plain-English what-if examples instead of using a separate scenario panel.",
    stepTwoCopy: "These optional checks are user-entered. Add only the cash, household, adequacy or investment details that matter; the app then calculates the result from what you enter.",
    stepThreeTitle: "Compare result",
    stepThreeCopy: projection.usesIncomeMix
      ? "See the separate pension sources and the short result rows."
      : "Review the projected pot path and the compact result rows.",
    statusEyebrow: "Status",
    statusHeading: "Comparison status",
    inputHeading: "Set your target",
    compareHeading: "Current comparison",
  };

  if (type === "DB") {
    return {
      ...shared,
      sectionCopy: "Use the current DB record to compare its statement income against your goal.",
      stepOneTitle: "Set target",
      stepOneCopy: "Enter the current DB amount, scheme age, retirement-income goal, and any State Pension forecast.",
      stepTwoTitle: "Stress-test",
      stepTwoCopy: "These optional checks are user-entered. For DB, the main result still comes from the statement amount, scheme age and any State Pension forecast.",
      assumptionEyebrow: "DB record",
      assumptionCopy: "The DB result does not use DC pot-growth assumptions.",
      scenarioSummary: "DB record",
      scenarioIntro: "The DB result uses the current statement amount and scheme age.",
      stepThreeCopy: "See the current DB pension result at the selected comparison age.",
      showAssumptionPanel: false,
      showScenarioPanel: false,
      showSelfSelectPanel: false,
      showStatusPanel: false,
    };
  }

  if (type === "Hybrid") {
    return {
      ...shared,
      sectionCopy: "Use the current hybrid record to compare its DC and DB sides against your goal.",
      stepOneTitle: "Set target",
      stepOneCopy: "Enter the current DC balance, DB amount, scheme age, retirement-income goal, and any State Pension forecast.",
      stepTwoTitle: "Stress-test",
      stepTwoCopy: "These optional checks are user-entered. In a hybrid record, investment and assumption checks affect only the DC side; the DB amount stays separate.",
      assumptionEyebrow: "DC-side assumptions",
      assumptionCopy: "These assumption paths change only the current hybrid record's DC side. The DB amount stays fixed.",
      scenarioSummary: "DC-side scenarios",
      scenarioIntro: "Any scenario change here applies only to the current hybrid record's DC side.",
      stepThreeCopy: "See the current hybrid DB and DC result at the selected comparison age.",
      showStatusPanel: false,
    };
  }

  if (type === "State-only") {
    return {
      ...shared,
      sectionCopy: "Use the current State Pension only record to compare the forecast against your goal.",
      stepOneTitle: "Set target",
      stepOneCopy: "Enter the retirement-income goal, State Pension forecast, and retirement ages for this state-led comparison.",
      stepTwoTitle: "Stress-test",
      stepTwoCopy: "These optional checks are user-entered. For State Pension only, use them mainly for cash, household and adequacy pressure, not private-pot growth.",
      assumptionEyebrow: "State Pension record",
      assumptionCopy: "The State Pension result does not use DC pot-growth assumptions.",
      scenarioSummary: "State Pension record",
      scenarioIntro: "The State Pension result uses the entered forecast and State Pension age.",
      stepThreeCopy: "See the State Pension result at the selected comparison age.",
      showAssumptionPanel: false,
      showScenarioPanel: false,
      showSelfSelectPanel: false,
      showStatusPanel: false,
    };
  }

  if (type === "Unknown") {
    return {
      ...shared,
      sectionCopy: "Confirm the current arrangement in Pension Record before relying on this page.",
      stepOneTitle: "Confirm arrangement",
      stepOneCopy: "The goal page stays blocked until the current record is reclassified.",
      stepTwoTitle: "Stress-test",
      stepTwoCopy: "Advanced comparison tools stay hidden until the arrangement is confirmed.",
      stepThreeCopy: "Confirm the arrangement to unlock the right chart and result rows.",
      showAssumptionPanel: false,
      showScenarioPanel: false,
      showSelfSelectPanel: false,
      showStatusPanel: false,
    };
  }

  return {
    ...shared,
    sectionCopy: projection.hasPreviousDbHistory
      ? projection.includesMixedStatePension
        ? "Use the current DC record as the main projection, then add any previous DB promise and the entered State Pension forecast separately."
        : "Use the current DC record as the main projection, then add any previous DB promise separately."
      : "Use the current DC record, and any entered State Pension forecast, to compare the projected result against your retirement-income goal.",
    stepOneTitle: "Set target",
    stepOneCopy: projection.hasPreviousDbHistory
      ? projection.includesMixedStatePension
        ? "Enter the current DC balance, retirement age, and income goal. Previous DB promises and the entered State Pension forecast stay separate from the current DC inputs."
        : "Enter the current DC balance, retirement age, and income goal. Previous DB promises stay separate from the current DC inputs."
      : "Enter the current DC balance, retirement age, income goal, and any State Pension forecast for the projection.",
    stepTwoTitle: "Stress-test",
    inputHeading: "Set your DC inputs",
    compareHeading: projection.hasPreviousDbHistory
      ? projection.includesMixedStatePension
        ? "DC + DB + State Pension comparison"
        : "DC + previous DB comparison"
      : "DC comparison",
    assumptionCopy: projection.hasPreviousDbHistory
      ? projection.includesMixedStatePension
        ? "These assumption paths change only the current DC record. Previous DB promises and the entered State Pension forecast stay fixed."
        : "These assumption paths change only the current DC record. Previous DB promises stay fixed."
      : shared.assumptionCopy,
    scenarioIntro: projection.hasPreviousDbHistory
      ? projection.includesMixedStatePension
        ? "Any scenario change here applies only to the current DC record. Previous DB promises and the entered State Pension forecast stay fixed."
        : "Any scenario change here applies only to the current DC record. Previous DB promises stay fixed."
      : shared.scenarioIntro,
    stepThreeCopy: projection.hasPreviousDbHistory
      ? projection.includesMixedStatePension
        ? "Review the projected DC pot path, then compare the DC result with previous DB promises and the entered State Pension forecast at the selected age."
        : "Review the projected DC pot path, then compare the DC result with previous DB promises at the selected age."
      : shared.stepThreeCopy,
    showStatusPanel: true,
  };
}

function syncGoalLayout(projection) {
  const config = getGoalLayoutConfig(projection);
  if (els.goalSectionCopy) els.goalSectionCopy.textContent = config.sectionCopy;
  if (els.goalStepOneTitle) els.goalStepOneTitle.textContent = config.stepOneTitle;
  if (els.goalStepOneCopy) els.goalStepOneCopy.textContent = config.stepOneCopy;
  if (els.goalInputHeading) els.goalInputHeading.textContent = config.inputHeading;
  if (els.goalCompareHeading) els.goalCompareHeading.textContent = config.compareHeading;
  if (els.goalStepTwoTitle) els.goalStepTwoTitle.textContent = config.stepTwoTitle;
  if (els.goalStepTwoCopy) els.goalStepTwoCopy.textContent = config.stepTwoCopy;
  if (els.goalStepThreeTitle) els.goalStepThreeTitle.textContent = config.stepThreeTitle;
  if (els.goalStepThreeCopy) els.goalStepThreeCopy.textContent = config.stepThreeCopy;
  if (els.assumptionPanelEyebrow) els.assumptionPanelEyebrow.textContent = config.assumptionEyebrow;
  if (els.assumptionPathCopy) els.assumptionPathCopy.textContent = config.assumptionCopy;
  if (els.scenarioPanelSummary) els.scenarioPanelSummary.textContent = config.scenarioSummary;
  if (els.scenarioIntroCopy) els.scenarioIntroCopy.textContent = config.scenarioIntro;
  if (els.scenarioPanel) els.scenarioPanel.hidden = !config.showScenarioPanel;
  if (els.selfSelectPanel) els.selfSelectPanel.hidden = !config.showSelfSelectPanel;
  if (els.goalStatusEyebrow) els.goalStatusEyebrow.textContent = config.statusEyebrow;
  if (els.goalStatusHeading) els.goalStatusHeading.textContent = config.statusHeading;
  if (els.goalStatusPanel) els.goalStatusPanel.hidden = !config.showStatusPanel;
}

function syncGoalDetailGridVisibility() {
  if (!els.goalDetailGrid) return;
  const statusHidden = els.goalStatusPanel ? Boolean(els.goalStatusPanel.hidden) : true;
  const pathwayHidden = els.goalPathwayPanel ? Boolean(els.goalPathwayPanel.hidden) : true;
  els.goalDetailGrid.hidden = statusHidden && pathwayHidden;
}

function renderRows(target, rows) {
  target.innerHTML = renderRowsMarkup(rows);
}

function getContributionMismatch() {
  const expected = appState.payslipContribution + getAnnualContributionBase(appState) / 12 * (appState.employerContributionPct / 100);
  return Math.round(appState.providerContribution - expected);
}

const ASSISTANT_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "be",
  "can",
  "could",
  "do",
  "does",
  "for",
  "from",
  "have",
  "how",
  "i",
  "if",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "or",
  "our",
  "should",
  "the",
  "they",
  "to",
  "what",
  "when",
  "where",
  "who",
  "with",
  "would",
]);

function normalizeAssistantText(value, { expand = true } = {}) {
  let text = String(value || "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9£%]+/g, " ")
    .replace(/\bpensions\b/g, "pension")
    .replace(/\bschemes\b/g, "scheme")
    .replace(/\bcontributions\b/g, "contribution")
    .replace(/\bpayments\b/g, "payment")
    .replace(/\bbenefits\b/g, "benefit")
    .replace(/\bworkers\b/g, "worker")
    .replace(/\bjobs\b/g, "job")
    .replace(/\bproviders\b/g, "provider")
    .replace(/\s+/g, " ")
    .trim();

  if (!expand) return text;

  const extras = [];
  const addSynonyms = (terms, synonyms) => {
    if (terms.some((term) => text.includes(term))) extras.push(...synonyms);
  };

  addSynonyms(["boss", "company", "hr", "payroll"], ["employer"]);
  addSynonyms(["alter", "amend", "amended", "amending", "switch", "switched", "swap", "move", "moved", "replace", "replaced"], [
    "change",
    "switch",
    "move",
    "replace",
  ]);
  addSynonyms(["cut", "lower", "less", "pay less", "reduce", "reduced", "stop paying"], ["reduce", "stop"]);
  addSynonyms(["pay into", "paid into", "payment", "deduct", "deducted", "deduction"], ["contribution"]);
  addSynonyms(["join", "joining", "enrol", "enroll", "enrolled", "enrolling"], ["enrol", "join", "automatic enrol"]);
  addSynonyms(["retire later", "work longer"], ["retire later"]);
  addSynonyms(["cash out", "take cash", "withdrawal", "withdraw"], ["take money out", "access pension"]);
  addSynonyms(["complain", "complaint", "challenge", "dispute"], ["complain", "challenge"]);

  return `${text} ${extras.join(" ")}`.replace(/\s+/g, " ").trim();
}

function getAssistantKeywordTokens(value) {
  return normalizeAssistantText(value, { expand: false })
    .split(" ")
    .filter((token) => token.length > 1 && !ASSISTANT_STOP_WORDS.has(token));
}

function getSoftTokenScore(normalizedText, pattern) {
  const tokens = getAssistantKeywordTokens(pattern);
  if (tokens.length < 2) return 0;
  const haystack = new Set(normalizedText.split(" "));
  const matchedCount = tokens.filter((token) => haystack.has(token)).length;
  const ratio = matchedCount / tokens.length;
  if (tokens.length === 2 && matchedCount < 2) return 0;
  if (tokens.length >= 3 && (matchedCount < 2 || ratio < 0.75)) return 0;
  return Math.round(tokens.join(" ").length * ratio) + matchedCount * 4;
}

function getAllQuestionItems() {
  return [...personalAppQuestionLibrary, ...frequentQuestionRules, ...pensionIssueLibrary]
    .filter((item, index, items) => items.findIndex((candidate) => candidate.question === item.question) === index);
}

function getQuestionById(id) {
  return [...personalAppQuestionLibrary, ...frequentQuestionRules, ...pensionIssueLibrary].find((item) => item.id === id) || null;
}

function getQuestionGroupKey(item) {
  const explicitMap = {
    "employer-contributions": "contributions",
    "missing-contributions": "contributions",
    "opt-out-pressure": "opt-out",
    "scheme-change": "employer-change",
    ppf: "db-rights",
    "funding-insolvency": "db-rights",
    "public-sector": "equality",
    complaints: "complaints",
    "can-i-enforce": "complaints",
    "death-benefits": "leave",
    "death-divorce": "leave",
    "scenario-retire-later": "scenario",
    "scenario-raise-contributions": "scenario",
    "scenario-pause-saving": "scenario",
    "scenario-lower-earnings": "scenario",
    "learn-dc": "learn",
    "learn-state-pension": "learn",
    "learn-pensionable-pay": "learn",
    "learn-drawdown": "learn",
    "dc-basics": "learn",
    "db-basics": "learn",
    "hybrid-basics": "learn",
    "state-pension": "learn",
    "pensionable-pay": "learn",
    "planning-on-track": "planning",
    "planning-cash-vs-pension": "planning",
    "planning-next-step": "planning",
    "risk-low-earner": "risk-pathways",
    "risk-part-time": "risk-pathways",
    "risk-multiple-jobs": "risk-pathways",
    "risk-missing-employer-contributions": "risk-pathways",
    "life-event-job-change": "life-events",
    "life-event-parental-leave": "life-events",
    "life-event-retirement": "life-events",
    "household-joint-goal": "household",
    "household-spouse-track": "household",
    "household-survivor-check": "household",
  };

  if (explicitMap[item.id]) return explicitMap[item.id];

  const categoryMap = {
    Joining: "joining",
    Eligibility: "joining",
    Contributions: "contributions",
    Payroll: "contributions",
    "Pay basis": "contributions",
    "DC checks": "contributions",
    "Opt-out": "opt-out",
    "Employer change": "employer-change",
    "DB/accrued rights": "db-rights",
    Protection: "db-rights",
    "Employer insolvency": "db-rights",
    "Scheme funding": "db-rights",
    Equality: "equality",
    "Public sector": "equality",
    Leave: "leave",
    TUPE: "tupe",
    "Employment transfer": "tupe",
    Complaints: "complaints",
    Escalation: "complaints",
    "Practical rights": "complaints",
    "Scenario modelling": "scenario",
    Learn: "learn",
    Fundamentals: "learn",
    "State Pension": "learn",
    Transfers: "learn",
    Retirement: "learn",
    "Retirement choices": "learn",
    Tax: "contributions",
    "DC investment": "learn",
    Planning: "planning",
    "Risk pathways": "risk-pathways",
    "Life events": "life-events",
    "Couple planning": "household",
  };

  return categoryMap[item.category] || "common-model";
}

function inferAssistantTopic(question) {
  const text = normalizeAssistantText(question);
  if (getScenarioQuestionData(text)) return "scenario";
  if (isEmployerChangeIntent(text)) return "employer-change";
  if (isRiskPathwayIntent(text)) return "risk-pathways";
  if (matchesAny(text, ["die", "death", "beneficiary", "nomination", "expression of wish", "survivor", "dependant"])) return "household";
  const exact = getAllQuestionItems().find((item) => normalizeAssistantText(item.question, { expand: false }) === normalizeAssistantText(question, { expand: false }));
  if (exact) return getQuestionGroupKey(exact);

  const frequent = findFrequentQuestion(text);
  if (frequent) return getQuestionGroupKey(frequent);

  const issue = findPensionIssue(text);
  if (issue) return getQuestionGroupKey(issue);

  return appState.assistantTopic;
}

function isEmployerChangeIntent(text) {
  return (
    matchesAny(text, ["employer", "workplace", "company", "boss", "trustees"]) &&
    matchesAny(text, ["change", "switch", "replace", "close", "reduce", "stop", "move"]) &&
    matchesAny(text, ["pension", "pensions", "scheme", "provider", "contribution", "final salary", "db", "defined benefit"])
  );
}

function isRiskPathwayIntent(text) {
  return (
    matchesAny(text, ["multiple jobs", "second job", "two jobs", "job pattern", "combined earnings", "combine earnings"]) ||
    matchesAny(text, ["low earner pathway", "low-earner pathway", "part-time pathway", "part time pathway", "missing employer contributions because of earnings"])
  );
}

function setAssistantTopic(topic) {
  if (!assistantQuestionGroups[topic]) return;
  appState.assistantTopic = topic;
  renderAssistantTopicList();
  renderAssistantStarters();
}

function renderAssistantTopicList() {
  const topicEntries = Object.entries(assistantQuestionGroups);
  const activeGroup = assistantQuestionGroups[appState.assistantTopic];
  const coreEntries = CORE_ASSISTANT_TOPICS.map((key) => [key, assistantQuestionGroups[key]]).filter(([, group]) => Boolean(group));
  const extraEntries = topicEntries.filter(([key]) => !CORE_ASSISTANT_TOPICS.includes(key));
  const renderTopicButtons = (entries) =>
    entries
      .map(
        ([key, group]) => `
          <button class="topic-button ${key === appState.assistantTopic ? "active" : ""}" type="button" data-assistant-topic="${key}">
            <span>${escapeHtml(group.label)}</span>
            <small>${escapeHtml(group.description)}</small>
          </button>
        `
      )
      .join("");

  els.assistantTopicList.innerHTML = renderTopicButtons(coreEntries);
  if (els.assistantTopicOverflowList) {
    els.assistantTopicOverflowList.innerHTML = renderTopicButtons(extraEntries);
  }
  if (els.assistantTopicMore) {
    els.assistantTopicMore.hidden = extraEntries.length === 0;
    const activeInOverflow = extraEntries.some(([key]) => key === appState.assistantTopic);
    if (activeInOverflow) els.assistantTopicMore.open = true;
  }

  els.assistantTopicBadge.textContent = activeGroup.label;
  els.assistantTopicCopy.textContent = activeGroup.description;
}

function renderAssistantStarters() {
  const group = assistantQuestionGroups[appState.assistantTopic];
  const starters = group.starterIds
    .map((id) => getQuestionById(id))
    .filter(Boolean)
    .slice(0, 4);

  els.assistantStarterQuestions.innerHTML = starters
    .map(
      (item) => `
        <button type="button" data-question="${escapeHtml(item.question)}">
          ${escapeHtml(item.question)}
        </button>
      `
    )
    .join("");
}

function getDefaultStarterQuestion(topic) {
  const starterId = assistantQuestionGroups[topic]?.starterIds?.[0];
  return getQuestionById(starterId)?.question || "";
}

function estimateContributionNeeded(overrides = {}) {
  const state = { ...appState, ...overrides };
  const projection = calculateProjection(state);
  const targetPrivateIncome = Math.max(
    0,
    projection.targetYearlyIncome - projection.stateYearlyIncome - projection.dbYearlyIncome - projection.previousDbYearlyIncome
  );
  const requiredPot = targetPrivateIncome / (state.drawdownPct / 100 || 0.04);
  const years = Math.max(0, state.retireAge - state.age);
  const months = years * 12;
  const currentPrivateWealth = totalPrivatePensionWealth(state);
  const monthlyRate = getProjectionMonthlyRate(state);
  const futureCurrentWealth = compoundMonthly(currentPrivateWealth, 0, monthlyRate, months);
  const gapAtRetirement = Math.max(0, requiredPot - futureCurrentWealth);
  let requiredMonthly = 0;

  if (gapAtRetirement > 0 && months > 0) {
    const futureValuePerMonthlyPound = futureValueOfEscalatingMonthly(1, monthlyRate, months, state.contributionEscalationPct);
    requiredMonthly = futureValuePerMonthlyPound > 0 ? gapAtRetirement / futureValuePerMonthlyPound : 0;
  }

  return {
    requiredMonthly,
    requiredPct: state.salary > 0 ? (requiredMonthly * 12) / state.salary * 100 : 0,
  };
}

function buildAssumptionPathModel(presetKey) {
  const preset = ASSUMPTION_PRESETS[presetKey];
  if (!preset) return null;

  const overrides = {
    growthPct: preset.growthPct,
    drawdownPct: preset.drawdownPct,
  };
  const projection = calculateProjection(overrides);
  const needed = estimateContributionNeeded(overrides);
  const extraMonthly = Math.max(0, needed.requiredMonthly - projection.totalMonthly);
  const targetActive = appState.targetMonthlyIncome > 0;
  const yearsValid = appState.retireAge > appState.age;

  let actionValue = "Enter a target to compare paths";
  if (targetActive && yearsValid) {
    if (needed.requiredMonthly <= 0) {
      actionValue = "Current path already clears this target";
    } else if (extraMonthly > 0) {
      actionValue = `Add ${formatMoney(extraMonthly)} / month`;
    } else {
      actionValue = `Current ${formatMoney(projection.totalMonthly)} / month already covers this path`;
    }
  } else if (!yearsValid) {
    actionValue = "Set a retirement age above the current age";
  }

  return {
    key: presetKey,
    label: preset.label,
    growthPct: preset.growthPct,
    drawdownPct: preset.drawdownPct,
	    projectedMonthlyIncome: projection.projectedYearlyIncome / 12,
	    displayProjectedMonthlyIncome: projection.displayProjectedYearlyIncome / 12,
	    requiredMonthly: needed.requiredMonthly,
    actionValue,
    showSuggestedChange: targetActive && yearsValid && extraMonthly > 0,
  };
}

function seedChat() {
  addMessage(
    "coach",
    "AI Assistant",
    `<p>${escapeHtml(getTopicIntro(appState.assistantTopic))}</p><p>I can explain pension terms, show what changes the goal result, and suggest practical next checks from your record. Guidance only, not regulated financial advice.</p>`,
    true
  );
}

function askCoach(question, { forceAnswer = false, skipUserMessage = false } = {}) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;

  const topic = inferAssistantTopic(cleanQuestion);
  setAssistantTopic(topic);
  appState.lastAssistantQuestion = cleanQuestion;

  if (!skipUserMessage) {
    addMessage("user", "You", escapeHtml(cleanQuestion), false);
  }

  const projection = calculateProjection();
  const context = buildPersonalContext(topic, cleanQuestion, projection);
  addMessage("coach", "AI Assistant", getCoachAnswer(cleanQuestion, context), true);
}

function addMessage(role, title, copy, html) {
  const node = document.createElement("div");
  node.className = `message ${role}`;
  node.innerHTML = `<strong>${escapeHtml(title)}</strong>${html ? copy : `<p>${copy}</p>`}`;
  els.chatWindow.appendChild(node);
  const messageTop = node.offsetTop - els.chatWindow.offsetTop;
  els.chatWindow.scrollTop = role === "coach" ? Math.max(0, messageTop - 12) : els.chatWindow.scrollHeight;
}

function getTopicIntro(topic) {
  const group = assistantQuestionGroups[topic];
  return `${group.label} topic selected. ${group.description}`;
}

function buildPersonalContext(topic, question, projection) {
  const topicFacts = [];
  const baseFacts = getBaseFactsForTopic(topic, projection);
  return {
    topic,
    question,
    projection,
    topicFacts,
    usedFacts: [...baseFacts, ...topicFacts].map(([label, value]) => `${label}: ${value}`),
    summary: buildTopicContextSummary(topic, projection, topicFacts),
    verification: buildVerificationList(topic),
    escalation: buildEscalationNote(topic),
  };
}

function getBaseFactsForTopic(topic, projection) {
  const commonFacts = [
    ["Employer", appState.employerName || "Not entered"],
    ["Scheme", appState.schemeName || "Not entered"],
    ["Arrangement", getPlanLabel()],
    ["Employment type", getEmploymentLabel()],
    ["Main concern", appState.mainConcern],
  ];

  const topicFacts = {
    joining: [
      ...commonFacts,
      ["Age", String(appState.age)],
      ["Annual salary", formatMoney(appState.salary)],
    ],
    contributions: [
      ...commonFacts,
      ["Employer contribution", formatPct(appState.employerContributionPct)],
      ["Your contribution", formatPct(appState.employeeContributionPct)],
      ["Payslip deduction", formatMoney(appState.payslipContribution)],
      ["Provider amount", formatMoney(appState.providerContribution)],
    ],
    "opt-out": commonFacts,
    "employer-change": commonFacts,
    "db-rights": commonFacts,
    equality: commonFacts,
    leave: commonFacts,
    tupe: commonFacts,
    complaints: commonFacts,
    scenario: [
      ...commonFacts,
      ["Current monthly goal", formatMoney(appState.targetMonthlyIncome)],
      ["Current projected income", formatMoney(projection.displayProjectedYearlyIncome / 12)],
      ["Current pot", formatMoney(projection.currentPrivateWealth)],
    ],
    learn: [
      ...commonFacts,
      ["Current monthly goal", formatMoney(appState.targetMonthlyIncome)],
      ["Projected retirement income", formatMoney(projection.displayProjectedYearlyIncome / 12)],
      ["State Pension forecast", formatMoney(appState.statePension)],
    ],
    planning: [
      ...commonFacts,
      ["Emergency savings", formatMoney(appState.emergencySavings)],
      ["Current monthly goal", formatMoney(appState.targetMonthlyIncome)],
      ["Projected retirement income", formatMoney(projection.displayProjectedYearlyIncome / 12)],
    ],
    "risk-pathways": (() => {
      const summary = getTailoredPathwaySummary(projection);
      return [
        ...commonFacts,
        ["Current job pay", formatMoney(appState.salary)],
        ["Current job route", summary?.jobOne.route.label || getEligibilitySnapshot().route],
        ["Second job pay", appState.secondJobEnabled ? formatMoney(appState.secondJobAnnualIncome) : "Not used"],
        ["Matched groups", summary ? summary.groups.map(getPathwayGroupLabel).join(", ") : "None from current data"],
      ];
    })(),
    "life-events": [
      ...commonFacts,
      ["Selected life event", getLifeEventLabel()],
      ["Emergency savings", formatMoney(appState.emergencySavings)],
      ["Current monthly goal", formatMoney(appState.targetMonthlyIncome)],
    ],
    household: [
      ...commonFacts,
      ["Partner planning", appState.partnerProfile?.enabled ? `On for ${appState.partnerProfile.name || "partner"}` : "Off"],
      ["Joint goal", formatMoney(toNumber(appState.householdGoal?.jointMonthlyIncome))],
      ["Emergency savings", formatMoney(appState.emergencySavings)],
    ],
    "common-model": [
      ...commonFacts,
      ["Projected income", formatMoney(projection.displayProjectedYearlyIncome)],
      ["Gap", (projection.displayGap ?? projection.gap) > 0 ? `${formatMoney(projection.displayGap ?? projection.gap)} short/year` : `${formatMoney(Math.abs(projection.displayGap ?? projection.gap))} above/year`],
    ],
  };

  return topicFacts[topic] || commonFacts;
}

function buildTopicContextSummary(topic, projection, topicFacts) {
  const factText = topicFacts.map(([label, value]) => `${label.toLowerCase()}: ${value}`).join("; ");
  const contextByTopic = {
    joining: `The current record shows ${getEmploymentLabel().toLowerCase()}, age ${appState.age}, and pay of ${formatMoney(
      appState.salary
    )}. ${factText || "Use the portfolio record and employer documents to confirm worker status, UK status, age band and earnings band."}`,
    contributions: `The record shows ${formatPct(appState.employerContributionPct)} employer contribution, ${formatPct(
      appState.employeeContributionPct
    )} user contribution, ${formatMoney(appState.payslipContribution)} deducted on payslip, and ${formatMoney(
      appState.providerContribution
    )} shown by the provider. ${factText}`,
    "opt-out": `The record concern is ${appState.mainConcern}. ${factText || "Use the portfolio record and any employer messages to confirm whether there was neutral explanation, inducement or detriment."}`,
    "employer-change": `The record currently uses ${getPlanLabel()} with ${appState.schemeName || "scheme not entered"}. ${
      factText || "Use the portfolio record and scheme documents to confirm whether the change affects future benefits only or accrued rights."
    }`,
    "db-rights": `The record currently records ${getPlanLabel()}. ${factText || "Use the portfolio record and scheme documents to confirm whether accrued rights, pension in payment, consent or transfer history are involved."}`,
    equality: `The record currently records ${getPlanLabel()} and ${appState.schemeName || "scheme not entered"}. ${
      factText || "Use the portfolio record and scheme documents to confirm whether this is a Barber, GMP, survivor, maternity or public-sector remedy issue."
    }`,
    leave: `The record concern is ${appState.mainConcern}. ${factText || "Use the portfolio record and employer/payroll documents to identify the leave type, pay position and any death-in-service issue."}`,
    tupe: `The record currently records ${appState.schemeName || "scheme not entered"} with ${getPlanLabel()}. ${
      factText || "Use the portfolio record and transfer documents to confirm whether this is a private transfer, outsourcing or public-sector/Fair Deal issue."
    }`,
    complaints: `The record currently shows ${appState.mainConcern}. ${factText || "Use the portfolio record and complaint documents to identify whether this is an employer-compliance, scheme-administration or regulated-advice issue."}`,
    scenario: `The current record targets ${formatMoney(appState.targetMonthlyIncome)} per month and currently projects about ${formatMoney(
      projection.displayProjectedYearlyIncome / 12
    )} per month. ${factText || "Use the scenario modeller or ask a what-if question about retiring later, higher contributions, pausing saving, restarting after a pause, lower earnings, or moving more cash into pension."}`,
    learn: `The assistant is explaining pension terms against the current record where useful. The record shows ${getPlanLabel().toLowerCase()}, a target of ${formatMoney(
      appState.targetMonthlyIncome
    )} per month, and a State Pension forecast of ${formatMoney(appState.statePension)} per year. ${factText}`,
    planning: `The record currently projects about ${formatMoney(projection.displayProjectedYearlyIncome / 12)} per month against a target of ${formatMoney(
      appState.targetMonthlyIncome
    )}. Emergency savings are ${formatMoney(appState.emergencySavings)}. ${factText || "Use this topic for on-track status, cash-versus-pension trade-offs and next actions."}`,
    "risk-pathways": (() => {
      const summary = getTailoredPathwaySummary(projection);
      if (!summary) {
        return `The current record does not currently match the low-earner, part-time or multiple-jobs pathways from the entered data. ${factText}`;
      }
      return `${summary.statusLabel}: ${summary.groups.map(getPathwayGroupLabel).join(", ")}. ${summary.jobOne.label} route is ${summary.jobOne.route.label.toLowerCase()}${
        summary.jobTwo ? ` and ${summary.jobTwo.label} route is ${summary.jobTwo.route.label.toLowerCase()}` : ""
      }. ${summary.reason} ${factText}`;
    })(),
    "life-events": `The selected life event is ${getLifeEventLabel().toLowerCase()}. ${
      factText || "Use this topic to turn a job change, parental leave, sickness or retirement approach into a focused checklist."
    }`,
    household: appState.partnerProfile?.enabled
      ? `Household planning is on for ${appState.partnerProfile.name || "your partner"}, with a joint target of ${formatMoney(
          toNumber(appState.householdGoal?.jointMonthlyIncome)
        )} per month. ${factText || "Use this topic for joint goals, spouse comparison and survivor checks."}`
      : `Household planning is currently off. ${
          factText || "Use this topic if you want to compare your record with a spouse or partner and set a joint target."
        }`,
    "common-model": `The record currently shows projected yearly income of ${formatMoney(projection.displayProjectedYearlyIncome)} and ${
      (projection.displayGap ?? projection.gap) > 0
        ? `${formatMoney(projection.displayGap ?? projection.gap)} short/year`
        : `${formatMoney(Math.abs(projection.displayGap ?? projection.gap))} above target`
    }. ${factText}`,
  };

  return contextByTopic[topic] || contextByTopic["common-model"];
}

function buildVerificationList(topic) {
  const topicChecks = {
    joining: [
      "Check the employer's written worker-status and earnings assessment.",
      "Verify whether the employer used postponement and whether a join request was still allowed.",
      "Check whether the issue is automatic enrolment, opt-in rights, or a simple right to join.",
    ],
    contributions: [
      "Check the exact pensionable pay basis used by payroll.",
      "Reconcile the pay period, deduction amount and provider receipt date.",
      "Check whether the issue is timing, underpayment, or excluded earnings.",
    ],
    "opt-out": [
      "Check whether the employer only explained opt-out neutrally or actively encouraged it.",
      "Record any link between pension membership and pay, hours, hiring or dismissal.",
      "Check whether rejoin or re-enrolment duties also matter.",
    ],
    "employer-change": [
      "Check whether the change affects future benefits only or accrued rights.",
      "Check whether a formal consultation notice and comparison were provided.",
      "Check whether consultation was genuine or already effectively decided.",
    ],
    "db-rights": [
      "Check the trust deed, rules and amendment deed rather than announcements alone.",
      "Check whether written consent or actuarial equivalence was required.",
      "Check whether the issue affects pension already built up or pension in payment.",
    ],
    equality: [
      "Check whether the scheme is DB, hybrid, contracted-out or public sector.",
      "Check the service dates, equalisation date and any transfer history.",
      "Check whether the issue is Barber, GMP, discrimination or McCloud-related.",
    ],
    leave: [
      "Check whether the leave was paid, partly paid or unpaid.",
      "Check how employer and user contributions were calculated during the absence.",
      "Check whether death-in-service or insured cover changed while absent.",
    ],
    tupe: [
      "Check whether the transfer was TUPE, outsourcing or public-sector/Fair Deal.",
      "Check what pension promise existed before transfer and what replacement was offered after it.",
      "Check whether accrued rights or only future provision are in issue.",
    ],
    complaints: [
      "Check whether the issue belongs with the employer, provider/trustees, or regulated adviser.",
      "Keep a dated timeline and ask for the complaint process in writing.",
      "Check whether the aim is correction, compensation, arrears or regulatory action.",
    ],
    scenario: [
      "Check whether the scenario changes retirement age, contribution level, earnings, a temporary pause or the cash-versus-pension split.",
      "Treat the result as an illustration built on the app's current growth and drawdown assumptions.",
      "Check whether DB, hybrid or guaranteed benefits make the simple DC-style projection incomplete.",
    ],
    learn: [
      "Check the provider or scheme document for the exact wording.",
      "Use the Pension Record page to confirm the scheme type, balance, contribution basis and State Pension figure.",
      "Use the Retirement Goal page to see how the term affects the projection.",
    ],
    planning: [
      "Check whether the retirement target is still the right personal or household target.",
      "Check the emergency-savings figure and whether the cash target is realistic.",
      "Check whether scheme rules make the simple projection rougher than usual.",
    ],
    "risk-pathways": [
      "Check the age, worker-status and earnings test for each job separately.",
      "Do not aggregate two jobs to create automatic-enrolment eligibility.",
      "Check the statutory minimum on qualifying earnings before comparing actual contribution rates.",
    ],
    "life-events": [
      "Check the exact date the life event starts and which pension record it affects.",
      "Check whether contributions, joining rights, nominations or cover change because of the event.",
      "Keep the event-specific documents together before asking for corrections or guidance.",
    ],
    household: [
      "Check that the partner record is current before relying on the household result.",
      "Check the joint target and whether both retirement ages are realistic.",
      "Check beneficiary, dependant and survivor details rather than assuming the household plan covers them automatically.",
    ],
    "common-model": [
      "Check the contract, scheme rules and provider record against the exact question.",
      "Pin the issue to a date, document and decision-maker before treating the answer as settled.",
    ],
  };

  return [...(topicChecks[topic] || topicChecks["common-model"])].filter(Boolean).slice(0, 5);
}

function buildEscalationNote(topic) {
  const notes = {
    joining: "Ask payroll or HR for the assessment in writing. If the employer refuses to enrol or join when required, consider TPR escalation.",
    contributions: "Ask payroll and provider for a written reconciliation first. Use TPR for compliance issues and TPO/provider complaints for individual correction or loss.",
    "opt-out": "Keep evidence immediately. Pressure, inducement or detriment can justify rapid escalation through HR, TPR or legal advice.",
    "employer-change": "Ask for the consultation papers, rule power and change comparison in writing. Use specialist advice if accrued rights or DB benefits are involved.",
    "db-rights": "Use specialist pensions advice where accrued DB rights, final salary link, pension in payment or transfer value are involved.",
    equality: "Ask the scheme or provider for the equalisation position in writing. Use specialist advice for material DB, GMP, Barber or McCloud issues.",
    leave: "Ask the employer or provider for the leave-period contribution and cover calculation in writing. Use advice if the issue caused pension or insured-benefit loss.",
    tupe: "Ask for the old and new pension comparison plus any TUPE/Fair Deal material. Use employment and pensions advice before accepting materially worse terms.",
    complaints: "Start with the employer/provider/trustees, then move to IDRP, TPO, TPR, FOS or FSCS depending on the issue owner.",
    scenario: "Use regulated financial advice before acting on a major change to retirement timing, contribution level, drawdown, or investment strategy.",
    learn: "Use provider documents, MoneyHelper, Pension Wise or regulated advice before relying on a term for a major financial decision.",
    planning: "Use MoneyHelper, Pension Wise or regulated advice if the plan needs a larger change than the app can model safely.",
    "risk-pathways":
      "Ask payroll or HR for the route in writing. Use TPR information or complaint routes if an employer refuses an opt-in or misses employer contributions that should have followed.",
    "life-events": "Ask payroll, the provider or trustees for the event-specific pension calculation in writing. Use specialist advice if the event affects DB rights, divorce sharing, illness retirement or survivor benefits.",
    household: "Use regulated advice or legal help if couple planning turns into beneficiary disputes, divorce, DB transfer choices or tax-heavy retirement planning.",
    "common-model": "Start with the organisation that made the decision, then move to the appropriate complaints or regulatory route once the documents are pinned down.",
  };

  return notes[topic] || notes["common-model"];
}

function extractFirstPercentage(text) {
  const match = text.match(/([0-9]+(?:\.[0-9]+)?)\s*%/i);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractYearsLater(text) {
  const match = text.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:more\s*)?years?\s*(?:later|longer)/i);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractRetireAgeFromQuestion(text) {
  const match = text.match(/retir\w*\s*(?:at|age)?\s*([0-9]{2})/i);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractPauseMonths(text) {
  const monthMatch = text.match(/([0-9]+(?:\.[0-9]+)?)\s*months?/i);
  if (monthMatch) {
    const parsed = Number(monthMatch[1]);
    return Number.isFinite(parsed) ? parsed : null;
  }
  const yearMatch = text.match(/([0-9]+(?:\.[0-9]+)?)\s*years?/i);
  if (!yearMatch) return null;
  const parsed = Number(yearMatch[1]);
  return Number.isFinite(parsed) ? parsed * 12 : null;
}

function extractCurrencyAmount(text) {
  const match = text.match(/(?:gbp|pounds?|\u00a3)\s*([0-9][0-9,]*(?:\.[0-9]+)?)/i) || text.match(/([0-9][0-9,]*(?:\.[0-9]+)?)\s*(?:gbp|pounds?)/i);
  if (!match) return null;
  const parsed = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function getScenarioQuestionData(question) {
  const text = question.toLowerCase();
  const selectedScenario = appState.caseFacts?.scenario?.scenarioType || "";
  const fallbackScenario = selectedScenario || (appState.assistantTopic === "scenario" ? appState.scenarioModel?.type : "");
  const whatIfIntent = matchesAny(text, ["what if", "what happens if", "if i", "if my", "how would", "how does", "show me the effect"]);

  if ((whatIfIntent && matchesAny(text, ["retire later", "work longer", "retire at"])) || fallbackScenario === "retire-later") {
    const targetAge = extractRetireAgeFromQuestion(text);
    const yearsLater = targetAge && targetAge > appState.retireAge ? targetAge - appState.retireAge : extractYearsLater(text) || appState.scenarioModel?.retireLaterYears || 2;
    return {
      type: "retire-later",
      model: { ...createDefaultScenarioModel(), type: "retire-later", retireLaterYears: yearsLater },
    };
  }

  if ((whatIfIntent && matchesAny(text, ["raise contribution", "increase contribution", "pay more into", "pay more to", "put more into"])) || fallbackScenario === "raise-contributions") {
    const absolutePct = text.match(/(?:my|employee|user)\s+contribution(?:s)?\s+(?:to|at)\s*([0-9]+(?:\.[0-9]+)?)\s*%/i);
    const extraPct = absolutePct
      ? Math.max(0.5, Number(absolutePct[1]) - appState.employeeContributionPct)
      : extractFirstPercentage(text) || appState.scenarioModel?.extraEmployeePct || 2;
    return {
      type: "raise-contributions",
      model: { ...createDefaultScenarioModel(), type: "raise-contributions", extraEmployeePct: extraPct },
    };
  }

  if ((whatIfIntent && matchesAny(text, ["pause saving", "pause pension", "stop contributing", "stop contribution", "pause contributions"])) || fallbackScenario === "pause-saving") {
    const pauseMonths = extractPauseMonths(text) || appState.scenarioModel?.pauseMonths || 12;
    return {
      type: "pause-saving",
      model: { ...createDefaultScenarioModel(), type: "pause-saving", pauseMonths },
    };
  }

  if ((whatIfIntent && matchesAny(text, ["lower earnings", "earn less", "pay cut", "salary drops", "salary drop", "income falls", "lower pay"])) || fallbackScenario === "lower-earnings") {
    const lowerToSalary = text.match(/(?:salary|pay|earnings|income)\s+(?:drops?|falls?|to)\s*(?:gbp|pounds?|\u00a3)?\s*([0-9][0-9,]*(?:\.[0-9]+)?)/i);
    const dropPct = lowerToSalary
      ? Math.max(1, ((appState.salary - Number(lowerToSalary[1].replace(/,/g, ""))) / appState.salary) * 100)
      : extractFirstPercentage(text) || appState.scenarioModel?.lowerEarningsPct || 10;
    return {
      type: "lower-earnings",
      model: { ...createDefaultScenarioModel(), type: "lower-earnings", lowerEarningsPct: dropPct },
    };
  }

  if (
    (whatIfIntent && matchesAny(text, ["restart after", "restart saving", "recover after pause", "catch up after pause", "restart contributions"])) ||
    fallbackScenario === "restart-after-pause"
  ) {
    const extraPct = extractFirstPercentage(text) || appState.scenarioModel?.extraEmployeePct || 2;
    return {
      type: "restart-after-pause",
      model: { ...createDefaultScenarioModel(), type: "restart-after-pause", extraEmployeePct: extraPct },
    };
  }

  if (
    (whatIfIntent && matchesAny(text, ["split savings", "cash vs pension", "put more into pension", "shift cash into pension", "move more into pension"])) ||
    fallbackScenario === "split-savings"
  ) {
    const extraMonthly = extractCurrencyAmount(text) || appState.scenarioModel?.splitExtraMonthly || 100;
    return {
      type: "split-savings",
      model: { ...createDefaultScenarioModel(), type: "split-savings", splitExtraMonthly: Math.max(25, extraMonthly) },
    };
  }

  return null;
}

function scenarioAnswer(question, projection, context) {
  const scenarioData = getScenarioQuestionData(question);
  if (!scenarioData) return null;

  const scenarioProjection = calculateScenarioProjection(scenarioData.model, projection.state);
  if (!scenarioProjection) return null;

  const currentMonthly = projection.displayProjectedYearlyIncome / 12;
  const scenarioMonthly = scenarioProjection.displayProjectedYearlyIncome / 12;
  const monthlyDiff = scenarioMonthly - currentMonthly;
  const potDiff = scenarioProjection.projectedPot - projection.projectedPot;
  const coverageDiff = Math.round((scenarioProjection.coverage - projection.coverage) * 100);
  const planCaution =
    appState.pensionType === "DC"
      ? ""
      : ` Because the current record is ${getPlanLabel().toLowerCase()}, treat this as a rough planning illustration rather than a full benefit calculation.`;
  const comparisonItems = [
    `Current path: about ${formatMoney(currentMonthly)} per month and ${formatProjectionMoney(projection, projection.projectedPot)} projected at retirement.`,
    `Scenario path: about ${formatMoney(scenarioMonthly)} per month and ${formatProjectionMoney(scenarioProjection, scenarioProjection.projectedPot)} projected at retirement.`,
    `${monthlyDiff >= 0 ? "Income improvement" : "Income reduction"}: ${formatMoney(Math.abs(monthlyDiff))} per month.`,
    `${potDiff >= 0 ? "Pot improvement" : "Pot reduction"}: ${formatProjectionMoney(projection, Math.abs(potDiff))} by retirement.`,
    `${scenarioProjection.shortEffect} ${scenarioProjection.assumptions.join(" ")}`.trim(),
  ];
  const verifyItems = [
    "Check that the scenario change matches the real decision you are considering.",
    "Treat the result as an illustration built on the app's growth and drawdown assumptions.",
    ...((context?.verification || []).slice(0, 2)),
  ]
    .filter(Boolean)
    .slice(0, 5)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const usedFacts = [
    ...(context?.usedFacts || []),
    `Scenario tested: ${scenarioProjection.label}`,
    `Scenario projected income: ${formatMoney(scenarioMonthly)} per month`,
    `Scenario projected pot: ${formatMoney(scenarioProjection.projectedPot)}`,
  ]
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `
    <div class="answer-block legal-answer">
      <span class="answer-label">Scenario modelling</span>
      <p><strong>Direct answer:</strong> ${escapeHtml(
        `On current assumptions, ${scenarioProjection.label.toLowerCase()} changes the projection from about ${formatMoney(currentMonthly)} to ${formatMoney(
          scenarioMonthly
        )} per month at retirement.${planCaution}`
      )}</p>
      <p><strong>Scenario tested:</strong> ${escapeHtml(scenarioProjection.label)}</p>
      <p><strong>How your record affects this:</strong> ${escapeHtml(
        `${context?.summary || personalApplicationSummary(context)} Coverage moves by ${Math.abs(coverageDiff)} percentage point${Math.abs(coverageDiff) === 1 ? "" : "s"}.`
      )}</p>
      <p><strong>Long-term effect of the short-term choice:</strong></p>
      <ul class="verify-list">${comparisonItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <p><strong>What to verify next:</strong></p>
      <ul class="verify-list">${verifyItems}</ul>
      <p><strong>Documents to check:</strong></p>
      <ul>
        <li>Latest provider statement</li>
        <li>Recent payslip or contribution record</li>
        <li>Retirement target working</li>
        <li>Charge and investment summary</li>
      </ul>
      <div class="answer-meta">
        <strong>Used from your record</strong>
        <ul class="used-facts-list">${usedFacts}</ul>
      </div>
      <p><strong>Escalation/help route:</strong> ${escapeHtml(
        context?.escalation || "Use regulated financial advice before acting on a major change to retirement timing, contributions, or access choices."
      )}</p>
      <p><strong>Boundary:</strong> Financial guidance only, not regulated financial advice.</p>
    </div>
  `;
}

function riskPathwayAnswer(question, projection, context) {
  const text = question.toLowerCase();
  const topicIntent =
    context?.topic === "risk-pathways" ||
    matchesAny(text, [
      "low earner",
      "part-time",
      "multiple jobs",
      "second job",
      "two jobs",
      "missing employer contributions",
      "missed employer contributions",
      "employer contributions because of earnings",
    ]);
  if (!topicIntent) return null;

  const summary = getTailoredPathwaySummary(projection);
  if (!summary) {
    return structuredAnswer({
      label: "Tailored pathway check",
      answer: "The current record does not currently match the low-earner, part-time or multiple-jobs pathways from the data entered.",
      pensionType: "Workplace-pension eligibility and adequacy check for the current record.",
      action: "The app checks whether the current record fits a pathway that needs different workplace-pension guidance from a standard full-time saver.",
      basis: "Current 2026/27 automatic-enrolment trigger and qualifying-earnings thresholds, plus the current pension record fields entered in the app.",
      application: context?.summary || personalApplicationSummary(context),
      conclusion: "If the user has a second concurrent job or lower pay, add that data in Pension Record before relying on a standard pathway.",
      documents: ["Recent payslips", "Joining letter", "Employer pension policy", "Any second-job pension letter"],
      help: "Ask payroll or HR for the route in writing if the entered record should be in a different pathway.",
      boundary: "Guidance only, not legal advice or regulated financial advice.",
      context,
    });
  }

  const missingEmployerIntent = matchesAny(text, ["missing employer contributions", "employer contributions"]);
  const multipleJobsIntent = matchesAny(text, ["multiple jobs", "second job", "two jobs"]);
  const partTimeIntent = matchesAny(text, ["part-time", "part time"]);
  const lowEarnerIntent = text.includes("low earner");
  const focus =
    missingEmployerIntent
      ? "missing"
      : multipleJobsIntent
        ? "multiple-jobs"
        : partTimeIntent
          ? "part-time"
          : lowEarnerIntent
            ? "low-earner"
            : summary.priority;

  let answer = `${summary.priorityLabel} pathway detected. ${summary.reason}`;
  let conclusion = summary.nextAction;

  if (focus === "multiple-jobs") {
    answer = `${summary.priorityLabel} pathway detected. ${summary.jobOne.label} is ${summary.jobOne.route.label.toLowerCase()}${
      summary.jobTwo ? ` and ${summary.jobTwo.label} is ${summary.jobTwo.route.label.toLowerCase()}` : ""
    }. Combined pay is context only and does not create automatic-enrolment eligibility by itself.`;
    conclusion = `${summary.nextAction} The current app keeps Job 2 separate from the main retirement-pot projection in this version.`;
  } else if (focus === "part-time") {
    answer = `Part-time pathway detected. Part-time status does not remove pension rights, but lower earnings and the qualifying-earnings band can materially shrink pension growth and the employer-contribution opportunity.`;
  } else if (focus === "low-earner") {
    answer = `Low-earner pathway detected. At the entered earnings level, the current job is in the ${summary.jobOne.route.label.toLowerCase()} rather than the standard full automatic-enrolment route.`;
  } else if (focus === "missing") {
    answer =
      summary.missedEmployerAnnual > 0
        ? `The current record suggests possible missed employer contribution exposure of about ${formatMoney(summary.missedEmployerAnnual)} per year on the statutory minimum illustration.`
        : "The current record does not currently show a clear missed employer-contribution exposure from the pathway data entered.";
    conclusion = summary.missedEmployerAnnual > 0 ? summary.nextAction : `${summary.nextAction} Compare this with the actual payslips and provider record before assuming money is missing.`;
  }

  return structuredAnswer({
    label: "Tailored pathway",
    answer,
    pensionType: "Current workplace-pension rights and adequacy pathway for the current record.",
    action: "The app is checking whether the current record should follow a tailored pathway instead of a standard full-time saver pathway.",
    basis:
      "2026/27 UK automatic-enrolment thresholds: GBP 10,000 trigger, GBP 6,240 lower qualifying-earnings band, GBP 50,270 upper band, and statutory minimum illustration of 3% employer / 8% total on qualifying earnings.",
    application: `${context?.summary || personalApplicationSummary(context)} ${summary.jobOne.label} statutory minimum illustration is employer ${formatMoney(
      summary.jobOne.statutoryEmployerAnnual
    )} and total ${formatMoney(summary.jobOne.statutoryTotalAnnual)} per year.${
      summary.jobTwo
        ? ` ${summary.jobTwo.label} statutory minimum illustration is employer ${formatMoney(summary.jobTwo.statutoryEmployerAnnual)} and total ${formatMoney(
            summary.jobTwo.statutoryTotalAnnual
          )} per year.`
        : ""
    }`,
    conclusion,
    documents: ["Recent payslips for each job", "Joining or opt-in letters", "Employer pension policy", "Provider contribution history"],
    help: context?.escalation || buildEscalationNote("risk-pathways"),
    boundary: "Guidance only, not legal advice or regulated financial advice.",
    context: {
      ...(context || {}),
      actionSummary: getActionSummaryItems({
        ...(context || {}),
        topic: "risk-pathways",
        projection,
      }),
    },
  });
}

function getActionSummaryItems(context) {
  if (Array.isArray(context?.actionSummary) && context.actionSummary.length) {
    return context.actionSummary;
  }

  const topic = context?.topic || appState.assistantTopic;
  const projection = context?.projection || calculateProjection();
  const lifeGuide = getLifeEventGuide();
  const household = calculateHouseholdProjection(projection);

  if (topic === "planning") {
    return getActionPlanTasks(projection)
      .slice(0, 3)
      .map((task) => `${task.title}: ${task.copy}`);
  }

  if (topic === "risk-pathways") {
    const summary = getTailoredPathwaySummary(projection);
    if (!summary) {
      return [
        "The current record does not currently match the low-earner, part-time or multiple-jobs pathways.",
        "Use Pension Record to enter earnings and any second current job if that pattern applies.",
      ];
    }
    return [
      summary.nextAction,
      summary.jobTwo
        ? `Combined earnings are ${formatMoney(summary.combinedIncome)} for context only; the legal route stays job by job.`
        : `${summary.jobOne.label} statutory minimum illustration is ${formatMoney(summary.jobOne.statutoryEmployerAnnual)} employer / ${formatMoney(
            summary.jobOne.statutoryTotalAnnual
          )} total per year.`,
      summary.missedEmployerAnnual > 0
        ? `Possible missed employer contribution exposure: ${formatMoney(summary.missedEmployerAnnual)} / year.`
        : summary.note,
    ];
  }

  if (topic === "life-events") {
    return [
      lifeGuide.action,
      `Documents: ${lifeGuide.documents}`,
      `Ask AI next: ${lifeGuide.aiQuestion}`,
    ];
  }

  if (topic === "household") {
    return household.enabled
      ? [
          "Keep both pension records current before relying on the household view.",
          "Review the joint target and both retirement ages together.",
          "Check survivor benefits and expression-of-wish forms for both sides.",
        ]
      : [
          "Turn on spouse or partner planning in Retirement Goal if you plan jointly.",
          "Set a joint monthly income target once both records are entered.",
        ];
  }

  if (topic === "scenario") {
    return [
      "Re-run the same what-if in the Retirement Goal page so you can inspect the chart and age scrubber.",
      "Only act on a scenario after checking the cash-buffer impact and any guarantees or DB rules.",
      "Treat scenario outputs as illustrations, not guaranteed outcomes.",
    ];
  }

  return [
    ...(context?.verification || []).slice(0, 2),
    context?.escalation || "Use professional help if the issue becomes high value, urgent or document-heavy.",
  ]
    .filter(Boolean)
    .slice(0, 3);
}

function plainEnglishTermAnswer(question, context) {
  const text = question.toLowerCase();
  const wantsExplanation = matchesAny(text, ["what is", "what does", "explain", "plain english", "simple english"]);
  if (!wantsExplanation) return null;

  const glossary = [
    {
      patterns: ["defined contribution", "dc"],
      label: "Plain-English pension term",
      title: "Defined contribution pension",
      answer:
        "A DC pension is a savings pot in your name. Money usually goes in from you, your employer and tax relief, then it is invested. The final amount is not guaranteed because it depends on contributions, investment performance, charges and how you take the money later.",
      documents: ["Latest statement", "Provider contribution history", "Fund and charges summary"],
    },
    {
      patterns: ["defined benefit", "db", "final salary", "career average"],
      label: "Plain-English pension term",
      title: "Defined benefit pension",
      answer:
        "A DB pension is usually a promise about future income rather than just a pot size. The key points are pensionable salary, service, accrual rate, retirement age and the scheme rules.",
      documents: ["Benefit statement", "Scheme booklet", "Service record"],
    },
    {
      patterns: ["automatic enrolment", "auto enrol", "auto-enrol"],
      label: "Plain-English pension term",
      title: "Automatic enrolment",
      answer:
        "Automatic enrolment means the employer must usually put eligible workers into a workplace pension without waiting for them to ask. The worker can still opt out, but the employer cannot pressure them to do that.",
      documents: ["Joining letter", "Payslip", "Scheme information"],
    },
    {
      patterns: ["qualifying earnings", "pensionable pay"],
      label: "Plain-English pension term",
      title: "Qualifying earnings / pensionable pay",
      answer:
        "Qualifying earnings and pensionable pay are the pay figures used to work out pension contributions. They are not always the same as your full salary, so overtime, bonus or leave pay may or may not be counted depending on the rules.",
      documents: ["Payslip", "Payroll explanation", "Scheme booklet"],
    },
    {
      patterns: ["deferred pot", "small pot", "old pot"],
      label: "Plain-English pension term",
      title: "Deferred pension pot",
      answer:
        "A deferred pot is usually an old workplace pension you are no longer paying into because you left that job. It still belongs to you, but you should check charges, guarantees and transfer restrictions before moving it.",
      documents: ["Old statement", "Provider details", "Transfer pack"],
    },
    {
      patterns: ["drawdown"],
      label: "Plain-English pension term",
      title: "Drawdown",
      answer:
        "Drawdown means leaving pension money invested and taking an income or lump sums from it over time. The money can run out if too much is taken or investment returns are weak.",
      documents: ["Retirement options pack", "Charges summary", "Provider access options"],
    },
    {
      patterns: ["barber"],
      label: "Plain-English pension term",
      title: "Barber window",
      answer:
        "The Barber issue is about equal pension treatment for men and women in some occupational schemes. It mainly matters for older DB or occupational pension service, not for most ordinary DC pots.",
      documents: ["Scheme equalisation notice", "Benefit statement", "Historic rules"],
    },
    {
      patterns: ["gmp"],
      label: "Plain-English pension term",
      title: "GMP equalisation",
      answer:
        "GMP equalisation is a technical correction for some older contracted-out DB pensions where men and women were treated differently under the old state-pension rules.",
      documents: ["Scheme update", "Benefit statement", "Contracted-out service record"],
    },
  ];

  const match = glossary.find((item) => item.patterns.some((pattern) => text.includes(pattern)));
  if (!match) return null;

  return structuredAnswer({
    label: match.label,
    answer: match.answer,
    pensionType: `${match.title}.`,
    action: "The assistant is translating a pension term into plain English without changing the underlying legal or financial documents.",
    basis: "Plain-English explanation based on the pension record and standard UK pension terminology.",
    application: context?.summary || personalApplicationSummary(context),
    conclusion: "Use the provider or scheme documents for the exact wording if the term affects a real decision or dispute.",
    documents: match.documents,
    boundary: "Guidance only. The plain-English explanation does not override the scheme rules or provider documents.",
    context: {
      ...(context || {}),
      suppressRiskFlags: true,
    },
  });
}

function planningAnswer(question, projection, context) {
  const text = question.toLowerCase();
  const planningIntent = matchesAny(text, ["planning", "retirement goal", "retirement target", "goal", "target", "shortfall", "saving enough"]);
  const onTrackIntent = matchesAny(text, ["on track", "on-track", "adequacy", "benchmark", "am i okay", "am i behind", "am i short"]);
  const cashIntent = matchesAny(text, ["cash", "emergency", "buffer", "pension or cash", "cash or pension"]);
  const nextIntent = matchesAny(text, ["what should i do next", "next step", "next action", "what now"]);
  if (!planningIntent && !onTrackIntent && !cashIntent && !nextIntent) return null;

  const adequacy = getAdequacyStatus(projection);
  const savings = getShortTermSavingsPlan(projection);
  const actions = getActionPlanTasks(projection).map((task) => `${task.title}: ${task.copy}`);
  const needed = estimateContributionNeeded();
  const estateIntent = matchesAny(text, ["inheritance", "iht", "estate", "death benefit", "beneficiary", "nomination", "expression of wish"]);
  const estateWatchpoint =
    estateIntent && projectionHasPrivatePensionIhtExposure(projection)
      ? `Estate-planning note: from ${PENSION_IHT_CHANGE_DATE}, unused private pension money may count for IHT, but most estates still pay no IHT.`
      : "";

  let answer = `${adequacy.status}. ${adequacy.summary}`;
  const displayGap = projection.displayGap ?? projection.gap;
  let conclusion =
    displayGap > 0
      ? `On current assumptions the record is about ${formatMoney(displayGap / 12)} short per month against the entered goal.`
      : `On current assumptions the record is about ${formatMoney(Math.abs(displayGap / 12))} above the entered goal per month.`;

  if (cashIntent) {
    answer =
      savings.bufferGap > 0
        ? "The current record points to cash first, then more pension. The cash buffer is still below target, so a short income shock could force a longer pension setback."
        : displayGap > 0
          ? "The current record points to more pension next. The cash buffer is in a safer range, so extra flexible money can work harder on the retirement gap."
          : "The current record supports a balanced split. The retirement path is already around target, so keep both the pension and the cash buffer under review.";
    conclusion = savings.splitGuidance;
  } else if (nextIntent) {
    answer = actions[0] || answer;
    conclusion = "Use the ranked action list on the dashboard and re-check the record after any change in pay, target, partner record or provider data.";
  }
  if (estateWatchpoint) {
    conclusion = `${conclusion} ${estateWatchpoint}`;
  }

  return structuredAnswer({
    label: "Personal planning view",
    answer,
    pensionType: "Personal pension planning using the current record and the app's current assumptions.",
    action: "The app is comparing retirement adequacy, short-term resilience and the main levers available in the record.",
    basis: "Current pension record, retirement target, emergency-savings settings, growth assumption, drawdown assumption and State Pension figure entered in the app.",
    application: `${context?.summary || personalApplicationSummary(context)} Indicative total pension saving needed to hit the goal on these assumptions is about ${formatMoney(
      needed.requiredMonthly
    )} per month.`,
    conclusion,
    documents: ["Latest provider statement", "Recent payslips", "Retirement target note", "Cash-savings figure", "Charge summary"],
    help: "Use MoneyHelper, Pension Wise or regulated financial advice if the plan needs a larger change than the app can safely model.",
    boundary: "Financial guidance only, not regulated financial advice.",
    context: {
      ...(context || {}),
      actionSummary: actions.slice(0, 3),
    },
  });
}

function inferLifeEventFromQuestion(question) {
  const text = question.toLowerCase();
  if (matchesAny(text, ["start work", "starting work", "first job"])) return "starting-work";
  if (matchesAny(text, ["change job", "changing jobs", "new job", "leave my job"])) return "changing-jobs";
  if (matchesAny(text, ["self-employed", "self employed", "freelance", "sole trader"])) return "self-employed";
  if (matchesAny(text, ["maternity", "parental", "paternity", "adoption leave"])) return "parental-leave";
  if (matchesAny(text, ["sick", "sickness", "lower income", "reduced income"])) return "sickness";
  if (matchesAny(text, ["divorce", "separation", "separate from"])) return "divorce";
  if (matchesAny(text, ["approach retirement", "close to retirement", "near retirement"])) return "approaching-retirement";
  return appState.lifeEvent?.type || "none";
}

function lifeEventAnswer(question, context) {
  const text = question.toLowerCase();
  const topicIntent =
    context?.topic === "life-events" ||
    matchesAny(text, ["change jobs", "maternity", "parental leave", "self-employed", "divorce", "sickness", "approaching retirement", "near retirement", "close to retirement"]);
  if (!topicIntent) return null;

  const eventType = inferLifeEventFromQuestion(question);
  const guide = getLifeEventGuide(eventType);
  return structuredAnswer({
    label: "Life-event checklist",
    answer: guide.title,
    pensionType: "Your current pension record plus a life-event planning checklist.",
    action: "The app is turning the life event into a focused pension and savings review.",
    basis: "Life-event guidance uses the current pension record, the selected event and the standard pension/savings checks usually triggered by that event.",
    application: context?.summary || personalApplicationSummary(context),
    conclusion: guide.action,
    documents: [guide.documents],
    help: "Use specialist advice if the event affects DB rights, pension sharing on divorce, illness retirement or survivor benefits.",
    boundary: "Guidance only, not legal advice or regulated financial advice.",
    context: {
      ...(context || {}),
      actionSummary: [guide.action, `Check: ${guide.checks.join(" ")}`, `Ask AI next: ${guide.aiQuestion}`],
    },
  });
}

function householdAnswer(question, projection, context) {
  const text = question.toLowerCase();
  const topicIntent =
    context?.topic === "household" ||
    matchesAny(text, ["spouse", "partner", "joint goal", "household", "survivor", "dependant", "die", "death", "beneficiary", "nomination", "expression of wish"]);
  if (!topicIntent) return null;

  const household = calculateHouseholdProjection(projection);
  const survivorIntent = matchesAny(text, ["survivor", "dependant", "nomination", "expression of wish", "beneficiary", "die", "death"]);
  if (!household.enabled) {
    if (survivorIntent) {
      return structuredAnswer({
        label: "Beneficiary and survivor check",
        answer: "Do not assume pension death benefits automatically follow your will. Check the nomination form, scheme rules and any spouse, civil-partner or dependant benefit wording.",
        pensionType: "Death-benefit, beneficiary and survivor-benefit check for the current pension record.",
        action: "The app is identifying who may receive pension benefits on death and which documents control the decision.",
        basis: "Pension death benefits depend on provider or scheme rules, nomination/expression-of-wish forms, dependant definitions and the type of pension.",
        application: context?.summary || personalApplicationSummary(context),
        conclusion: "Update nominations and check survivor wording before relying on the record for family planning.",
        documents: ["expression-of-wish or nomination form", "death-benefit wording", "survivor/dependant benefit wording", "latest pension statement"],
        help: "Use provider guidance, MoneyHelper or legal/regulated advice if there is divorce, cohabitation, disputed beneficiaries, large benefits or tax complexity.",
        boundary: "Guidance only, not legal advice or regulated financial advice.",
        context: {
          ...(context || {}),
          actionSummary: [
            "Check or update the expression-of-wish form.",
            "Ask the provider who has discretion over death benefits.",
            "Check spouse, civil-partner and dependant benefit wording.",
          ],
        },
      });
    }
    return structuredAnswer({
      label: "Couple planning",
      answer: "The app can compare your record with a spouse or partner, but the partner profile is currently switched off.",
      pensionType: "Household planning across two pension records.",
      action: "Turn on spouse or partner planning in Retirement Goal, enter the partner record, then set a joint monthly target.",
      basis: "Household outputs depend on both records being entered and current.",
      application: context?.summary || personalApplicationSummary(context),
      conclusion: "Once both sides are entered, the app can show side-by-side income, a combined projection and a joint gap to target.",
      documents: ["Both pension statements", "Both State Pension figures", "Beneficiary or survivor forms"],
      help: "Use regulated advice or legal advice if the household question becomes a divorce, tax, DB transfer or survivor-benefit issue.",
      boundary: "Guidance only, not legal advice or regulated financial advice.",
      context: {
        ...(context || {}),
        actionSummary: [
          "Turn on spouse or partner planning in Retirement Goal.",
          "Enter the partner pension record and State Pension figure.",
          "Set a joint monthly retirement target before comparing adequacy.",
        ],
      },
    });
  }

  const scenario = calculateHouseholdScenario(projection);
  const answer = survivorIntent
    ? "Couple planning should include a survivor and dependant check, not just a joint income target. Review nomination forms, spouse or dependant benefit wording and any death-in-service cover for both sides."
    : `The current household record projects about ${formatMoney(household.projectedMonthlyIncome)} per month against a joint goal of ${formatMoney(
        toNumber(appState.householdGoal?.jointMonthlyIncome)
      )}.`;
  const conclusion = survivorIntent
    ? "A household retirement plan is incomplete if nominations, survivor benefits and expression-of-wish forms have not been reviewed."
    : household.gap > 0
      ? `The current household path is about ${formatMoney(household.gap / 12)} short per month.`
      : `The current household path is about ${formatMoney(Math.abs(household.gap / 12))} above the joint target per month.`;

  return structuredAnswer({
    label: "Couple planning",
    answer,
    pensionType: "Two-person household planning using your pension record plus the partner profile entered in the app.",
    action: survivorIntent
      ? "The app is highlighting survivor, dependant and nomination checks."
      : "The app is comparing your projection, your partner's projection and the joint goal.",
    basis: "The household view combines the current user projection, the entered partner record, State Pension figures and the joint monthly target.",
    application: `${context?.summary || personalApplicationSummary(context)}${
      scenario ? ` The selected household scenario is ${scenario.label}, which would move the household projection to about ${formatMoney(scenario.projectedMonthlyIncome)} per month.` : ""
    }`,
    conclusion,
    documents: ["Your pension statement", "Partner pension statement", "Joint target note", "Expression-of-wish forms", "Survivor benefit wording"],
    help: "Use regulated advice or legal help if the couple question becomes about divorce, DB transfer, tax or disputed survivor benefits.",
    boundary: "Guidance only, not legal advice or regulated financial advice.",
    context: {
      ...(context || {}),
      actionSummary: survivorIntent
        ? [
            "Check expression-of-wish forms for both partners.",
            "Check spouse, civil partner or dependant benefit wording.",
            "Keep survivor-benefit and death-in-service documents with the household record.",
          ]
        : [
            "Keep both pension records current before relying on the joint projection.",
            "Review whether the joint goal still matches both retirement ages.",
            "Use the household what-if control to test a partner pause, later retirement or higher saving.",
          ],
    },
  });
}

function getCoachAnswer(question, context) {
  const q = normalizeAssistantText(question);
  const projection = context?.projection || calculateProjection();
  const boundaryGuardReply = getBoundaryGuardAnswer(question, projection, context);
  if (boundaryGuardReply) return boundaryGuardReply;

  const scenarioReply = scenarioAnswer(question, projection, context);
  if (scenarioReply) return scenarioReply;

  const riskReply = riskPathwayAnswer(question, projection, context);
  if (riskReply) return riskReply;

  const plainEnglishReply = plainEnglishTermAnswer(question, context);
  if (plainEnglishReply) return plainEnglishReply;

  const planningReply = planningAnswer(question, projection, context);
  if (planningReply) return planningReply;

  const frequentQuestion = findFrequentQuestion(q);
  if (frequentQuestion) return frequentQuestionAnswer(frequentQuestion, projection, context);

  const issue = findPensionIssue(q);
  if (issue) return issueAnswer(issue, projection, context);

  if (isEmployerChangeIntent(q)) {
    const employerChangeRule = frequentQuestionRules.find((item) => item.id === "scheme-change-broad");
    if (employerChangeRule) return frequentQuestionAnswer(employerChangeRule, projection, context);
  }

  const lifeEventReply = lifeEventAnswer(question, context);
  if (lifeEventReply) return lifeEventReply;

  const householdReply = householdAnswer(question, projection, context);
  if (householdReply) return householdReply;

  if (isContributionPlanningQuestion(q)) {
    return contributionAnswer(question, projection, context);
  }

  if (matchesAny(q, ["self-employed", "self employed", "sole trader", "freelance"])) {
    return issueAnswer(pensionIssueLibrary.find((item) => item.id === "self-employed"), projection, context);
  }

  if (matchesAny(q, ["what should i ask", "provider", "scheme", "payroll"])) {
    return providerQuestionsAnswer(context);
  }

  if (matchesAny(q, ["legal", "rights", "can they", "can my employer", "can i", "law", "lawful", "illegal", "allowed"])) {
    return legalGuidance({
      title: "Personal legal status checks",
      answer: "Potentially arguable, but the app needs the specific pension act, employer act, document and date before giving a yes/no view.",
      basis:
        "Most employee pension questions turn on a mix of scheme rules, employment contract, Pensions Act 2008 automatic-enrolment duties, Pensions Act 1995 s67 for protected rights, Equality Act 2010 for equality issues, and Pensions Ombudsman routes for maladministration/disputes.",
      application: `Start from ${appState.userName || "your"} record: ${getPlanLabel()}, ${appState.employerName || "employer not entered"}, ${appState.schemeName || "scheme/provider not entered"}, ${formatPct(appState.employerContributionPct)} employer contribution.`,
      conclusion:
        "Ask the question in the form: 'Can [employer/provider/me] do [specific act] on [date] under [contract/scheme rule/notice]?' Then the answer can be framed as yes, no, potentially, or arguable.",
      docs: "Contract, scheme rules/member booklet, statement, payslips, provider record, HR letters and any change notice.",
      questions: "Ask what legal power or rule is being relied on, what benefits/service periods are affected, and what complaint route applies.",
      help: "Get professional help if the issue is high value, discriminatory, time-sensitive, or affects DB/accrued rights.",
      context,
    });
  }

  return financeGuidance(
    "Personal record summary",
    `${appState.userName}'s record shows ${getPlanLabel()}, projected yearly income of ${formatMoney(projection.displayProjectedYearlyIncome)}, and ${
      (projection.displayGap ?? projection.gap) > 0
        ? `${formatMoney(projection.displayGap ?? projection.gap)} below target`
        : `${formatMoney(Math.abs(projection.displayGap ?? projection.gap))} above target`
    }.`,
    "Ask about contributions, employer duties, payslip mismatch, opt-out pressure, provider questions or scheme documents.",
    context
  );
}

function getBoundaryGuardAnswer(question, projection, context) {
  const text = normalizeAssistantText(question);
  const investmentRecommendationIntent =
    matchesAny(text, ["which fund", "what fund", "best fund", "which etf", "what etf", "best etf", "buy fund", "buy etf", "recommend a fund", "recommend an etf", "pick a fund", "choose a fund"]) ||
    (matchesAny(text, ["should i buy", "should i invest", "where should i invest", "what should i invest in"]) &&
      matchesAny(text, ["fund", "etf", "stock", "share", "investment", "sipp"]));
  const safeguardedTransferIntent =
    matchesAny(text, ["transfer", "consolidate", "move", "cash out", "give up"]) &&
    matchesAny(text, ["db", "defined benefit", "final salary", "safeguarded", "guaranteed", "guarantee", "protected", "underpin", "cetv"]);

  if (!investmentRecommendationIntent && !safeguardedTransferIntent) return null;

  const isTransfer = safeguardedTransferIntent;
  return structuredAnswer({
    label: "Advice boundary",
    answer: isTransfer
      ? "I cannot tell you to transfer or consolidate a DB, final salary, guaranteed or safeguarded pension. I can explain the checks, but regulated financial advice is needed before acting."
      : "I cannot recommend a fund, ETF or product. I can explain risk categories, charges and documents to check, but personal investment recommendations need regulated financial advice.",
    pensionType: isTransfer
      ? "DB, final salary, guaranteed or safeguarded-benefit transfer question."
      : "DC investment choice or product-selection question.",
    action: isTransfer
      ? "The user is considering giving up or moving a potentially guaranteed pension right."
      : "The user is asking for a personal investment or product recommendation.",
    basis: isTransfer
      ? "DB transfers and safeguarded-benefit decisions can be irreversible and may require regulated advice. The app should not make a transfer recommendation."
      : "Choosing a named fund, ETF or product for a person is outside this guidance tool. The app can explain checks but not give a personal recommendation.",
    application: context?.summary || personalApplicationSummary(context),
    conclusion: isTransfer
      ? "Do not transfer, consolidate or give up safeguarded rights based on this prototype."
      : "Use the DC investment guide only to understand broad categories and checks, not to pick a fund.",
    documents: isTransfer
      ? ["transfer pack", "CETV", "scheme booklet", "guarantee/protected-age wording", "charges summary", "regulated adviser details"]
      : ["fund factsheet", "charges summary", "default-fund factsheet", "scheme investment options", "risk questionnaire"],
    help: "Use MoneyHelper, Pension Wise or a regulated financial adviser before acting on this decision.",
    boundary: "Guidance only. No personal recommendation or regulated financial advice.",
    context: {
      ...(context || {}),
      boundaryGuard: true,
      riskOverrideKeys: ["transfer-advice"],
      actionSummary: isTransfer
        ? [
            "Pause before moving the pension.",
            "Check whether any DB, guarantee, protected age or safeguarded benefit exists.",
            "Use regulated advice before deciding.",
          ]
        : [
            "Use broad risk categories first.",
            "Check charges, asset mix and lifestyling.",
            "Use regulated advice for a personal fund choice.",
          ],
    },
  });
}

function isContributionPlanningQuestion(text) {
  const hasTargetIntent = matchesAny(text, [
    "reach my target",
    "retirement target",
    "target income",
    "how much should i contribute",
    "how much should i put",
    "how many should i put",
    "put in order to",
    "put in to",
    "save to reach",
  ]);
  const asksPersonalAmount =
    (text.includes("how much") || text.includes("how many")) &&
    matchesAny(text, ["should i contribute", "should i put", "i put", "i contribute", "i save"]);
  const asksMinimum = matchesAny(text, ["minimum", "employer", "legal", "must my employer", "total minimum", "3%", "8%"]);
  return (hasTargetIntent || asksPersonalAmount) && !asksMinimum;
}

function findFrequentQuestion(text) {
  const normalizedText = normalizeAssistantText(text);
  const scored = frequentQuestionRules
    .map((rule) => {
      const score = rule.patterns.reduce((total, pattern) => total + getPatternScore(normalizedText, pattern), 0);
      return { rule, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.length ? scored[0].rule : null;
}

function getPatternScore(text, pattern) {
  const normalizedText = normalizeAssistantText(text);
  if (typeof pattern === "string") {
    const normalizedPattern = normalizeAssistantText(pattern, { expand: false });
    if (normalizedText.includes(normalizedPattern)) return normalizedPattern.length + 8;
    return getSoftTokenScore(normalizedText, pattern);
  }

  if (Array.isArray(pattern)) {
    const matches = pattern.every((part) => {
      const normalizedPart = normalizeAssistantText(part, { expand: false });
      return normalizedText.includes(normalizedPart) || getSoftTokenScore(normalizedText, part) > 0;
    });
    return matches ? pattern.join(" ").length + pattern.length * 8 : 0;
  }

  if (pattern instanceof RegExp) {
    const match = text.match(pattern);
    return match ? match[0].length + 12 : 0;
  }

  return 0;
}

function frequentQuestionAnswer(rule, projection, context) {
  return structuredAnswer({
    label: rule.label,
    answer: rule.answer,
    pensionType: rule.pensionType,
    action: rule.action,
    basis: rule.basis,
    application: resolveIssueValue(rule.application, projection, context),
    conclusion: rule.conclusion,
    documents: rule.documents,
    help: rule.help,
    boundary: rule.boundary,
    context,
  });
}

function findPensionIssue(text) {
  const normalizedText = normalizeAssistantText(text);
  const scored = pensionIssueLibrary
    .map((issue) => {
      const score = (issue.triggers || []).reduce((total, trigger) => {
        const normalizedTrigger = normalizeAssistantText(trigger, { expand: false });
        if (normalizedText.includes(normalizedTrigger)) {
          return total + normalizedTrigger.length + normalizedTrigger.split(" ").length * 4;
        }
        return total + getSoftTokenScore(normalizedText, trigger);
      }, 0);
      return { issue, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.length ? scored[0].issue : null;
}

function issueAnswer(issue, projection, context) {
  return structuredAnswer({
    label: issue.label,
    answer: issue.answer,
    pensionType: issue.pensionType || inferIssuePensionType(issue),
    action: issue.action || inferIssueAction(issue),
    basis: issue.basis,
    application: resolveIssueValue(issue.application, projection, context),
    conclusion: issue.conclusion,
    documents: issue.documents,
    help: issue.help,
    boundary: issue.boundary,
    context,
  });
}

function resolveIssueValue(value, projection, context) {
  const specific = typeof value === "function" ? value(projection, context) : value;
  if (!specific) return personalApplicationSummary(context);
  return context?.summary ? `${specific} ${context.summary}` : specific;
}

function dedupeTextItems(items) {
  const seen = new Set();
  return items
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function getAssistantRiskFlags(question, context = {}) {
  if (context?.suppressRiskFlags) return [];
  const text = normalizeAssistantText(question || context?.question || appState.lastAssistantQuestion || "");
  const topic = context?.topic || appState.assistantTopic;
  const projection = context?.projection || calculateProjection();
  const savings = getShortTermSavingsPlan(projection);
  const contributionMismatch = Math.abs(getContributionMismatch());
  const flags = [];
  const addFlag = (key, label, reason, priority) => {
    if (flags.some((flag) => flag.key === key)) return;
    flags.push({ key, label, reason, priority });
  };

  (context?.riskOverrideKeys || []).forEach((key) => {
    if (key === "transfer-advice") {
      addFlag("transfer-advice", "Transfer/advice risk", "The question may need regulated advice or a hard boundary.", 100);
    }
  });

  const contributionIntent =
    !context?.boundaryGuard &&
    (topic === "contributions" || matchesAny(text, ["contribution", "payslip", "payroll", "deduct", "provider", "employer contribution", "pensionable pay"]));
  const missingContributionIntent =
    matchesAny(text, ["missing contribution", "late contribution", "not show", "does not show", "provider does not", "deducted but", "deducts pension", "unpaid contribution"]) ||
    (toNumber(appState.payslipContribution) > 0 && contributionMismatch > 10);
  const planningIntent =
    !context?.boundaryGuard &&
    matchesAny(text, ["on track", "planning", "retirement", "target", "goal", "cash", "emergency", "buffer", "next step", "what should i do next", "what now", "saving enough"]);
  const dbIntent =
    hasDbArrangementComponent(appState.pensionType) ||
    topic === "db-rights" ||
    matchesAny(text, ["db", "defined benefit", "final salary", "accrued", "gmp", "barber", "ppf", "scheme rule", "guaranteed"]);
  const transferAdviceIntent =
    context?.boundaryGuard ||
    matchesAny(text, ["transfer", "consolidate", "cetv", "safeguarded", "regulated advice", "which fund", "what fund", "which etf", "buy fund", "buy etf", "investment advice", "drawdown", "annuity"]);
  const survivorIntent =
    topic === "household" ||
    matchesAny(text, ["die", "death", "beneficiary", "nomination", "expression of wish", "survivor", "dependant", "spouse", "partner", "household"]);

  if (missingContributionIntent) {
    addFlag("missing-employer", "Missing employer contribution risk", "Payslip, payroll or provider records may not reconcile.", 95);
  }
  if (transferAdviceIntent) {
    addFlag("transfer-advice", "Transfer/advice risk", "The question may need regulated advice or a personal-recommendation boundary.", 90);
  }
  if (dbIntent) {
    addFlag("db-rule", "DB rule risk", "DB, final salary, safeguarded or scheme-rule wording may change the answer.", 82);
  }
  if (topic === "employer-change" && !dbIntent && !context?.boundaryGuard) {
    addFlag("contribution", "Contribution risk", "Future contribution rates or replacement scheme terms may need checking.", 78);
  }
  if (contributionIntent) {
    addFlag("contribution", "Contribution risk", "Contribution rates, pay basis or payment records may need checking.", 76);
  }
  if (survivorIntent) {
    addFlag("survivor", "Survivor/household risk", "Nominations, dependant benefits or partner records may affect the outcome.", 72);
  }
  if (planningIntent && savings.bufferGap > 0) {
    addFlag("cash-buffer", "Cash-buffer risk", "Emergency savings are below the entered cash target.", 64);
  }

  return flags.sort((a, b) => b.priority - a.priority).slice(0, 3);
}

function renderRiskFlagChips(flags) {
  if (!flags.length) return "";
  return `
    <div class="answer-risk-strip" aria-label="Pension risk triage">
      ${flags
        .map(
          (flag) => `<span class="risk-chip risk-${escapeHtml(flag.key)}" title="${escapeHtml(flag.reason)}">${escapeHtml(flag.label)}</span>`
        )
        .join("")}
    </div>
  `;
}

function getEnhancedDocumentList(documents, context, riskFlags) {
  const baseDocuments = Array.isArray(documents) ? documents : splitDocumentText(documents);
  const text = normalizeAssistantText(context?.question || appState.lastAssistantQuestion || "");
  const keys = new Set(riskFlags.map((flag) => flag.key));
  const additions = [];

  if (keys.has("contribution") || keys.has("missing-employer")) {
    additions.push("latest payslip", "provider contribution history", "payroll explanation", "employer contribution policy");
  }
  if (keys.has("cash-buffer")) {
    additions.push("cash-savings figure", "monthly budget note", "emergency-savings target");
  }
  if (keys.has("db-rule")) {
    additions.push("DB statement", "scheme booklet", "normal pension age wording", "increase/revaluation rules");
  }
  if (keys.has("transfer-advice")) {
    additions.push("transfer pack", "CETV or transfer value", "charges summary", "guarantee/protected-age wording", "regulated adviser details");
  }
  if (keys.has("survivor")) {
    additions.push("expression-of-wish or nomination form", "death-benefit wording", "survivor/dependant benefit wording");
  }
  if (matchesAny(text, ["state pension", "national insurance", "ni record"])) {
    additions.push("State Pension forecast", "National Insurance record");
  }

  return dedupeTextItems([...(baseDocuments.length ? baseDocuments : getDefaultDocuments()), ...additions]).slice(0, 10);
}

function getAssistantDetailSummary(context, riskFlags) {
  const text = normalizeAssistantText(context?.question || appState.lastAssistantQuestion || "");
  const legalOrTechnical =
    ["employer-change", "db-rights", "equality", "tupe", "complaints", "leave"].includes(context?.topic) ||
    riskFlags.some((flag) => ["db-rule", "transfer-advice", "missing-employer"].includes(flag.key)) ||
    matchesAny(text, ["legal", "law", "allowed", "rights", "gmp", "barber", "tupe", "complaint", "ombudsman", "can my employer"]);
  return legalOrTechnical ? "Legal/technical basis and documents" : "Basis and documents";
}

function shouldShowBoundaryAtTop(boundary, context, riskFlags) {
  if (context?.boundaryGuard) return true;
  if (riskFlags.some((flag) => flag.key === "transfer-advice")) return true;
  return /personal recommendation|regulated financial advice/i.test(boundary || "") && matchesAny(context?.question || "", ["buy", "fund", "etf", "transfer", "advice"]);
}

function getFutureDocumentExtractionNote() {
  return "Future document link: a live version could extract employer contribution, employee contribution, scheme type, charges, pot value and retirement age from uploaded or provider-linked documents.";
}

function structuredAnswer({ label, answer, pensionType, action, basis, application, conclusion, documents, help, boundary, context }) {
  const riskFlags = getAssistantRiskFlags(context?.question, context);
  const docItems = getEnhancedDocumentList(documents, context, riskFlags)
    .map((doc) => `<li>${escapeHtml(doc)}</li>`)
    .join("");
  const verifyItems = (context?.verification?.length ? context.verification : ["Check the exact document wording, dates and calculation before treating the answer as settled."])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const usedFacts = (context?.usedFacts?.length
    ? context.usedFacts
    : [
        `Arrangement: ${getPlanLabel()}`,
        `Employer contribution: ${formatPct(appState.employerContributionPct)}`,
        `User contribution: ${formatPct(appState.employeeContributionPct)}`,
      ]
  )
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const escalation = help || context?.escalation || "Use professional help if the issue is high value, urgent, discriminatory, transfer-related or document-heavy.";
  const actionItems = getActionSummaryItems(context);
  const topActionItems = actionItems.slice(0, context?.boundaryGuard ? 3 : 2);
  const actionSummaryItems = topActionItems
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const detailSummary = getAssistantDetailSummary(context, riskFlags);
  const boundaryText = boundary || "Legal information/guidance only, not legal advice.";
  const topBoundaryMarkup = shouldShowBoundaryAtTop(boundaryText, context, riskFlags)
    ? `<p class="answer-boundary-note"><strong>Boundary:</strong> ${escapeHtml(boundaryText)}</p>`
    : "";
  return `
    <div class="answer-block legal-answer">
      <span class="answer-label">${escapeHtml(label)}</span>
      <p><strong>Short answer:</strong> ${escapeHtml(answer)}</p>
      ${renderRiskFlagChips(riskFlags)}
      ${topBoundaryMarkup}
      <p><strong>Next step${topActionItems.length === 1 ? "" : "s"}:</strong></p>
      <ul class="verify-list">${actionSummaryItems}</ul>
      <details class="answer-detail">
        <summary>${escapeHtml(detailSummary)}</summary>
        <div class="answer-detail-body">
          <p><strong>Type:</strong> ${escapeHtml(pensionType || "Workplace, occupational or personal pension depending on the documents.")}</p>
          <p><strong>Action:</strong> ${escapeHtml(action || "Identify whether the employer, provider, trustees or member is enrolling, changing, transferring, reducing, delaying or correcting pension rights.")}</p>
          <p><strong>For your record:</strong> ${escapeHtml(application || personalApplicationSummary(context))}</p>
          <p><strong>Basis:</strong> ${escapeHtml(basis || "Current record, entered assumptions and relevant pension documents.")}</p>
          <p><strong>Bottom line:</strong> ${escapeHtml(conclusion || answer)}</p>
          <p><strong>Verify:</strong></p>
          <ul class="verify-list">${verifyItems}</ul>
          <p><strong>Documents:</strong></p>
          <ul>${docItems}</ul>
          <p class="answer-future-note"><strong>Future document link:</strong> ${escapeHtml(getFutureDocumentExtractionNote().replace(/^Future document link:\s*/i, ""))}</p>
          <div class="answer-meta">
            <strong>Used from your record</strong>
            <ul class="used-facts-list">${usedFacts}</ul>
          </div>
          <p><strong>Help route:</strong> ${escapeHtml(escalation)}</p>
          <p><strong>Boundary:</strong> ${escapeHtml(boundaryText)}</p>
        </div>
      </details>
    </div>
  `;
}

function personalApplicationSummary(context) {
  const base = `The current record says ${getPlanLabel()}, ${formatPct(appState.employerContributionPct)} employer contribution, ${formatPct(
    appState.employeeContributionPct
  )} employee contribution, and pensionable pay basis '${appState.pensionablePayBasis}'.`;
  return context?.summary ? `${base} ${context.summary}` : `${base} Check the question against the actual scheme rules, contract and provider records.`;
}

function splitDocumentText(value) {
  if (!value) return [];
  return String(value)
    .split(/,\s*|\s+and\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getDefaultDocuments() {
  return ["contract", "scheme booklet/rules", "payslips", "provider records", "employer letters or emails"];
}

function inferIssuePensionType(issue) {
  const typeByCategory = {
    "Employer change": "Workplace or occupational pension, often DC or DB depending on the changed benefit.",
    "Employer duty": "Automatic enrolment workplace pension and employment contract rights.",
    Payroll: "Workplace pension contribution administration.",
    Eligibility: "Automatic enrolment workplace pension.",
    "Pay basis": "Automatic enrolment pay basis or scheme-specific pensionable pay.",
    "Scheme ID": "Manual scheme identification: DC, DB, hybrid, State Pension only or unknown.",
    Fundamentals: "DC, DB, hybrid or State Pension fundamentals.",
    Transfers: "DC transfer, DB/safeguarded-benefit transfer or transfer-scam issue.",
    Equality: "DB/occupational pension equality, Barber/GMP or protected-characteristic issue.",
    "Employment transfer": "TUPE/business-transfer pension protection.",
    "Employer insolvency": "DB scheme funding/PPF or employer insolvency issue.",
    "Scheme funding": "DB scheme funding, employer debt or moral-hazard issue.",
    Trustees: "Trust-based occupational pension governance or investment issue.",
    Benefits: "Death, survivor, ill-health or other scheme benefit issue.",
    "Retirement choices": "DC retirement access, DB retirement terms or tax-access issue.",
    Escalation: "Complaint, IDRP, Ombudsman, regulator or advice route.",
  };
  return typeByCategory[issue.category] || "Workplace, occupational or personal pension depending on the documents.";
}

function inferIssueAction(issue) {
  const actionByCategory = {
    "Employer change": "The employer or trustees are changing future accrual, benefits, provider, rules or scheme structure.",
    "Employer duty": "The employer is enrolling, contributing, stopping, reducing or pressuring membership.",
    Payroll: "Payroll/provider is recording, paying or correcting pension contributions.",
    Eligibility: "The employer is assessing worker status, age and earnings for automatic enrolment.",
    "Pay basis": "The employer is deciding which earnings count for contribution calculations.",
    "Scheme ID": "The user is identifying the legal benefit basis from scheme documents.",
    Fundamentals: "The user is trying to understand the rights and risks of the selected pension type.",
    Transfers: "The user, provider or trustees are transferring/consolidating pension rights.",
    Equality: "The scheme is applying sex/equality/equalisation rules or correcting historic unequal benefits.",
    "Employment transfer": "Employment is transferring to a new employer and pension protection is being assessed.",
    "Employer insolvency": "The employer or scheme is entering insolvency/PPF assessment territory.",
    "Scheme funding": "The employer, trustees or regulator are dealing with DB funding support.",
    Trustees: "Trustees/provider are making investment or governance decisions.",
    Benefits: "The scheme/provider is deciding a benefit entitlement.",
    "Retirement choices": "The member is accessing or timing pension benefits.",
    Escalation: "The member is gathering documents, complaining or escalating.",
  };
  return actionByCategory[issue.category] || "Identify whether the action is enrolment, contribution, change, transfer, benefit decision or complaint.";
}

function contributionAnswer(question, projection, context) {
  const salary = extractMonthlySalary(question) ? extractMonthlySalary(question) * 12 : appState.salary;
  const target = extractMonthlyTarget(question) || appState.targetMonthlyIncome;
  const questionProjection = calculateProjection({ salary, targetMonthlyIncome: target });
  const needed = estimateContributionNeeded({ salary, targetMonthlyIncome: target });
  const extraMonthly = Math.max(0, needed.requiredMonthly - questionProjection.totalMonthly);
  return structuredAnswer({
    label: "Contribution target",
    answer: `Using ${formatMoney(salary / 12)} monthly salary and ${formatMoney(
      target
    )} monthly retirement target, an illustrative total pension contribution is about ${formatMoney(needed.requiredMonthly)} per month, or ${formatPct(
      needed.requiredPct
    )} of salary.`,
    pensionType: "Illustrative contribution planning for the entered pension arrangement.",
    action: "The assistant is translating the entered salary, target and contribution assumptions into a rough monthly savings requirement.",
    basis: "Projection assumptions only. This is not a statement of legal minimum contributions or regulated financial advice.",
    application: resolveIssueValue(
      `The current combined employer and user contribution is about ${formatMoney(questionProjection.totalMonthly)} per month. Indicative extra contribution is ${formatMoney(
        extraMonthly
      )} per month.`,
      questionProjection,
      context
    ),
    conclusion: "Use this as a planning reference only. Charges, investment returns, tax, drawdown choices and guaranteed benefits can materially change the result.",
    documents: ["latest payslip", "provider statement", "charges/fund summary", "retirement target working"],
    help: "Use regulated financial advice for investment choice, drawdown, DB transfer decisions or large contribution changes.",
    boundary: "Financial guidance only, not regulated financial advice.",
    context: {
      ...(context || {}),
      verification: [
        "Check whether the salary and target assumptions reflect the real question being asked.",
        "Check charges, investment assumptions and whether any guaranteed benefits exist.",
        "Check whether the issue is planning adequacy rather than a legal minimum duty question.",
      ],
      escalation: "Use regulated financial advice before acting on large contribution changes or investment decisions.",
    },
  });
}

function schemeTypeAnswer() {
  if (appState.pensionType !== "Unknown") {
    return financeGuidance(
      "Entered scheme type",
      `Your record says ${getPlanLabel()}. ${getPlanDetail()}`,
      "Keep this matched with your latest statement, scheme booklet and provider portal."
    );
  }
  return financeGuidance(
    "Unknown scheme type",
    "The record is set to Unknown, so the app will not guess. Check for terms such as DC, DB, final salary, career average, pot value, fund value, pensionable service or accrual rate.",
    "Ask your provider or employer: What is the scheme type? What benefit basis applies? Is any part guaranteed?"
  );
}

function providerQuestionsAnswer(context) {
  return financeGuidance(
    "Provider questions for this record",
    `Ask ${appState.schemeName || "the provider"}: Is this DC, DB or hybrid? What is pensionable pay? What employer and employee rates apply? What charges and funds apply?`,
    "Also ask whether there are guarantees, exit fees, protected pension ages, transfer restrictions and a contribution history matching your payslips.",
    context
  );
}

function escalationAnswer() {
  return legalGuidance({
    title: "Escalation route",
    involve: "Most pension issues should start with written clarification from employer, payroll or provider before a formal complaint.",
    docs: "Keep a dated bundle: contract, scheme booklet, payslips, contribution history, pension statements, emails and screenshots.",
    questions: "Ask what complaint process applies, who owns payroll corrections, and when a written final response will be given.",
    next: "If unresolved, use the provider or employer complaint process and keep a timeline.",
    help: "Consider MoneyHelper, Pension Wise for retirement access issues, The Pensions Ombudsman route, The Pensions Regulator information, a regulated adviser or legal advice depending on the issue.",
  });
}

function financeGuidance(title, body, next, context) {
  const riskFlags = getAssistantRiskFlags(context?.question, context);
  const actionSummaryItems = getActionSummaryItems(context)
    .slice(0, 2)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const escalation = context?.escalation || "Use MoneyHelper, Pension Wise or regulated advice if the question turns into a major retirement, transfer or access decision.";
  const boundaryText = "Guidance only, not regulated financial advice or legal advice.";
  const topBoundaryMarkup = shouldShowBoundaryAtTop(boundaryText, context, riskFlags)
    ? `<p class="answer-boundary-note"><strong>Boundary:</strong> ${escapeHtml(boundaryText)}</p>`
    : "";
  const usedFacts = context?.usedFacts?.length
    ? `<div class="answer-meta"><strong>Used from your record</strong><ul class="used-facts-list">${context.usedFacts
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ul></div>`
    : "";
  return `
    <div class="answer-block">
      <span class="answer-label">${escapeHtml(title)}</span>
      <p><strong>Short answer:</strong> ${escapeHtml(body)}</p>
      ${renderRiskFlagChips(riskFlags)}
      ${topBoundaryMarkup}
      <p><strong>Next steps:</strong></p>
      <ul class="verify-list">${actionSummaryItems}</ul>
      <details class="answer-detail">
        <summary>${escapeHtml(getAssistantDetailSummary(context, riskFlags))}</summary>
        <div class="answer-detail-body">
          <p><strong>For your record:</strong> ${escapeHtml(context?.summary || personalApplicationSummary(context))}</p>
          <p><strong>Verify:</strong> ${escapeHtml(next)}</p>
          <p class="answer-future-note"><strong>Future document link:</strong> ${escapeHtml(getFutureDocumentExtractionNote().replace(/^Future document link:\s*/i, ""))}</p>
          <p><strong>Help route:</strong> ${escapeHtml(escalation)}</p>
          <p><strong>Boundary:</strong> ${escapeHtml(boundaryText)}</p>
          ${usedFacts}
        </div>
      </details>
    </div>
  `;
}

function legalGuidance({ title, answer, basis, application, conclusion, involve, docs, questions, next, help, context }) {
  if (answer || basis || application || conclusion) {
    return structuredAnswer({
      label: title,
      answer: answer || "Potentially arguable; the documents decide the legal position.",
      pensionType: "Workplace, occupational or personal pension depending on the issue.",
      action: "The employer, provider, trustees or member is taking an action that needs to be checked against rules, contract and legislation.",
      basis: basis || "Scheme rules, contract, pensions legislation and complaint routes may all matter.",
      application: application || personalApplicationSummary(context),
      conclusion: conclusion || "Do not rely on a yes/no view until the exact document wording and dates are checked.",
      documents: docs || "contract, scheme rules/member booklet, statement, payslips and provider records",
      help: help || "Use professional help if the issue is high value, urgent or document-heavy.",
      boundary: "Legal information/guidance only, not legal advice.",
      context,
    });
  }

  return structuredAnswer({
    label: title,
    answer: "Potentially arguable; the legal position depends on the scheme rules, contract, statutory duties and evidence.",
    pensionType: "Workplace, occupational or personal pension depending on the issue.",
    action: involve || "The relevant pension action needs to be identified and checked against documents.",
    basis: "Scheme rules, contract, pensions legislation and complaint routes may all matter.",
    application: personalApplicationSummary(context),
    conclusion: next || "Check documents first, then escalate if the position remains unresolved.",
    documents: docs,
    help,
    boundary: "Legal information/guidance only, not legal advice.",
    context,
  });
}

function matchesAny(text, patterns) {
  const normalizedText = normalizeAssistantText(text);
  return patterns.some((pattern) => {
    const normalizedPattern = normalizeAssistantText(pattern, { expand: false });
    return normalizedText.includes(normalizedPattern) || getSoftTokenScore(normalizedText, pattern) > 0;
  });
}

function extractMonthlySalary(text) {
  const direct = text.match(/(?:earn|salary|paid|make|wage)\s*(?:is|of|=|about)?\s*(?:gbp|pounds?|\u00a3)?\s*([0-9][0-9,]*(?:\.[0-9]+)?)\s*(?:per month|monthly|monthy|\/month|a month)?/i);
  const trailing = text.match(/(?:gbp|pounds?|\u00a3)?\s*([0-9][0-9,]*(?:\.[0-9]+)?)\s*(?:per month|monthly|monthy|\/month|a month)\s*(?:salary|pay|wage)?/i);
  const match = direct || trailing;
  if (!match) return null;
  const parsed = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function extractMonthlyTarget(text) {
  const direct = text.match(/(?:reach|target|want|need|get|in order to|order to|retirement income(?: of)?|income target(?: of)?)\s*(?:gbp|pounds?|\u00a3)?\s*([0-9][0-9,]*(?:\.[0-9]+)?)\s*(?:per month|monthly|monthy|\/month|a month)?/i);
  if (direct) {
    const parsed = Number(direct[1].replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }

  const hasTargetIntent = /reach|target|want|need|get|in order to|order to|retirement income/.test(text);
  if (!hasTargetIntent) return null;
  const amounts = [...text.matchAll(/(?:gbp|pounds?|\u00a3)?\s*([0-9][0-9,]*(?:\.[0-9]+)?)(?:\s*(?:per month|monthly|monthy|\/month|a month))?/gi)].map((match) =>
    Number(match[1].replace(/,/g, ""))
  );
  const validAmounts = amounts.filter((amount) => Number.isFinite(amount));
  return validAmounts.length >= 2 ? validAmounts[validAmounts.length - 1] : null;
}

window.addEventListener("resize", () => {
  drawProjection(calculateProjection());
});

let employmentRecordSeq = 0;

function nextEmploymentRecordId() {
  employmentRecordSeq += 1;
  return `employment-${employmentRecordSeq}`;
}

function nowStamp() {
  return new Date().toISOString();
}

function createPortfolioMeta(overrides = {}) {
  return {
    savedAt: null,
    starterMode: "blank",
    ...overrides,
  };
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeDcInvestmentAccess(value) {
  return ["default", "workplace-self-select", "sipp"].includes(value) ? value : "default";
}

function normalizeDcInvestmentStyle(value) {
  return ["aggressive", "balanced", "conservative"].includes(value) ? value : "balanced";
}

function normalizeMoneyMode(value) {
  return value === "nominal" ? "nominal" : "today";
}

function normalizeTaxReliefMode(value) {
  return ["net-pay", "relief-at-source", "salary-sacrifice"].includes(value) ? value : "net-pay";
}

function normalizeDbAmountBasis(value) {
  return value === "current-deferred" ? "current-deferred" : "at-scheme-age";
}

function normalizeEmploymentType(value) {
  const normalized = String(value || "employee").toLowerCase().trim();
  if (["employee", "multiple", "part-time", "self"].includes(normalized)) return normalized;
  if (normalized === "self-employed" || normalized === "self employed" || normalized === "contractor") return "self";
  return "employee";
}

function normalizeHousingStatus(value) {
  return ["unknown", "owned-outright", "mortgage", "renting", "shared"].includes(value) ? value : "unknown";
}

function normalizeDebtPressure(value) {
  return ["none", "manageable", "high"].includes(value) ? value : "none";
}

function normalizeSurvivorNeed(value) {
  return ["unknown", "low", "medium", "high"].includes(value) ? value : "unknown";
}

function normalizePensionablePayBasis(value) {
  const normalized = String(value || "qualifying earnings").toLowerCase().trim().replace(/-/g, " ");
  return ["qualifying earnings", "basic salary", "total earnings", "unknown"].includes(normalized) ? normalized : "qualifying earnings";
}

function normalizeSecondJobPensionParticipation(value) {
  return ["active", "opted-out", "not-joined", "unknown"].includes(value) ? value : "unknown";
}

function normalizeStatePensionAge(value) {
  const age = Math.round(toNumber(value));
  return age >= 60 && age <= 75 ? age : 67;
}

function createEmptySecondJobState() {
  return {
    secondJobEnabled: false,
    secondJobAnnualIncome: 0,
    secondJobPensionParticipation: "unknown",
    secondJobEmployerContributionPct: 0,
    secondJobEmployeeContributionPct: 0,
    secondJobPensionablePayBasis: "qualifying earnings",
  };
}

function createEmploymentRecord(overrides = {}) {
  const record = {
    id: overrides.id || nextEmploymentRecordId(),
    status: "previous",
    periodLabel: "Previous role",
    employerName: "",
    employmentType: "employee",
    schemeName: "",
    pensionType: "Unknown",
    annualIncome: 0,
    pensionStatus: "unknown",
    potValue: 0,
    dbAnnualPensionAtSchemeAge: 0,
    dbSchemePensionAge: 0,
    dbAmountBasis: "at-scheme-age",
    dbRevaluationPct: 0,
    dbIndexationPct: 0,
    dbAdjustmentPct: 0,
    employerContributionPct: 0,
    employeeContributionPct: 0,
    dcInvestmentAccess: "default",
    dcInvestmentStyle: "balanced",
    payslipContribution: 0,
    providerContribution: 0,
    pensionablePayBasis: "qualifying earnings",
    ...createEmptySecondJobState(),
    ...overrides,
    updatedAt: overrides.updatedAt || nowStamp(),
  };
  record.dcInvestmentAccess = normalizeDcInvestmentAccess(record.dcInvestmentAccess);
  record.dcInvestmentStyle = normalizeDcInvestmentStyle(record.dcInvestmentStyle);
  record.employmentType = normalizeEmploymentType(record.employmentType);
  record.dbAmountBasis = normalizeDbAmountBasis(record.dbAmountBasis);
  record.dbRevaluationPct = toNumber(record.dbRevaluationPct);
  record.dbIndexationPct = toNumber(record.dbIndexationPct);
  record.dbAdjustmentPct = toNumber(record.dbAdjustmentPct);
  record.pensionablePayBasis = normalizePensionablePayBasis(record.pensionablePayBasis);
  record.secondJobEnabled = Boolean(record.secondJobEnabled);
  record.secondJobAnnualIncome = toNumber(record.secondJobAnnualIncome);
  record.secondJobPensionParticipation = normalizeSecondJobPensionParticipation(record.secondJobPensionParticipation);
  record.secondJobEmployerContributionPct = toNumber(record.secondJobEmployerContributionPct);
  record.secondJobEmployeeContributionPct = toNumber(record.secondJobEmployeeContributionPct);
  record.secondJobPensionablePayBasis = normalizePensionablePayBasis(record.secondJobPensionablePayBasis);
  return record;
}

function createCurrentRecordFromState() {
  return createEmploymentRecord({
    status: "current",
    periodLabel: "Now",
    employerName: appState.employerName || "Current employer",
    employmentType: normalizeEmploymentType(appState.employmentType),
    schemeName: appState.schemeName || "",
    pensionType: appState.pensionType || "Unknown",
    annualIncome: toNumber(appState.salary),
    pensionStatus: "active",
    potValue: toNumber(appState.currentPot),
    dbAnnualPensionAtSchemeAge: toNumber(appState.dbAnnualPensionAtSchemeAge),
    dbSchemePensionAge: toNumber(appState.dbSchemePensionAge),
    dbAmountBasis: normalizeDbAmountBasis(appState.dbAmountBasis),
    dbRevaluationPct: toNumber(appState.dbRevaluationPct),
    dbIndexationPct: toNumber(appState.dbIndexationPct),
    dbAdjustmentPct: toNumber(appState.dbAdjustmentPct),
    employerContributionPct: toNumber(appState.employerContributionPct),
    employeeContributionPct: toNumber(appState.employeeContributionPct),
    dcInvestmentAccess: normalizeDcInvestmentAccess(appState.dcInvestmentAccess),
    dcInvestmentStyle: normalizeDcInvestmentStyle(appState.dcInvestmentStyle),
    statePensionAge: normalizeStatePensionAge(appState.statePensionAge),
    payslipContribution: toNumber(appState.payslipContribution),
    providerContribution: toNumber(appState.providerContribution),
    pensionablePayBasis: normalizePensionablePayBasis(appState.pensionablePayBasis),
    secondJobEnabled: Boolean(appState.secondJobEnabled),
    secondJobAnnualIncome: toNumber(appState.secondJobAnnualIncome),
    secondJobPensionParticipation: normalizeSecondJobPensionParticipation(appState.secondJobPensionParticipation),
    secondJobEmployerContributionPct: toNumber(appState.secondJobEmployerContributionPct),
    secondJobEmployeeContributionPct: toNumber(appState.secondJobEmployeeContributionPct),
    secondJobPensionablePayBasis: normalizePensionablePayBasis(appState.secondJobPensionablePayBasis),
  });
}

function createExampleEmploymentHistory() {
  return [
    createCurrentRecordFromState(),
    createEmploymentRecord({
      status: "previous",
      periodLabel: "2019-2022",
      employerName: "Previous employer",
      employmentType: "employee",
      schemeName: "Deferred workplace pension",
      pensionType: "DC",
      annualIncome: 29000,
      pensionStatus: "deferred",
      potValue: 920,
    }),
    createEmploymentRecord({
      status: "previous",
      periodLabel: "2016-2018",
      employerName: "Previous part-time job",
      employmentType: "part-time",
      schemeName: "Deferred workplace pension",
      pensionType: "DC",
      annualIncome: 6500,
      pensionStatus: "deferred",
      potValue: 4850,
    }),
  ];
}

function createBlankPortfolioState() {
  return {
    userName: "",
    employerName: "",
    schemeName: "",
    employmentType: "employee",
    mainConcern: "contribution gap",
    age: 35,
    retireAge: 68,
    salary: 0,
    emergencySavings: 0,
    targetMonthlyIncome: 0,
    currentPot: 0,
    dbAnnualPensionAtSchemeAge: 0,
    dbSchemePensionAge: 0,
    dbAmountBasis: "at-scheme-age",
    dbRevaluationPct: 0,
    dbIndexationPct: 0,
    dbAdjustmentPct: 0,
    pensionType: "Unknown",
    employerContributionPct: 0,
    employeeContributionPct: 0,
    dcInvestmentAccess: "default",
    dcInvestmentStyle: "balanced",
    secondJobEnabled: false,
    secondJobAnnualIncome: 0,
    secondJobPensionParticipation: "unknown",
    secondJobEmployerContributionPct: 0,
    secondJobEmployeeContributionPct: 0,
    secondJobPensionablePayBasis: "qualifying earnings",
    statePension: 0,
    statePensionAge: 67,
    pensionablePayBasis: "qualifying earnings",
    payslipContribution: 0,
    providerContribution: 0,
    growthPct: ASSUMPTION_PRESETS.base.growthPct,
    drawdownPct: ASSUMPTION_PRESETS.base.drawdownPct,
    annualChargePct: 0,
    inflationPct: 2.5,
    moneyMode: "today",
    salaryGrowthPct: 0,
    contributionEscalationPct: 0,
    taxReliefMode: "net-pay",
    marginalTaxPct: 20,
    employeeNiPct: 8,
    assumptionPreset: "base",
    jobOne: 0,
    jobTwo: 0,
    scenarioModel: createDefaultScenarioModel(),
    projectionInspectorAge: 35,
    projectionInspectorSegment: "db",
    incomeMixAgeTouched: false,
    assistantTopic: "planning",
    caseFacts: createEmptyCaseFacts(),
    pendingAssistantQuestion: "",
    lastAssistantQuestion: "",
    shortTermSavings: createDefaultShortTermSavings(),
    lifeFactors: createDefaultLifeFactors(),
    partnerProfile: createDefaultPartnerProfile(),
    householdGoal: createDefaultHouseholdGoal(),
    meta: createPortfolioMeta({ starterMode: "blank" }),
    employmentHistory: [
      createEmploymentRecord({
        status: "current",
        periodLabel: "Now",
        pensionStatus: "active",
      }),
    ],
  };
}

function normalizeEmploymentRecord(record) {
  return createEmploymentRecord({
    ...record,
    annualIncome: toNumber(record.annualIncome),
    potValue: toNumber(record.potValue),
    dbAnnualPensionAtSchemeAge: toNumber(record.dbAnnualPensionAtSchemeAge),
    dbSchemePensionAge: toNumber(record.dbSchemePensionAge),
    dbAmountBasis: normalizeDbAmountBasis(record.dbAmountBasis),
    dbRevaluationPct: toNumber(record.dbRevaluationPct),
    dbIndexationPct: toNumber(record.dbIndexationPct),
    dbAdjustmentPct: toNumber(record.dbAdjustmentPct),
    employerContributionPct: toNumber(record.employerContributionPct),
    employeeContributionPct: toNumber(record.employeeContributionPct),
    dcInvestmentAccess: normalizeDcInvestmentAccess(record.dcInvestmentAccess),
    dcInvestmentStyle: normalizeDcInvestmentStyle(record.dcInvestmentStyle),
    payslipContribution: toNumber(record.payslipContribution),
    providerContribution: toNumber(record.providerContribution),
    pensionablePayBasis: normalizePensionablePayBasis(record.pensionablePayBasis),
    secondJobEnabled: Boolean(record.secondJobEnabled),
    secondJobAnnualIncome: toNumber(record.secondJobAnnualIncome),
    secondJobPensionParticipation: normalizeSecondJobPensionParticipation(record.secondJobPensionParticipation),
    secondJobEmployerContributionPct: toNumber(record.secondJobEmployerContributionPct),
    secondJobEmployeeContributionPct: toNumber(record.secondJobEmployeeContributionPct),
    secondJobPensionablePayBasis: normalizePensionablePayBasis(record.secondJobPensionablePayBasis),
  });
}

function normalizeEmploymentHistory() {
  if (!Array.isArray(appState.employmentHistory) || !appState.employmentHistory.length) {
    appState.employmentHistory = createExampleEmploymentHistory();
  }

  let currentChosen = false;
  const normalized = appState.employmentHistory.map((record, index) => {
    const row = normalizeEmploymentRecord(record);
    const shouldBeCurrent = !currentChosen && (row.status === "current" || index === 0);
    if (shouldBeCurrent) currentChosen = true;
    return {
      ...row,
      status: shouldBeCurrent ? "current" : "previous",
      periodLabel: row.periodLabel || (shouldBeCurrent ? "Now" : "Previous role"),
      pensionStatus: shouldBeCurrent ? "active" : row.pensionStatus || "deferred",
      ...(shouldBeCurrent ? {} : createEmptySecondJobState()),
    };
  });

  const currentRows = normalized.filter((record) => record.status === "current");
  const previousRows = normalized.filter((record) => record.status !== "current");
  appState.employmentHistory = [...currentRows, ...previousRows];
  syncEmploymentRecordSequence();
}

function ensureEmploymentHistoryState() {
  normalizeEmploymentHistory();
}

function syncEmploymentRecordSequence() {
  const maxId = (appState.employmentHistory || []).reduce((highest, record) => {
    const match = String(record.id || "").match(/^employment-(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  employmentRecordSeq = Math.max(employmentRecordSeq, maxId);
}

function matchAssumptionPreset(growthPct = appState.growthPct, drawdownPct = appState.drawdownPct) {
  const match = Object.entries(ASSUMPTION_PRESETS).find(
    ([, preset]) => preset.growthPct === Number(growthPct) && preset.drawdownPct === Number(drawdownPct)
  );
  return match?.[0] || "custom";
}

function syncAssumptionPreset() {
  appState.assumptionPreset = matchAssumptionPreset(appState.growthPct, appState.drawdownPct);
}

function setAssumptionPreset(presetKey) {
  const preset = ASSUMPTION_PRESETS[presetKey];
  if (!preset) return;
  appState.growthPct = preset.growthPct;
  appState.drawdownPct = preset.drawdownPct;
  appState.assumptionPreset = presetKey;
  markPortfolioUpdated();
  render();
}

function markPortfolioUpdated({ starterMode } = {}) {
  appState.meta = createPortfolioMeta({
    ...(appState.meta || {}),
    starterMode: starterMode || appState.meta?.starterMode || "blank",
    savedAt: nowStamp(),
  });
}

function getPersistedPortfolioSnapshot() {
  return {
    version: 1,
    userName: appState.userName,
    employerName: appState.employerName,
    schemeName: appState.schemeName,
    employmentType: appState.employmentType,
    mainConcern: appState.mainConcern,
    age: appState.age,
    retireAge: appState.retireAge,
    salary: appState.salary,
    emergencySavings: appState.emergencySavings,
    targetMonthlyIncome: appState.targetMonthlyIncome,
    currentPot: appState.currentPot,
    dbAnnualPensionAtSchemeAge: appState.dbAnnualPensionAtSchemeAge,
    dbSchemePensionAge: appState.dbSchemePensionAge,
    dbAmountBasis: normalizeDbAmountBasis(appState.dbAmountBasis),
    dbRevaluationPct: appState.dbRevaluationPct,
    dbIndexationPct: appState.dbIndexationPct,
    dbAdjustmentPct: appState.dbAdjustmentPct,
    pensionType: appState.pensionType,
    employerContributionPct: appState.employerContributionPct,
    employeeContributionPct: appState.employeeContributionPct,
    dcInvestmentAccess: normalizeDcInvestmentAccess(appState.dcInvestmentAccess),
    dcInvestmentStyle: normalizeDcInvestmentStyle(appState.dcInvestmentStyle),
    secondJobEnabled: Boolean(appState.secondJobEnabled),
    secondJobAnnualIncome: appState.secondJobAnnualIncome,
    secondJobPensionParticipation: normalizeSecondJobPensionParticipation(appState.secondJobPensionParticipation),
    secondJobEmployerContributionPct: appState.secondJobEmployerContributionPct,
    secondJobEmployeeContributionPct: appState.secondJobEmployeeContributionPct,
    secondJobPensionablePayBasis: normalizePensionablePayBasis(appState.secondJobPensionablePayBasis),
    statePension: appState.statePension,
    statePensionAge: normalizeStatePensionAge(appState.statePensionAge),
    pensionablePayBasis: normalizePensionablePayBasis(appState.pensionablePayBasis),
    payslipContribution: appState.payslipContribution,
    providerContribution: appState.providerContribution,
    growthPct: appState.growthPct,
    drawdownPct: appState.drawdownPct,
    annualChargePct: appState.annualChargePct,
    inflationPct: appState.inflationPct,
    moneyMode: normalizeMoneyMode(appState.moneyMode),
    salaryGrowthPct: appState.salaryGrowthPct,
    contributionEscalationPct: appState.contributionEscalationPct,
    taxReliefMode: normalizeTaxReliefMode(appState.taxReliefMode),
    marginalTaxPct: appState.marginalTaxPct,
    employeeNiPct: appState.employeeNiPct,
    assumptionPreset: appState.assumptionPreset,
    jobOne: appState.jobOne,
    jobTwo: appState.jobTwo,
    scenarioModel: appState.scenarioModel,
    shortTermSavings: appState.shortTermSavings,
    lifeFactors: appState.lifeFactors,
    partnerProfile: appState.partnerProfile,
    householdGoal: appState.householdGoal,
    meta: appState.meta,
    employmentHistory: appState.employmentHistory,
  };
}

function persistPortfolio() {
  if (els.onboardingOverlay?.classList.contains("active") && !appState.meta?.savedAt) {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getPersistedPortfolioSnapshot()));
  } catch (error) {
    console.warn("Unable to persist portfolio locally.", error);
  }
}

function applyPortfolioSnapshot(snapshot = {}, { touchSavedAt = false, starterMode } = {}) {
  const { version: _version, ...source } = snapshot || {};
  const blank = createBlankPortfolioState();
  const nextState = {
    ...blank,
    ...source,
    growthPct: Number.isFinite(Number(source.growthPct)) ? Number(source.growthPct) : blank.growthPct,
    drawdownPct: Number.isFinite(Number(source.drawdownPct)) ? Number(source.drawdownPct) : blank.drawdownPct,
    annualChargePct: Number.isFinite(Number(source.annualChargePct)) ? Number(source.annualChargePct) : blank.annualChargePct,
    inflationPct: Number.isFinite(Number(source.inflationPct)) ? Number(source.inflationPct) : blank.inflationPct,
    moneyMode: normalizeMoneyMode(source.moneyMode ?? blank.moneyMode),
    salaryGrowthPct: Number.isFinite(Number(source.salaryGrowthPct)) ? Number(source.salaryGrowthPct) : blank.salaryGrowthPct,
    contributionEscalationPct: Number.isFinite(Number(source.contributionEscalationPct))
      ? Number(source.contributionEscalationPct)
      : blank.contributionEscalationPct,
    taxReliefMode: normalizeTaxReliefMode(source.taxReliefMode ?? blank.taxReliefMode),
    marginalTaxPct: Number.isFinite(Number(source.marginalTaxPct)) ? Number(source.marginalTaxPct) : blank.marginalTaxPct,
    employeeNiPct: Number.isFinite(Number(source.employeeNiPct)) ? Number(source.employeeNiPct) : blank.employeeNiPct,
    dbAmountBasis: normalizeDbAmountBasis(source.dbAmountBasis ?? blank.dbAmountBasis),
    dbRevaluationPct: Number.isFinite(Number(source.dbRevaluationPct)) ? Number(source.dbRevaluationPct) : blank.dbRevaluationPct,
    dbIndexationPct: Number.isFinite(Number(source.dbIndexationPct)) ? Number(source.dbIndexationPct) : blank.dbIndexationPct,
    dbAdjustmentPct: Number.isFinite(Number(source.dbAdjustmentPct)) ? Number(source.dbAdjustmentPct) : blank.dbAdjustmentPct,
    shortTermSavings: {
      ...createDefaultShortTermSavings(),
      ...(source.shortTermSavings || {}),
    },
    lifeFactors: {
      ...createDefaultLifeFactors(),
      ...(source.lifeFactors || {}),
      housingStatus: normalizeHousingStatus(source.lifeFactors?.housingStatus),
      monthlyHousingCost: toNumber(source.lifeFactors?.monthlyHousingCost),
      debtPressure: normalizeDebtPressure(source.lifeFactors?.debtPressure),
      dependants: toNumber(source.lifeFactors?.dependants),
      survivorNeed: normalizeSurvivorNeed(source.lifeFactors?.survivorNeed),
    },
    partnerProfile: {
      ...createDefaultPartnerProfile(),
      ...(source.partnerProfile || {}),
    },
    householdGoal: {
      ...createDefaultHouseholdGoal(),
      ...(source.householdGoal || {}),
    },
    scenarioModel: {
      ...createDefaultScenarioModel(),
      ...(source.scenarioModel || {}),
    },
    dcInvestmentAccess: normalizeDcInvestmentAccess(source.dcInvestmentAccess ?? blank.dcInvestmentAccess),
    dcInvestmentStyle: normalizeDcInvestmentStyle(source.dcInvestmentStyle ?? blank.dcInvestmentStyle),
    employmentType: normalizeEmploymentType(source.employmentType ?? blank.employmentType),
    secondJobEnabled: Boolean(source.secondJobEnabled ?? blank.secondJobEnabled),
    secondJobAnnualIncome: toNumber(source.secondJobAnnualIncome ?? blank.secondJobAnnualIncome),
    secondJobPensionParticipation: normalizeSecondJobPensionParticipation(
      source.secondJobPensionParticipation ?? blank.secondJobPensionParticipation
    ),
    secondJobEmployerContributionPct: toNumber(source.secondJobEmployerContributionPct ?? blank.secondJobEmployerContributionPct),
    secondJobEmployeeContributionPct: toNumber(source.secondJobEmployeeContributionPct ?? blank.secondJobEmployeeContributionPct),
    secondJobPensionablePayBasis: normalizePensionablePayBasis(
      source.secondJobPensionablePayBasis ?? blank.secondJobPensionablePayBasis
    ),
    statePensionAge: normalizeStatePensionAge(source.statePensionAge ?? blank.statePensionAge),
    meta: createPortfolioMeta({
      ...(source.meta || {}),
      starterMode: starterMode || source.meta?.starterMode || blank.meta.starterMode,
    }),
    employmentHistory:
      Array.isArray(source.employmentHistory) && source.employmentHistory.length
        ? source.employmentHistory.map((record) => normalizeEmploymentRecord(record))
        : blank.employmentHistory.map((record) => normalizeEmploymentRecord(record)),
  };

  Object.assign(appState, nextState);
  ensureEmploymentHistoryState();
  syncLegacyStateFromCurrentRecord();
  syncAssumptionPreset();
  if (touchSavedAt) {
    markPortfolioUpdated({ starterMode: appState.meta?.starterMode });
  }
}

function loadPersistedPortfolio() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const snapshot = JSON.parse(raw);
    applyPortfolioSnapshot(snapshot, { touchSavedAt: false });
    return true;
  } catch (error) {
    console.warn("Unable to load saved portfolio.", error);
    return false;
  }
}

function resetChatWindow() {
  if (!els.chatWindow) return;
  els.chatWindow.innerHTML = "";
  seedChat();
}

function getCurrentEmploymentRecord(state = appState) {
  const history = Array.isArray(state.employmentHistory) ? state.employmentHistory : [];
  return history.find((record) => record.status === "current") || history[0] || null;
}

function syncCurrentRecordFromTopLevel() {
  ensureEmploymentHistoryState();
  const current = getCurrentEmploymentRecord();
  if (!current) return;

  Object.assign(current, {
    status: "current",
    periodLabel: current.periodLabel || "Now",
    employerName: appState.employerName || "",
    employmentType: appState.employmentType || "employee",
    schemeName: appState.schemeName || "",
    pensionType: appState.pensionType || "Unknown",
    annualIncome: toNumber(appState.salary),
    pensionStatus: "active",
    potValue: toNumber(appState.currentPot),
    dbAnnualPensionAtSchemeAge: toNumber(appState.dbAnnualPensionAtSchemeAge),
    dbSchemePensionAge: toNumber(appState.dbSchemePensionAge),
    dbAmountBasis: normalizeDbAmountBasis(appState.dbAmountBasis),
    dbRevaluationPct: toNumber(appState.dbRevaluationPct),
    dbIndexationPct: toNumber(appState.dbIndexationPct),
    dbAdjustmentPct: toNumber(appState.dbAdjustmentPct),
    employerContributionPct: toNumber(appState.employerContributionPct),
    employeeContributionPct: toNumber(appState.employeeContributionPct),
    dcInvestmentAccess: normalizeDcInvestmentAccess(appState.dcInvestmentAccess),
    dcInvestmentStyle: normalizeDcInvestmentStyle(appState.dcInvestmentStyle),
    payslipContribution: toNumber(appState.payslipContribution),
    providerContribution: toNumber(appState.providerContribution),
    pensionablePayBasis: normalizePensionablePayBasis(appState.pensionablePayBasis),
    secondJobEnabled: Boolean(appState.secondJobEnabled),
    secondJobAnnualIncome: toNumber(appState.secondJobAnnualIncome),
    secondJobPensionParticipation: normalizeSecondJobPensionParticipation(appState.secondJobPensionParticipation),
    secondJobEmployerContributionPct: toNumber(appState.secondJobEmployerContributionPct),
    secondJobEmployeeContributionPct: toNumber(appState.secondJobEmployeeContributionPct),
    secondJobPensionablePayBasis: normalizePensionablePayBasis(appState.secondJobPensionablePayBasis),
    statePensionAge: normalizeStatePensionAge(appState.statePensionAge),
    updatedAt: nowStamp(),
  });

  normalizeEmploymentHistory();
}

function syncLegacyStateFromCurrentRecord() {
  ensureEmploymentHistoryState();
  const current = getCurrentEmploymentRecord();
  if (!current) return;

  appState.employerName = current.employerName;
  appState.employmentType = normalizeEmploymentType(current.employmentType);
  appState.schemeName = current.schemeName;
  appState.pensionType = current.pensionType;
  appState.salary = toNumber(current.annualIncome);
  appState.currentPot = toNumber(current.potValue);
  appState.dbAnnualPensionAtSchemeAge = toNumber(current.dbAnnualPensionAtSchemeAge);
  appState.dbSchemePensionAge = toNumber(current.dbSchemePensionAge);
  appState.dbAmountBasis = normalizeDbAmountBasis(current.dbAmountBasis);
  appState.dbRevaluationPct = toNumber(current.dbRevaluationPct);
  appState.dbIndexationPct = toNumber(current.dbIndexationPct);
  appState.dbAdjustmentPct = toNumber(current.dbAdjustmentPct);
  appState.employerContributionPct = toNumber(current.employerContributionPct);
  appState.employeeContributionPct = toNumber(current.employeeContributionPct);
  appState.dcInvestmentAccess = normalizeDcInvestmentAccess(current.dcInvestmentAccess);
  appState.dcInvestmentStyle = normalizeDcInvestmentStyle(current.dcInvestmentStyle);
  appState.statePensionAge = normalizeStatePensionAge(current.statePensionAge ?? appState.statePensionAge);
  appState.payslipContribution = toNumber(current.payslipContribution);
  appState.providerContribution = toNumber(current.providerContribution);
  appState.pensionablePayBasis = normalizePensionablePayBasis(current.pensionablePayBasis);
  appState.secondJobEnabled = Boolean(current.secondJobEnabled);
  appState.secondJobAnnualIncome = toNumber(current.secondJobAnnualIncome);
  appState.secondJobPensionParticipation = normalizeSecondJobPensionParticipation(current.secondJobPensionParticipation);
  appState.secondJobEmployerContributionPct = toNumber(current.secondJobEmployerContributionPct);
  appState.secondJobEmployeeContributionPct = toNumber(current.secondJobEmployeeContributionPct);
  appState.secondJobPensionablePayBasis = normalizePensionablePayBasis(current.secondJobPensionablePayBasis);
  appState.jobOne = appState.salary;
  appState.jobTwo = appState.secondJobEnabled ? appState.secondJobAnnualIncome : 0;
}

function getEmploymentHistoryForState(state = appState) {
  const source = Array.isArray(state.employmentHistory) && state.employmentHistory.length ? state.employmentHistory : appState.employmentHistory || [];
  return source.map((record) => {
    if (record.status !== "current") return normalizeEmploymentRecord(record);
    return normalizeEmploymentRecord({
      ...record,
      employerName: state.employerName ?? record.employerName,
      employmentType: normalizeEmploymentType(state.employmentType ?? record.employmentType),
      schemeName: state.schemeName ?? record.schemeName,
      pensionType: state.pensionType ?? record.pensionType,
      annualIncome: Number.isFinite(state.salary) ? state.salary : record.annualIncome,
      potValue: Number.isFinite(state.currentPot) ? state.currentPot : record.potValue,
      dbAnnualPensionAtSchemeAge: Number.isFinite(state.dbAnnualPensionAtSchemeAge)
        ? state.dbAnnualPensionAtSchemeAge
        : record.dbAnnualPensionAtSchemeAge,
      dbSchemePensionAge: Number.isFinite(state.dbSchemePensionAge) ? state.dbSchemePensionAge : record.dbSchemePensionAge,
      dbAmountBasis: state.dbAmountBasis ?? record.dbAmountBasis,
      dbRevaluationPct: Number.isFinite(state.dbRevaluationPct) ? state.dbRevaluationPct : record.dbRevaluationPct,
      dbIndexationPct: Number.isFinite(state.dbIndexationPct) ? state.dbIndexationPct : record.dbIndexationPct,
      dbAdjustmentPct: Number.isFinite(state.dbAdjustmentPct) ? state.dbAdjustmentPct : record.dbAdjustmentPct,
      employerContributionPct: Number.isFinite(state.employerContributionPct)
        ? state.employerContributionPct
        : record.employerContributionPct,
      employeeContributionPct: Number.isFinite(state.employeeContributionPct)
        ? state.employeeContributionPct
        : record.employeeContributionPct,
      dcInvestmentAccess: state.dcInvestmentAccess ?? record.dcInvestmentAccess,
      dcInvestmentStyle: state.dcInvestmentStyle ?? record.dcInvestmentStyle,
      payslipContribution: Number.isFinite(state.payslipContribution)
        ? state.payslipContribution
        : record.payslipContribution,
      providerContribution: Number.isFinite(state.providerContribution)
        ? state.providerContribution
        : record.providerContribution,
      pensionablePayBasis: state.pensionablePayBasis ?? record.pensionablePayBasis,
      secondJobEnabled: state.secondJobEnabled ?? record.secondJobEnabled,
      secondJobAnnualIncome: Number.isFinite(state.secondJobAnnualIncome) ? state.secondJobAnnualIncome : record.secondJobAnnualIncome,
      secondJobPensionParticipation: state.secondJobPensionParticipation ?? record.secondJobPensionParticipation,
      secondJobEmployerContributionPct: Number.isFinite(state.secondJobEmployerContributionPct)
        ? state.secondJobEmployerContributionPct
        : record.secondJobEmployerContributionPct,
      secondJobEmployeeContributionPct: Number.isFinite(state.secondJobEmployeeContributionPct)
        ? state.secondJobEmployeeContributionPct
        : record.secondJobEmployeeContributionPct,
      secondJobPensionablePayBasis: state.secondJobPensionablePayBasis ?? record.secondJobPensionablePayBasis,
    });
  });
}

function isMeaningfulEmploymentRecord(record) {
  return Boolean(
    record.employerName ||
      record.schemeName ||
      toNumber(record.potValue) > 0 ||
      toNumber(record.dbAnnualPensionAtSchemeAge) > 0 ||
      toNumber(record.annualIncome) > 0
  );
}

function getArrangementInputHelper(type, isCurrentRecord = false) {
  const helpers = {
    DC: "",
    DB: "Capture the statement-based DB pension and scheme age. Contribution fields stay visible for employment guidance only.",
    Hybrid: "Hybrid record: enter the DC balance and DB statement amount.",
    "State-only":
      "This record is State Pension only. No private-pension balance or DB statement amount is used for the retirement projection. State Pension depends on the National Insurance record and has to be claimed.",
    Unknown: "Confirm whether this is DC, DB, hybrid or State Pension only. The app will not guess while the arrangement stays Unknown.",
  };
  if (isCurrentRecord && type === "Hybrid") {
    return "Current hybrid record: DC balance plus DB statement amount.";
  }
  return Object.prototype.hasOwnProperty.call(helpers, type) ? helpers[type] : helpers.Unknown;
}

function renderRowsMarkup(rows) {
  return rows
    .map(
      ([label, value]) => `
        <div class="summary-row">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `
    )
    .join("");
}

function getTailoredPathwayTagsMarkup(summary) {
  return summary.groups
    .map((group) => `<span class="tag ${summary.active ? "amber" : "green"}">${escapeHtml(getPathwayGroupLabel(group))}</span>`)
    .join("");
}

function formatStatutoryOpportunityValue(job) {
  return `QE ${formatMoney(job.qualifyingEarningsBase)} / employer ${formatMoney(job.statutoryEmployerAnnual)} / total ${formatMoney(job.statutoryTotalAnnual)}`;
}

function getTailoredPathwayRows(summary, variant = "dashboard") {
  const rows = [
    ["Pathway status", `${summary.statusLabel} - ${summary.priorityLabel}`],
    ["Why this matters", summary.reason],
    [`${summary.jobOne.label} legal route`, summary.jobOne.route.label],
    [`${summary.jobOne.label} statutory minimum / year`, formatStatutoryOpportunityValue(summary.jobOne)],
  ];

  if (variant === "record") {
    rows.splice(3, 0, [`${summary.jobOne.label} qualifying earnings / year`, formatMoney(summary.jobOne.qualifyingEarningsBase)]);
  }

  if (summary.jobTwo) {
    rows.push([`${summary.jobTwo.label} legal route`, summary.jobTwo.route.label]);
    if (variant === "record") {
      rows.push([`${summary.jobTwo.label} qualifying earnings / year`, formatMoney(summary.jobTwo.qualifyingEarningsBase)]);
    }
    rows.push([`${summary.jobTwo.label} statutory minimum / year`, formatStatutoryOpportunityValue(summary.jobTwo)]);
    rows.push(["Combined earnings (context only)", formatMoney(summary.combinedIncome)]);
    rows.push([
      "Combined statutory minimum / year",
      `Employer ${formatMoney(summary.combinedStatutoryEmployerAnnual)} / total ${formatMoney(summary.combinedStatutoryTotalAnnual)}`,
    ]);
  }

  if (summary.missedEmployerAnnual > 0) {
    rows.push(["Possible missed employer contribution / year", formatMoney(summary.missedEmployerAnnual)]);
  }

  if (variant === "goal" && summary.jobTwo) {
    rows.push(["Projection boundary", summary.note]);
  } else {
    rows.push(["Pathway note", summary.note]);
  }

  rows.push(["Next action", summary.nextAction]);
  return rows;
}

function getTailoredPathwayPanelMarkup(summary, variant = "dashboard") {
  return `
    <div class="pathway-badge-row">
      ${getTailoredPathwayTagsMarkup(summary)}
    </div>
    <div class="summary-list pathway-summary-list">
      ${renderRowsMarkup(getTailoredPathwayRows(summary, variant))}
    </div>
  `;
}

function getRecordCompleteness(record) {
  const missing = [];

  if (record.pensionType === "Unknown") {
    missing.push("Confirm arrangement type");
  } else if (record.pensionType === "State-only") {
    return {
      complete: true,
      missing,
      label: "Complete",
    };
  } else {
    if (!record.periodLabel) missing.push("Add period");
    if (!record.employerName) missing.push("Add employer");
    if (!record.schemeName) missing.push("Add scheme or provider");
  }

  if (record.pensionType === "DB" || record.pensionType === "Hybrid") {
    if (toNumber(record.dbAnnualPensionAtSchemeAge) <= 0) missing.push("Add annual DB pension");
    if (toNumber(record.dbSchemePensionAge) <= 0) missing.push("Add DB scheme age");
  }
  if ((record.pensionType === "DC" || record.pensionType === "Hybrid") && toNumber(record.potValue) <= 0) {
    missing.push(record.pensionType === "Hybrid" ? "Add DC balance" : "Add latest balance");
  }

  if (record.status === "current" && (record.pensionType === "DC" || record.pensionType === "Hybrid")) {
    const hasContributionData =
      toNumber(record.employerContributionPct) > 0 ||
      toNumber(record.employeeContributionPct) > 0 ||
      toNumber(record.payslipContribution) > 0 ||
      toNumber(record.providerContribution) > 0;
    if (!hasContributionData) missing.push("Add contribution data");
  } else if (record.status !== "current" && record.pensionType !== "Unknown" && (!record.pensionStatus || record.pensionStatus === "unknown")) {
    missing.push("Mark as deferred or active");
  }

  return {
    complete: missing.length === 0,
    missing,
    label: missing.length === 0 ? "Complete" : `${missing.length} gap${missing.length === 1 ? "" : "s"} to fill`,
  };
}

function humanRecordStatus(status) {
  return status === "current" ? "Current" : "Previous";
}

function formatPensionStatus(status) {
  if (!status) return "Unknown";
  return status[0].toUpperCase() + status.slice(1);
}

function renderEmploymentRecordCard(record, index) {
  const title = record.employerName || (record.status === "current" ? "Current employment" : "Previous employment");
  const showCurrentFields = record.status === "current";
  const completeness = getRecordCompleteness(record);
  const showPotField = record.pensionType === "DC" || record.pensionType === "Hybrid";
  const showDbFields = record.pensionType === "DB" || record.pensionType === "Hybrid";
  const showInvestmentFields = supportsDcInvestmentSettings(record.pensionType);
  const showContributionFields = showCurrentFields && record.pensionType !== "State-only" && record.pensionType !== "Unknown";
  const arrangementHelper = getArrangementInputHelper(record.pensionType, showCurrentFields);
  const arrangementHelperMarkup = arrangementHelper
    ? `<p class="panel-copy record-inline-note">${escapeHtml(arrangementHelper)}</p>`
    : "";
  const secondJobActive =
    showCurrentFields && record.employmentType !== "self" && record.pensionType !== "State-only" && (record.employmentType === "multiple" || record.secondJobEnabled);
  const pathwaySummary = showCurrentFields ? getTailoredPathwaySummary(calculateProjection()) : null;
  const updatedNote = record.updatedAt ? `Updated ${formatRelativeTime(record.updatedAt)}` : "Updated just now";
  const completenessMarkup = completeness.complete
    ? ""
    : `<div class="record-health-list">${completeness.missing
        .map((item) => `<span class="record-health-pill">${escapeHtml(item)}</span>`)
        .join("")}</div>`;
  return `
    <article class="record-card">
      <div class="record-card-head">
        <div class="record-card-title">
          <p class="eyebrow">${escapeHtml(humanRecordStatus(record.status))} record</p>
          <h5>${escapeHtml(title)}</h5>
        </div>
        <div class="record-card-actions">
          <button class="ghost-button record-remove" type="button" data-record-remove="${escapeHtml(record.id)}">Remove</button>
        </div>
      </div>
      <div class="record-card-meta">
        <div class="record-card-meta-head">
          <span class="record-health-badge ${completeness.complete ? "complete" : "warning"}">${escapeHtml(completeness.label)}</span>
          <p class="record-updated-note">${escapeHtml(updatedNote)}</p>
        </div>
        ${completenessMarkup}
      </div>
      <div class="record-card-grid">
        <label>
          Record status
          <select data-record-id="${escapeHtml(record.id)}" data-record-field="status">
            <option value="current" ${record.status === "current" ? "selected" : ""}>Current</option>
            <option value="previous" ${record.status !== "current" ? "selected" : ""}>Previous</option>
          </select>
        </label>
        <label>
          Period label
          <input type="text" data-record-id="${escapeHtml(record.id)}" data-record-field="periodLabel" value="${escapeHtml(record.periodLabel)}" placeholder="Now or 2019-2022">
        </label>
        <label>
          Employer
          <input type="text" data-record-id="${escapeHtml(record.id)}" data-record-field="employerName" value="${escapeHtml(record.employerName)}" placeholder="Employer name">
        </label>
        <label>
          Employment type
          <select data-record-id="${escapeHtml(record.id)}" data-record-field="employmentType">
            <option value="employee" ${record.employmentType === "employee" ? "selected" : ""}>Employee</option>
            <option value="multiple" ${record.employmentType === "multiple" ? "selected" : ""}>Multiple jobs</option>
            <option value="part-time" ${record.employmentType === "part-time" ? "selected" : ""}>Part-time</option>
            <option value="self" ${record.employmentType === "self" ? "selected" : ""}>Self-employed</option>
          </select>
        </label>
        <label>
          Scheme / provider
          <input type="text" data-record-id="${escapeHtml(record.id)}" data-record-field="schemeName" value="${escapeHtml(record.schemeName)}" placeholder="Scheme or provider">
        </label>
        <label>
          Arrangement
          <select data-record-id="${escapeHtml(record.id)}" data-record-field="pensionType">
            <option value="DC" ${record.pensionType === "DC" ? "selected" : ""}>DC</option>
            <option value="DB" ${record.pensionType === "DB" ? "selected" : ""}>DB</option>
            <option value="Hybrid" ${record.pensionType === "Hybrid" ? "selected" : ""}>Hybrid</option>
            <option value="State-only" ${record.pensionType === "State-only" ? "selected" : ""}>State Pension only</option>
            <option value="Unknown" ${record.pensionType === "Unknown" ? "selected" : ""}>Unknown</option>
          </select>
        </label>
        ${arrangementHelperMarkup}
        <label>
          Annual income
          <input type="number" min="0" step="500" data-record-id="${escapeHtml(record.id)}" data-record-field="annualIncome" value="${escapeHtml(record.annualIncome)}">
        </label>
        <label>
          Pension status
          <select data-record-id="${escapeHtml(record.id)}" data-record-field="pensionStatus">
            <option value="active" ${record.pensionStatus === "active" ? "selected" : ""}>Active</option>
            <option value="deferred" ${record.pensionStatus === "deferred" ? "selected" : ""}>Deferred</option>
            <option value="unknown" ${record.pensionStatus === "unknown" ? "selected" : ""}>Unknown</option>
          </select>
        </label>
        ${
          showCurrentFields && record.employmentType !== "self" && record.pensionType !== "State-only"
            ? `
              <label class="record-checkbox-field">
                <span>Track second current job</span>
                <input
                  type="checkbox"
                  data-record-id="${escapeHtml(record.id)}"
                  data-record-field="secondJobEnabled"
                  ${record.secondJobEnabled ? "checked" : ""}
                >
              </label>
            `
            : ""
        }
        ${
          showPotField
            ? `
              <label>
                ${record.pensionType === "Hybrid" ? "Current DC balance" : "Known balance"}
                <input
	                  type="number"
	                  min="0"
	                  step="1"
	                  data-record-id="${escapeHtml(record.id)}"
	                  data-record-field="potValue"
	                  value="${escapeHtml(record.potValue)}"
                >
              </label>
            `
            : ""
        }
        ${
          showInvestmentFields
            ? `
              <label>
                DC investment access
                <select data-record-id="${escapeHtml(record.id)}" data-record-field="dcInvestmentAccess">
                  <option value="default" ${record.dcInvestmentAccess === "default" ? "selected" : ""}>Default</option>
                  <option value="workplace-self-select" ${record.dcInvestmentAccess === "workplace-self-select" ? "selected" : ""}>Workplace self-select</option>
                  <option value="sipp" ${record.dcInvestmentAccess === "sipp" ? "selected" : ""}>SIPP</option>
                </select>
              </label>
              <label>
                DC investment style
                <select data-record-id="${escapeHtml(record.id)}" data-record-field="dcInvestmentStyle">
                  <option value="aggressive" ${record.dcInvestmentStyle === "aggressive" ? "selected" : ""}>Aggressive</option>
                  <option value="balanced" ${record.dcInvestmentStyle === "balanced" ? "selected" : ""}>Balanced</option>
	                  <option value="conservative" ${record.dcInvestmentStyle === "conservative" ? "selected" : ""}>Conservative</option>
	                </select>
	              </label>
            `
            : ""
        }
        ${
          showDbFields
            ? `
              <label>
                Annual DB pension at scheme age
                <input
                  type="number"
                  min="0"
                  step="100"
                  data-record-id="${escapeHtml(record.id)}"
                  data-record-field="dbAnnualPensionAtSchemeAge"
                  value="${escapeHtml(record.dbAnnualPensionAtSchemeAge)}"
                >
              </label>
            `
            : ""
        }
        ${
          showDbFields
            ? `
              <label>
                DB scheme pension age
                <input type="number" min="55" max="75" step="1" data-record-id="${escapeHtml(record.id)}" data-record-field="dbSchemePensionAge" value="${escapeHtml(
                  record.dbSchemePensionAge
                )}">
              </label>
              <label>
                DB amount basis
                <select data-record-id="${escapeHtml(record.id)}" data-record-field="dbAmountBasis">
                  <option value="at-scheme-age" ${record.dbAmountBasis === "at-scheme-age" ? "selected" : ""}>Statement amount at scheme age</option>
                  <option value="current-deferred" ${record.dbAmountBasis === "current-deferred" ? "selected" : ""}>Current deferred amount</option>
                </select>
              </label>
              <label>
                DB revaluation %
                <input type="number" min="0" max="10" step="0.1" data-record-id="${escapeHtml(record.id)}" data-record-field="dbRevaluationPct" value="${escapeHtml(record.dbRevaluationPct)}">
              </label>
              <label>
                DB indexation %
                <input type="number" min="0" max="10" step="0.1" data-record-id="${escapeHtml(record.id)}" data-record-field="dbIndexationPct" value="${escapeHtml(record.dbIndexationPct)}">
              </label>
              <label>
                DB early/late factor %
                <input type="number" min="-15" max="15" step="0.1" data-record-id="${escapeHtml(record.id)}" data-record-field="dbAdjustmentPct" value="${escapeHtml(record.dbAdjustmentPct)}">
              </label>
            `
            : ""
        }
      </div>
      ${
        showContributionFields
          ? `
            <div class="record-card-current-grid">
              <p class="panel-copy record-card-current-copy">${escapeHtml(arrangementHelper)}</p>
              <label>
                Employer contribution %
                <input type="number" min="0" max="40" step="0.1" data-record-id="${escapeHtml(record.id)}" data-record-field="employerContributionPct" value="${escapeHtml(record.employerContributionPct)}">
              </label>
              <label>
                Your contribution %
                <input type="number" min="0" max="40" step="0.1" data-record-id="${escapeHtml(record.id)}" data-record-field="employeeContributionPct" value="${escapeHtml(record.employeeContributionPct)}">
              </label>
              <label>
                Pensionable pay basis
                <select data-record-id="${escapeHtml(record.id)}" data-record-field="pensionablePayBasis">
                  <option value="qualifying earnings" ${record.pensionablePayBasis === "qualifying earnings" ? "selected" : ""}>Qualifying earnings</option>
                  <option value="basic salary" ${record.pensionablePayBasis === "basic salary" ? "selected" : ""}>Basic salary</option>
                  <option value="total earnings" ${record.pensionablePayBasis === "total earnings" ? "selected" : ""}>Total earnings</option>
                  <option value="unknown" ${record.pensionablePayBasis === "unknown" ? "selected" : ""}>Unknown</option>
                </select>
              </label>
              <label>
                Payslip deduction / month
                <input type="number" min="0" step="1" data-record-id="${escapeHtml(record.id)}" data-record-field="payslipContribution" value="${escapeHtml(record.payslipContribution)}">
              </label>
              <label>
                Provider shown / month
                <input type="number" min="0" step="1" data-record-id="${escapeHtml(record.id)}" data-record-field="providerContribution" value="${escapeHtml(record.providerContribution)}">
              </label>
            </div>
          `
          : ""
      }
      ${
        secondJobActive
          ? `
            <div class="record-card-current-grid record-second-job-grid">
              <p class="panel-copy record-card-current-copy">Second current job: assessed separately for workplace-pension rights. It does not change the main retirement projection in this version.</p>
              <label>
                Job 2 annual income
                <input type="number" min="0" step="100" data-record-id="${escapeHtml(record.id)}" data-record-field="secondJobAnnualIncome" value="${escapeHtml(
                  record.secondJobAnnualIncome
                )}">
              </label>
              <label>
                Job 2 pension participation
                <select data-record-id="${escapeHtml(record.id)}" data-record-field="secondJobPensionParticipation">
                  <option value="active" ${record.secondJobPensionParticipation === "active" ? "selected" : ""}>Active</option>
                  <option value="opted-out" ${record.secondJobPensionParticipation === "opted-out" ? "selected" : ""}>Opted out</option>
                  <option value="not-joined" ${record.secondJobPensionParticipation === "not-joined" ? "selected" : ""}>Not joined</option>
                  <option value="unknown" ${record.secondJobPensionParticipation === "unknown" ? "selected" : ""}>Unknown</option>
                </select>
              </label>
              <label>
                Job 2 employer contribution %
                <input type="number" min="0" max="40" step="0.1" data-record-id="${escapeHtml(record.id)}" data-record-field="secondJobEmployerContributionPct" value="${escapeHtml(
                  record.secondJobEmployerContributionPct
                )}">
              </label>
              <label>
                Job 2 your contribution %
                <input type="number" min="0" max="40" step="0.1" data-record-id="${escapeHtml(record.id)}" data-record-field="secondJobEmployeeContributionPct" value="${escapeHtml(
                  record.secondJobEmployeeContributionPct
                )}">
              </label>
              <label>
                Job 2 pensionable pay basis
                <select data-record-id="${escapeHtml(record.id)}" data-record-field="secondJobPensionablePayBasis">
                  <option value="qualifying earnings" ${record.secondJobPensionablePayBasis === "qualifying earnings" ? "selected" : ""}>Qualifying earnings</option>
                  <option value="basic salary" ${record.secondJobPensionablePayBasis === "basic salary" ? "selected" : ""}>Basic salary</option>
                  <option value="total earnings" ${record.secondJobPensionablePayBasis === "total earnings" ? "selected" : ""}>Total earnings</option>
                  <option value="unknown" ${record.secondJobPensionablePayBasis === "unknown" ? "selected" : ""}>Unknown</option>
                </select>
              </label>
            </div>
          `
          : ""
      }
      ${
        pathwaySummary
          ? `
            <div class="record-pathway-panel">
              <div class="record-pathway-head">
                <div>
                  <p class="eyebrow">Tailored pathway</p>
                  <h5>${escapeHtml(pathwaySummary.statusLabel)}</h5>
                </div>
              </div>
              ${getTailoredPathwayPanelMarkup(pathwaySummary, "record")}
            </div>
          `
          : ""
      }
    </article>
  `;
}

function renderEmploymentHistoryEditor() {
  if (!els.employmentHistoryList) return;
  els.employmentHistoryList.innerHTML = appState.employmentHistory.map(renderEmploymentRecordCard).join("");
}

function castEmploymentRecordValue(field, value) {
  const numericFields = [
    "annualIncome",
    "potValue",
    "dbAnnualPensionAtSchemeAge",
    "dbSchemePensionAge",
    "dbRevaluationPct",
    "dbIndexationPct",
    "dbAdjustmentPct",
    "employerContributionPct",
    "employeeContributionPct",
    "payslipContribution",
    "providerContribution",
    "secondJobAnnualIncome",
    "secondJobEmployerContributionPct",
    "secondJobEmployeeContributionPct",
  ];

  return numericFields.includes(field) ? toNumber(value) : value;
}

function updateEmploymentRecord(id, field, rawValue) {
  const value = castEmploymentRecordValue(field, rawValue);
  const updatedAt = nowStamp();
  appState.employmentHistory = appState.employmentHistory.map((record) => {
    if (record.id !== id) return record;
    return {
      ...record,
      [field]: value,
      updatedAt,
    };
  });

  if (field === "status" && value === "current") {
    appState.employmentHistory = appState.employmentHistory.map((record) => ({
      ...record,
      status: record.id === id ? "current" : "previous",
      pensionStatus: record.id === id ? "active" : record.pensionStatus,
      updatedAt,
    }));
  }

  normalizeEmploymentHistory();
  syncLegacyStateFromCurrentRecord();
  markPortfolioUpdated();
  render();
}

function addEmploymentRecord(status) {
  ensureEmploymentHistoryState();
  const nextRecord = createEmploymentRecord({
    status,
    periodLabel: status === "current" ? "Now" : "Previous role",
    employmentType: status === "current" ? appState.employmentType : "employee",
    pensionType: status === "current" ? appState.pensionType : "Unknown",
    pensionStatus: status === "current" ? "active" : "deferred",
  });

  if (status === "current") {
    appState.employmentHistory = appState.employmentHistory.map((record) => ({
      ...record,
      status: "previous",
      updatedAt: nowStamp(),
    }));
    appState.employmentHistory.unshift(nextRecord);
  } else {
    appState.employmentHistory.push(nextRecord);
  }

  normalizeEmploymentHistory();
  syncLegacyStateFromCurrentRecord();
  markPortfolioUpdated();
  render();
}

function removeEmploymentRecord(id) {
  appState.employmentHistory = appState.employmentHistory.filter((record) => record.id !== id);
  normalizeEmploymentHistory();
  syncLegacyStateFromCurrentRecord();
  markPortfolioUpdated();
  render();
}

function handleEmploymentHistoryInput(event) {
  const field = event.target?.dataset?.recordField;
  const id = event.target?.dataset?.recordId;
  if (!field || !id) return;
  const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
  updateEmploymentRecord(id, field, value);
}

function handleEmploymentHistoryFocusOut(event) {
  const field = event.target?.dataset?.recordField;
  const id = event.target?.dataset?.recordId;
  if (!field || !id) return;
  if (event.target.type === "checkbox") return;
  updateEmploymentRecord(id, field, event.target.value);
}

function handleEmploymentHistoryClick(event) {
  const removeButton = event.target.closest("[data-record-remove]");
  if (!removeButton) return;
  removeEmploymentRecord(removeButton.dataset.recordRemove);
}

function cacheElements() {
  [
    "onboardingOverlay",
    "onboardingEyebrow",
    "onboardingTitle",
    "onboardingCopy",
    "resumeOption",
    "resumeOptionEyebrow",
    "resumeOptionTitle",
    "resumeOptionCopy",
    "resumePortfolioButton",
    "exampleOptionEyebrow",
    "exampleOptionTitle",
    "exampleOptionCopy",
    "useExampleButton",
    "dbOptionEyebrow",
    "dbOptionTitle",
    "dbOptionCopy",
    "useDbExampleButton",
    "stateOptionEyebrow",
    "stateOptionTitle",
    "stateOptionCopy",
    "useStateExampleButton",
    "mixedOptionEyebrow",
    "mixedOptionTitle",
    "mixedOptionCopy",
    "useMixedExampleButton",
    "useLowEarnerExampleButton",
    "usePartTimeExampleButton",
    "useMultipleJobsExampleButton",
    "useSelfEmployedExampleButton",
    "blankOptionEyebrow",
    "blankOptionTitle",
    "blankOptionCopy",
    "startBlankButton",
    "onboardingNote",
    "viewTitle",
    "portfolioStatusPill",
    "installAppButton",
    "contextActionButton",
    "projectedIncome",
    "incomeStatus",
    "emergencyValue",
    "emergencyStatus",
    "monthlyTargetValue",
    "yearlyTargetValue",
    "connectedCount",
    "connectedStatus",
    "positionList",
    "schemeList",
    "contributionList",
    "pathwayPanel",
    "pathwayList",
    "potList",
    "shortTermSavingsSummary",
    "exportJsonButton",
    "importJsonButton",
    "importJsonInput",
    "employmentHistoryList",
    "addCurrentRecordButton",
    "addPreviousRecordButton",
    "goalSectionCopy",
    "goalStepOneTitle",
    "goalStepOneCopy",
    "goalInputHeading",
    "goalCompareHeading",
    "goalStepTwoTitle",
    "goalStepTwoCopy",
    "scenarioPanelSummary",
    "selfSelectPanel",
    "selfSelectHintPanel",
    "selfSelectHintCopy",
    "selfSelectHintList",
    "selfSelectPanelSummary",
    "selfSelectIntroCopy",
    "selfSelectSummaryList",
    "selfSelectAllocationList",
    "selfSelectExamplesSummary",
    "selfSelectExampleCopy",
    "selfSelectExampleList",
    "selfSelectDisclaimer",
    "investmentAccessInput",
    "investmentStyleInput",
    "goalStepThreeTitle",
    "goalStepThreeCopy",
    "goalDetailGrid",
    "goalStatusPanel",
    "goalStatusEyebrow",
    "goalStatusHeading",
    "goalPathwayPanel",
    "goalPathwayList",
    "ageInput",
    "targetMonthlyInput",
    "retireAgeInput",
    "currentPotInput",
    "currentPotField",
	    "dbAnnualPensionField",
	    "dbAnnualPensionInput",
	    "dbSchemePensionAgeField",
	    "dbSchemePensionAgeInput",
	    "dbAmountBasisField",
	    "dbAmountBasisInput",
	    "dbRevaluationField",
	    "dbRevaluationInput",
	    "dbIndexationField",
	    "dbIndexationInput",
	    "dbAdjustmentField",
	    "dbAdjustmentInput",
	    "statePensionField",
	    "statePensionAgeField",
	      "goalInputModeCopy",
	      "statePensionInput",
	      "statePensionAgeInput",
      "assumptionPanel",
    "assumptionPanelEyebrow",
    "moneyModeInput",
    "inflationInput",
    "annualChargeInput",
    "salaryGrowthInput",
    "contributionEscalationInput",
    "taxReliefModeInput",
    "marginalTaxInput",
    "employeeNiInput",
    "assumptionDetailList",
    "dataConfidenceList",
    "assumptionPathCopy",
    "assumptionPresetList",
    "assumptionPathList",
    "goalTrackerList",
    "emergencyTargetInput",
    "monthlyBudgetInput",
    "cashShareInput",
    "incomePatternInput",
    "pauseMonthsInput",
    "cashPlannerList",
    "housingStatusInput",
    "housingCostInput",
    "debtPressureInput",
    "dependantsInput",
    "survivorNeedInput",
    "adequacyFactorList",
    "householdEnabledInput",
    "partnerNameInput",
    "partnerAgeInput",
    "partnerRetireAgeInput",
    "partnerPensionTypeInput",
    "partnerCurrentPotInput",
    "partnerMonthlyContributionInput",
    "partnerStatePensionInput",
    "householdGoalInput",
    "householdIntroCopy",
    "householdPlanningDetails",
    "householdGoalList",
    "householdScenarioTypeInput",
    "householdScenarioValueInput",
    "householdScenarioLabel",
    "householdScenarioList",
    "projectionBadge",
    "projectionChart",
    "projectionInteraction",
    "projectionTitle",
    "projectionBlockedState",
    "projectionBlockedCopy",
    "projectionScrubber",
    "scenarioInputGrid",
    "scenarioTypeInput",
    "scenarioPrimaryInput",
    "scenarioPrimaryLabel",
    "scenarioSummaryList",
    "scenarioPanel",
    "scenarioIntroCopy",
    "scenarioBlockedState",
    "scenarioBlockedCopy",
    "projectionAgeInput",
    "projectionStatusRow",
    "projectionFocusCopy",
    "projectionLegend",
    "projectionDetailList",
    "benchmarkList",
    "connectedMetricLabel",
    "assistantTopicList",
    "assistantTopicOverflowList",
    "assistantTopicMore",
    "assistantTopicBadge",
    "assistantTopicCopy",
    "assistantStarterQuestions",
    "chatWindow",
    "chatForm",
    "chatInput",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindInputs() {
  [
    ["ageInput", "age"],
    ["targetMonthlyInput", "targetMonthlyIncome"],
    ["retireAgeInput", "retireAge"],
    ["currentPotInput", "currentPot"],
	    ["dbAnnualPensionInput", "dbAnnualPensionAtSchemeAge"],
	    ["dbSchemePensionAgeInput", "dbSchemePensionAge"],
	    ["dbRevaluationInput", "dbRevaluationPct"],
	    ["dbIndexationInput", "dbIndexationPct"],
	    ["dbAdjustmentInput", "dbAdjustmentPct"],
	    ["statePensionInput", "statePension"],
	    ["statePensionAgeInput", "statePensionAge"],
	  ].forEach(([id, key]) => {
    const element = els[id];
    if (!element) return;
    element.addEventListener("input", (event) => {
      appState[key] = key === "statePensionAge" ? normalizeStatePensionAge(event.target.value) : toNumber(event.target.value);
	      if (["currentPot", "dbAnnualPensionAtSchemeAge", "dbSchemePensionAge", "dbRevaluationPct", "dbIndexationPct", "dbAdjustmentPct"].includes(key)) {
	        syncCurrentRecordFromTopLevel();
	      }
	      markPortfolioUpdated();
	      render();
	    });
	  });

  if (els.dbAmountBasisInput) {
    els.dbAmountBasisInput.addEventListener("input", (event) => {
      appState.dbAmountBasis = normalizeDbAmountBasis(event.target.value);
      syncCurrentRecordFromTopLevel();
      markPortfolioUpdated();
      render();
    });
  }

  [
    ["moneyModeInput", "moneyMode", normalizeMoneyMode],
    ["inflationInput", "inflationPct", toNumber],
    ["annualChargeInput", "annualChargePct", toNumber],
    ["salaryGrowthInput", "salaryGrowthPct", toNumber],
    ["contributionEscalationInput", "contributionEscalationPct", toNumber],
    ["taxReliefModeInput", "taxReliefMode", normalizeTaxReliefMode],
    ["marginalTaxInput", "marginalTaxPct", toNumber],
    ["employeeNiInput", "employeeNiPct", toNumber],
  ].forEach(([id, key, cast]) => {
    const element = els[id];
    if (!element) return;
    element.addEventListener("input", (event) => {
      appState[key] = cast(event.target.value);
      markPortfolioUpdated();
      render();
    });
  });

  [
    ["emergencyTargetInput", "emergencyTarget"],
    ["monthlyBudgetInput", "monthlyBudget"],
    ["cashShareInput", "cashSharePct"],
    ["pauseMonthsInput", "pauseMonths"],
  ].forEach(([id, key]) => {
    const element = els[id];
    if (!element) return;
    element.addEventListener("input", (event) => {
      appState.shortTermSavings[key] = toNumber(event.target.value);
      markPortfolioUpdated();
      render();
    });
  });

  if (els.incomePatternInput) {
    els.incomePatternInput.addEventListener("input", (event) => {
      appState.shortTermSavings.incomePattern = event.target.value;
      markPortfolioUpdated();
      render();
    });
  }

  [
    ["housingStatusInput", "housingStatus", normalizeHousingStatus],
    ["housingCostInput", "monthlyHousingCost", toNumber],
    ["debtPressureInput", "debtPressure", normalizeDebtPressure],
    ["dependantsInput", "dependants", toNumber],
    ["survivorNeedInput", "survivorNeed", normalizeSurvivorNeed],
  ].forEach(([id, key, cast]) => {
    const element = els[id];
    if (!element) return;
    element.addEventListener("input", (event) => {
      appState.lifeFactors = { ...createDefaultLifeFactors(), ...(appState.lifeFactors || {}) };
      appState.lifeFactors[key] = cast(event.target.value);
      markPortfolioUpdated();
      render();
    });
  });

  if (els.investmentAccessInput) {
    els.investmentAccessInput.addEventListener("input", (event) => {
      appState.dcInvestmentAccess = normalizeDcInvestmentAccess(event.target.value);
      syncCurrentRecordFromTopLevel();
      markPortfolioUpdated();
      render();
    });
  }

  if (els.investmentStyleInput) {
    els.investmentStyleInput.addEventListener("input", (event) => {
      appState.dcInvestmentStyle = normalizeDcInvestmentStyle(event.target.value);
      syncCurrentRecordFromTopLevel();
      markPortfolioUpdated();
      render();
    });
  }

  if (els.householdEnabledInput) {
    els.householdEnabledInput.addEventListener("change", (event) => {
      appState.partnerProfile.enabled = event.target.checked;
      markPortfolioUpdated();
      render();
    });
  }

  [
    ["partnerNameInput", "name", String],
    ["partnerAgeInput", "age", Number],
    ["partnerRetireAgeInput", "retireAge", Number],
    ["partnerPensionTypeInput", "pensionType", String],
    ["partnerCurrentPotInput", "currentPot", Number],
    ["partnerMonthlyContributionInput", "monthlyContribution", Number],
    ["partnerStatePensionInput", "statePension", Number],
  ].forEach(([id, key, cast]) => {
    const element = els[id];
    if (!element) return;
    element.addEventListener("input", (event) => {
      appState.partnerProfile[key] = cast === Number ? toNumber(event.target.value) : cast(event.target.value);
      markPortfolioUpdated();
      render();
    });
  });

  if (els.householdGoalInput) {
    els.householdGoalInput.addEventListener("input", (event) => {
      appState.householdGoal.jointMonthlyIncome = toNumber(event.target.value);
      markPortfolioUpdated();
      render();
    });
  }

  if (els.householdScenarioTypeInput) {
    els.householdScenarioTypeInput.addEventListener("input", (event) => {
      appState.householdGoal.scenarioType = event.target.value;
      markPortfolioUpdated();
      render();
    });
  }

  if (els.householdScenarioValueInput) {
    els.householdScenarioValueInput.addEventListener("input", (event) => {
      appState.householdGoal.scenarioValue = toNumber(event.target.value);
      markPortfolioUpdated();
      render();
    });
  }

  if (els.scenarioTypeInput) {
    els.scenarioTypeInput.addEventListener("input", (event) => {
      ensureScenarioState();
      appState.scenarioModel.type = event.target.value;
      markPortfolioUpdated();
      render();
    });
  }

  if (els.scenarioPrimaryInput) {
    els.scenarioPrimaryInput.addEventListener("input", (event) => {
      ensureScenarioState();
      const nextValue = toNumber(event.target.value);
      const type = appState.scenarioModel.type;
      if (type === "retire-later") appState.scenarioModel.retireLaterYears = nextValue;
      if (type === "raise-contributions") appState.scenarioModel.extraEmployeePct = nextValue;
      if (type === "pause-saving") appState.scenarioModel.pauseMonths = nextValue;
      if (type === "lower-earnings") appState.scenarioModel.lowerEarningsPct = nextValue;
      if (type === "restart-after-pause") appState.scenarioModel.extraEmployeePct = nextValue;
      if (type === "split-savings") appState.scenarioModel.splitExtraMonthly = nextValue;
      markPortfolioUpdated();
      render();
    });
  }

  document.querySelectorAll("[data-assumption-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      setAssumptionPreset(button.dataset.assumptionPreset);
    });
  });

  if (els.projectionAgeInput) {
    els.projectionAgeInput.addEventListener("input", (event) => {
      updateProjectionFocus(toNumber(event.target.value));
    });
  }

  if (els.projectionChart) {
    const updateFromClientPoint = (clientX, clientY) => {
      if (projectionCanvasMeta?.mode === "income-mix") {
        updateProjectionIncomeMixFromClientPoint(clientX, clientY);
        return;
      }
      const age = getProjectionAgeFromClientX(clientX);
      if (age == null) return;
      updateProjectionFocus(age);
    };

    els.projectionChart.addEventListener("pointermove", (event) => {
      if (event.pointerType === "mouse" || event.buttons === 1) updateFromClientPoint(event.clientX, event.clientY);
    });

    els.projectionChart.addEventListener("pointerdown", (event) => {
      updateFromClientPoint(event.clientX, event.clientY);
      els.projectionChart.focus();
    });

    els.projectionChart.addEventListener("mousedown", (event) => {
      updateFromClientPoint(event.clientX, event.clientY);
      els.projectionChart.focus();
    });

    els.projectionChart.addEventListener("mousemove", (event) => {
      if (event.buttons === 1) updateFromClientPoint(event.clientX, event.clientY);
    });

    els.projectionChart.addEventListener("click", (event) => {
      updateFromClientPoint(event.clientX, event.clientY);
      els.projectionChart.focus();
    });

    els.projectionChart.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches[0]) updateFromClientPoint(event.touches[0].clientX, event.touches[0].clientY);
      },
      { passive: true }
    );

    els.projectionChart.addEventListener(
      "touchmove",
      (event) => {
        if (event.touches[0]) updateFromClientPoint(event.touches[0].clientX, event.touches[0].clientY);
      },
      { passive: true }
    );

    els.projectionChart.addEventListener("keydown", (event) => {
      if (projectionCanvasMeta?.mode === "income-mix") {
        const keys = (projectionCanvasMeta.segments || []).map((segment) => segment.key);
        if (!keys.length) return;
        const currentIndex = Math.max(0, keys.indexOf(appState.projectionInspectorSegment || keys[0]));
        const currentAge = appState.projectionInspectorAge || appState.retireAge;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          updateProjectionFocus(currentAge - 1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          updateProjectionFocus(currentAge + 1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          updateProjectionSegmentFocus(keys[Math.max(0, currentIndex - 1)]);
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          updateProjectionSegmentFocus(keys[Math.min(keys.length - 1, currentIndex + 1)]);
        } else if (event.key === "Home") {
          event.preventDefault();
          updateProjectionFocus(projectionCanvasMeta.minAge || appState.age);
        } else if (event.key === "End") {
          event.preventDefault();
          updateProjectionFocus(projectionCanvasMeta.maxAge || appState.retireAge);
        }
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        updateProjectionFocus((appState.projectionInspectorAge || appState.age) - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        updateProjectionFocus((appState.projectionInspectorAge || appState.age) + 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        updateProjectionFocus(appState.age);
      } else if (event.key === "End") {
        event.preventDefault();
        updateProjectionFocus(appState.retireAge);
      }
    });
  }

  if (els.employmentHistoryList) {
    els.employmentHistoryList.addEventListener("change", handleEmploymentHistoryInput);
    els.employmentHistoryList.addEventListener("focusout", handleEmploymentHistoryFocusOut);
    els.employmentHistoryList.addEventListener("click", handleEmploymentHistoryClick);
  }

  if (els.addCurrentRecordButton) {
    els.addCurrentRecordButton.addEventListener("click", () => addEmploymentRecord("current"));
  }

  if (els.addPreviousRecordButton) {
    els.addPreviousRecordButton.addEventListener("click", () => addEmploymentRecord("previous"));
  }
}

function bindCoach() {
  const submitChatQuestion = ({ forceAnswer = false, skipUserMessage = false } = {}) => {
    const question = els.chatInput?.value?.trim();
    if (!question) return;
    askCoach(question, { forceAnswer, skipUserMessage });
    els.chatInput.value = "";
  };

  if (els.chatForm) {
    els.chatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      submitChatQuestion();
    });

    const sendButton = els.chatForm.querySelector('button[type="submit"], button');
    if (sendButton) {
      sendButton.addEventListener("click", (event) => {
        event.preventDefault();
        submitChatQuestion();
      });
    }
  }

  if (els.chatInput) {
    els.chatInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      submitChatQuestion();
    });
  }

  document.addEventListener("click", (event) => {
    const topicButton = event.target.closest("[data-assistant-topic]");
    if (topicButton) {
      setAssistantTopic(topicButton.dataset.assistantTopic);
      return;
    }

    const questionButton = event.target.closest("[data-question]");
    if (questionButton) {
      askCoach(questionButton.dataset.question);
    }
  });
}

function applyBlankPortfolio() {
  employmentRecordSeq = 0;
  applyPortfolioSnapshot(createBlankPortfolioState(), {
    touchSavedAt: true,
    starterMode: "blank",
  });
  resetChatWindow();
  render();
}

function applyExamplePortfolio() {
  const updatedAt = nowStamp();
  const exampleState = {
    ...createBlankPortfolioState(),
    userName: "Sample Member",
    employerName: "Example Studio Ltd",
    schemeName: "Example Workplace Pension",
    employmentType: "employee",
    mainConcern: "contribution gap",
    age: 32,
    retireAge: 68,
    salary: 36000,
    currentPot: 28450,
    pensionType: "DC",
    employerContributionPct: 5,
    employeeContributionPct: 5,
    dcInvestmentAccess: "workplace-self-select",
    dcInvestmentStyle: "balanced",
    statePension: 0,
    statePensionAge: 68,
    emergencySavings: 900,
    targetMonthlyIncome: 1800,
    pensionablePayBasis: "qualifying earnings",
    payslipContribution: 124,
    providerContribution: 248,
    jobOne: 36000,
    jobTwo: 0,
    assumptionPreset: "base",
    meta: createPortfolioMeta({
      starterMode: "example-dc",
      savedAt: updatedAt,
    }),
  };

  employmentRecordSeq = 0;
  exampleState.employmentHistory = [
    createEmploymentRecord({
      status: "current",
      periodLabel: "Now",
      employerName: "Example Studio Ltd",
      employmentType: "employee",
      schemeName: "Example Workplace Pension",
      pensionType: "DC",
      annualIncome: 36000,
      pensionStatus: "active",
      potValue: 28450,
      employerContributionPct: 5,
      employeeContributionPct: 5,
      dcInvestmentAccess: "workplace-self-select",
      dcInvestmentStyle: "balanced",
      payslipContribution: 124,
      providerContribution: 248,
      pensionablePayBasis: "qualifying earnings",
      updatedAt,
    }),
    createEmploymentRecord({
      status: "previous",
      periodLabel: "2019-2022",
      employerName: "Previous employer",
      employmentType: "employee",
      schemeName: "Deferred workplace pension",
      pensionType: "DC",
      annualIncome: 29000,
      pensionStatus: "deferred",
      potValue: 920,
      updatedAt,
    }),
    createEmploymentRecord({
      status: "previous",
      periodLabel: "2016-2018",
      employerName: "Previous part-time job",
      employmentType: "part-time",
      schemeName: "Deferred workplace pension",
      pensionType: "DC",
      annualIncome: 6500,
      pensionStatus: "deferred",
      potValue: 4850,
      updatedAt,
    }),
  ];

  applyPortfolioSnapshot(exampleState, {
    touchSavedAt: false,
    starterMode: "example-dc",
  });
  resetChatWindow();
  render();
}

function applyDbExamplePortfolio() {
  const updatedAt = nowStamp();
  const exampleState = {
    ...createBlankPortfolioState(),
    userName: "Sample DB Member",
    employerName: "Civic Engineering Group",
    schemeName: "Civic Final Salary Pension",
    employmentType: "employee",
    mainConcern: "retirement age",
    age: 45,
    retireAge: 65,
    salary: 52000,
    currentPot: 0,
    dbAnnualPensionAtSchemeAge: 18600,
    dbSchemePensionAge: 67,
    pensionType: "DB",
    employerContributionPct: 0,
    employeeContributionPct: 0,
    dcInvestmentAccess: "default",
    dcInvestmentStyle: "balanced",
    statePension: 0,
    statePensionAge: 67,
    emergencySavings: 3200,
    targetMonthlyIncome: 3000,
    pensionablePayBasis: "basic salary",
    payslipContribution: 0,
    providerContribution: 0,
    jobOne: 52000,
    jobTwo: 0,
    assumptionPreset: "base",
    meta: createPortfolioMeta({
      starterMode: "example-db",
      savedAt: updatedAt,
    }),
  };

  employmentRecordSeq = 0;
  exampleState.employmentHistory = [
    createEmploymentRecord({
      status: "current",
      periodLabel: "Now",
      employerName: "Civic Engineering Group",
      employmentType: "employee",
      schemeName: "Civic Final Salary Pension",
      pensionType: "DB",
      annualIncome: 52000,
      pensionStatus: "active",
      dcInvestmentAccess: "default",
      dcInvestmentStyle: "balanced",
      dbAnnualPensionAtSchemeAge: 18600,
      dbSchemePensionAge: 67,
      pensionablePayBasis: "basic salary",
      updatedAt,
    }),
  ];

  applyPortfolioSnapshot(exampleState, {
    touchSavedAt: false,
    starterMode: "example-db",
  });
  resetChatWindow();
  render();
}

function applyMixedExamplePortfolio() {
  const updatedAt = nowStamp();
  const exampleState = {
    ...createBlankPortfolioState(),
    userName: "Sample Mixed Member",
    employerName: "Northworks Digital Ltd",
    schemeName: "Northworks Workplace Pension",
    employmentType: "employee",
    mainConcern: "contribution gap",
    age: 40,
    retireAge: 67,
    salary: 52000,
    currentPot: 64000,
    pensionType: "DC",
    employerContributionPct: 6,
    employeeContributionPct: 6,
    dcInvestmentAccess: "workplace-self-select",
    dcInvestmentStyle: "balanced",
    statePension: 0,
    statePensionAge: 67,
    emergencySavings: 4200,
    targetMonthlyIncome: 3000,
    pensionablePayBasis: "qualifying earnings",
    payslipContribution: 220,
    providerContribution: 440,
    jobOne: 52000,
    jobTwo: 0,
    assumptionPreset: "base",
    meta: createPortfolioMeta({
      starterMode: "example-mixed",
      savedAt: updatedAt,
    }),
  };

  employmentRecordSeq = 0;
  exampleState.employmentHistory = [
    createEmploymentRecord({
      status: "current",
      periodLabel: "Now",
      employerName: "Northworks Digital Ltd",
      employmentType: "employee",
      schemeName: "Northworks Workplace Pension",
      pensionType: "DC",
      annualIncome: 52000,
      pensionStatus: "active",
      potValue: 64000,
      employerContributionPct: 6,
      employeeContributionPct: 6,
      dcInvestmentAccess: "workplace-self-select",
      dcInvestmentStyle: "balanced",
      payslipContribution: 220,
      providerContribution: 440,
      pensionablePayBasis: "qualifying earnings",
      updatedAt,
    }),
    createEmploymentRecord({
      status: "previous",
      periodLabel: "2011-2021",
      employerName: "City Infrastructure Trust",
      employmentType: "employee",
      schemeName: "Deferred final salary pension",
      pensionType: "DB",
      annualIncome: 41000,
      pensionStatus: "deferred",
      dbAnnualPensionAtSchemeAge: 7200,
      dbSchemePensionAge: 67,
      updatedAt,
    }),
  ];

  applyPortfolioSnapshot(exampleState, {
    touchSavedAt: false,
    starterMode: "example-mixed",
  });
  resetChatWindow();
  render();
}

function applyMixedStateExamplePortfolio() {
  const updatedAt = nowStamp();
  const exampleState = {
    ...createBlankPortfolioState(),
    userName: "Sample Mixed State Member",
    employerName: "Northworks Digital Ltd",
    schemeName: "Northworks Workplace Pension",
    employmentType: "employee",
    mainConcern: "retirement income",
    age: 40,
    retireAge: 68,
    salary: 52000,
    currentPot: 64000,
    pensionType: "DC",
    employerContributionPct: 6,
    employeeContributionPct: 6,
    dcInvestmentAccess: "workplace-self-select",
    dcInvestmentStyle: "balanced",
    statePension: FULL_NEW_STATE_PENSION_2026_27,
    statePensionAge: 68,
    emergencySavings: 4200,
    targetMonthlyIncome: 3600,
    pensionablePayBasis: "qualifying earnings",
    payslipContribution: 220,
    providerContribution: 440,
    jobOne: 52000,
    jobTwo: 0,
    assumptionPreset: "base",
    meta: createPortfolioMeta({
      starterMode: "example-mixed-state",
      savedAt: updatedAt,
    }),
  };

  employmentRecordSeq = 0;
  exampleState.employmentHistory = [
    createEmploymentRecord({
      status: "current",
      periodLabel: "Now",
      employerName: "Northworks Digital Ltd",
      employmentType: "employee",
      schemeName: "Northworks Workplace Pension",
      pensionType: "DC",
      annualIncome: 52000,
      pensionStatus: "active",
      potValue: 64000,
      employerContributionPct: 6,
      employeeContributionPct: 6,
      dcInvestmentAccess: "workplace-self-select",
      dcInvestmentStyle: "balanced",
      payslipContribution: 220,
      providerContribution: 440,
      pensionablePayBasis: "qualifying earnings",
      updatedAt,
    }),
    createEmploymentRecord({
      status: "previous",
      periodLabel: "2011-2021",
      employerName: "City Infrastructure Trust",
      employmentType: "employee",
      schemeName: "Deferred final salary pension",
      pensionType: "DB",
      annualIncome: 41000,
      pensionStatus: "deferred",
      dbAnnualPensionAtSchemeAge: 7200,
      dbSchemePensionAge: 67,
      updatedAt,
    }),
  ];

  applyPortfolioSnapshot(exampleState, {
    touchSavedAt: false,
    starterMode: "example-mixed-state",
  });
  resetChatWindow();
  render();
}

function applyStateExamplePortfolio() {
  const updatedAt = nowStamp();
  const exampleState = {
    ...createBlankPortfolioState(),
    userName: "Sample State Pension Member",
    employerName: "",
    schemeName: "",
    employmentType: "employee",
    mainConcern: "retirement income",
    age: 61,
    retireAge: 67,
    salary: 0,
    currentPot: 0,
    dbAnnualPensionAtSchemeAge: 0,
    dbSchemePensionAge: 0,
    pensionType: "State-only",
    employerContributionPct: 0,
    employeeContributionPct: 0,
    dcInvestmentAccess: "default",
    dcInvestmentStyle: "balanced",
    statePension: FULL_NEW_STATE_PENSION_2026_27,
    statePensionAge: 67,
    emergencySavings: 2500,
    targetMonthlyIncome: 1200,
    pensionablePayBasis: "qualifying earnings",
    payslipContribution: 0,
    providerContribution: 0,
    jobOne: 0,
    jobTwo: 0,
    assumptionPreset: "base",
    meta: createPortfolioMeta({
      starterMode: "example-state",
      savedAt: updatedAt,
    }),
  };

  employmentRecordSeq = 0;
  exampleState.employmentHistory = [
    createEmploymentRecord({
      status: "current",
      periodLabel: "Now",
      employerName: "",
      employmentType: "employee",
      schemeName: "",
      pensionType: "State-only",
      annualIncome: 0,
      pensionStatus: "active",
      dcInvestmentAccess: "default",
      dcInvestmentStyle: "balanced",
      statePensionAge: 67,
      pensionablePayBasis: "qualifying earnings",
      updatedAt,
    }),
  ];

  applyPortfolioSnapshot(exampleState, {
    touchSavedAt: false,
    starterMode: "example-state",
  });
  resetChatWindow();
  render();
}

function applyLowEarnerExamplePortfolio() {
  const updatedAt = nowStamp();
  const exampleState = {
    ...createBlankPortfolioState(),
    userName: "Sample Low Earner",
    employerName: "Neighbourhood Arts CIC",
    schemeName: "Starter Workplace Pension",
    employmentType: "employee",
    mainConcern: "under-saving",
    age: 29,
    retireAge: 68,
    salary: 9500,
    currentPot: 5400,
    pensionType: "DC",
    employerContributionPct: 3,
    employeeContributionPct: 5,
    dcInvestmentAccess: "default",
    dcInvestmentStyle: "balanced",
    secondJobEnabled: false,
    secondJobAnnualIncome: 0,
    secondJobPensionParticipation: "unknown",
    secondJobEmployerContributionPct: 0,
    secondJobEmployeeContributionPct: 0,
    secondJobPensionablePayBasis: "qualifying earnings",
    statePension: 0,
    statePensionAge: 67,
    emergencySavings: 450,
    targetMonthlyIncome: 1600,
    pensionablePayBasis: "qualifying earnings",
    payslipContribution: 14,
    providerContribution: 22,
    jobOne: 9500,
    jobTwo: 0,
    assumptionPreset: "base",
    meta: createPortfolioMeta({
      starterMode: "example-low-earner",
      savedAt: updatedAt,
    }),
  };

  employmentRecordSeq = 0;
  exampleState.employmentHistory = [
    createEmploymentRecord({
      status: "current",
      periodLabel: "Now",
      employerName: "Neighbourhood Arts CIC",
      employmentType: "employee",
      schemeName: "Starter Workplace Pension",
      pensionType: "DC",
      annualIncome: 9500,
      pensionStatus: "active",
      potValue: 5400,
      employerContributionPct: 3,
      employeeContributionPct: 5,
      dcInvestmentAccess: "default",
      dcInvestmentStyle: "balanced",
      payslipContribution: 14,
      providerContribution: 22,
      pensionablePayBasis: "qualifying earnings",
      updatedAt,
    }),
  ];

  applyPortfolioSnapshot(exampleState, {
    touchSavedAt: false,
    starterMode: "example-low-earner",
  });
  resetChatWindow();
  render();
}

function applyPartTimeExamplePortfolio() {
  const updatedAt = nowStamp();
  const exampleState = {
    ...createBlankPortfolioState(),
    userName: "Sample Part-Time Member",
    employerName: "Local Health Services Ltd",
    schemeName: "Flexible Hours Pension",
    employmentType: "part-time",
    mainConcern: "under-saving",
    age: 34,
    retireAge: 68,
    salary: 12000,
    currentPot: 9100,
    pensionType: "DC",
    employerContributionPct: 3,
    employeeContributionPct: 5,
    dcInvestmentAccess: "default",
    dcInvestmentStyle: "balanced",
    secondJobEnabled: false,
    secondJobAnnualIncome: 0,
    secondJobPensionParticipation: "unknown",
    secondJobEmployerContributionPct: 0,
    secondJobEmployeeContributionPct: 0,
    secondJobPensionablePayBasis: "qualifying earnings",
    statePension: 0,
    statePensionAge: 67,
    emergencySavings: 900,
    targetMonthlyIncome: 1900,
    pensionablePayBasis: "qualifying earnings",
    payslipContribution: 24,
    providerContribution: 38,
    jobOne: 12000,
    jobTwo: 0,
    assumptionPreset: "base",
    meta: createPortfolioMeta({
      starterMode: "example-part-time",
      savedAt: updatedAt,
    }),
  };

  employmentRecordSeq = 0;
  exampleState.employmentHistory = [
    createEmploymentRecord({
      status: "current",
      periodLabel: "Now",
      employerName: "Local Health Services Ltd",
      employmentType: "part-time",
      schemeName: "Flexible Hours Pension",
      pensionType: "DC",
      annualIncome: 12000,
      pensionStatus: "active",
      potValue: 9100,
      employerContributionPct: 3,
      employeeContributionPct: 5,
      dcInvestmentAccess: "default",
      dcInvestmentStyle: "balanced",
      payslipContribution: 24,
      providerContribution: 38,
      pensionablePayBasis: "qualifying earnings",
      updatedAt,
    }),
  ];

  applyPortfolioSnapshot(exampleState, {
    touchSavedAt: false,
    starterMode: "example-part-time",
  });
  resetChatWindow();
  render();
}

function applyMultipleJobsExamplePortfolio() {
  const updatedAt = nowStamp();
  const exampleState = {
    ...createBlankPortfolioState(),
    userName: "Sample Multiple Jobs Member",
    employerName: "City Events Co",
    schemeName: "City Events Pension",
    employmentType: "multiple",
    mainConcern: "under-saving",
    age: 36,
    retireAge: 68,
    salary: 8000,
    currentPot: 7200,
    pensionType: "DC",
    employerContributionPct: 3,
    employeeContributionPct: 5,
    dcInvestmentAccess: "default",
    dcInvestmentStyle: "balanced",
    secondJobEnabled: true,
    secondJobAnnualIncome: 7500,
    secondJobPensionParticipation: "not-joined",
    secondJobEmployerContributionPct: 0,
    secondJobEmployeeContributionPct: 0,
    secondJobPensionablePayBasis: "qualifying earnings",
    statePension: 0,
    statePensionAge: 67,
    emergencySavings: 650,
    targetMonthlyIncome: 2000,
    pensionablePayBasis: "qualifying earnings",
    payslipContribution: 7,
    providerContribution: 12,
    jobOne: 8000,
    jobTwo: 7500,
    assumptionPreset: "base",
    meta: createPortfolioMeta({
      starterMode: "example-multiple-jobs",
      savedAt: updatedAt,
    }),
  };

  employmentRecordSeq = 0;
  exampleState.employmentHistory = [
    createEmploymentRecord({
      status: "current",
      periodLabel: "Now",
      employerName: "City Events Co",
      employmentType: "multiple",
      schemeName: "City Events Pension",
      pensionType: "DC",
      annualIncome: 8000,
      pensionStatus: "active",
      potValue: 7200,
      employerContributionPct: 3,
      employeeContributionPct: 5,
      dcInvestmentAccess: "default",
      dcInvestmentStyle: "balanced",
      secondJobEnabled: true,
      secondJobAnnualIncome: 7500,
      secondJobPensionParticipation: "not-joined",
      secondJobEmployerContributionPct: 0,
      secondJobEmployeeContributionPct: 0,
      secondJobPensionablePayBasis: "qualifying earnings",
      payslipContribution: 7,
      providerContribution: 12,
      pensionablePayBasis: "qualifying earnings",
      updatedAt,
    }),
  ];

  applyPortfolioSnapshot(exampleState, {
    touchSavedAt: false,
    starterMode: "example-multiple-jobs",
  });
  resetChatWindow();
  render();
}

function applySelfEmployedExamplePortfolio() {
  const updatedAt = nowStamp();
  const exampleState = {
    ...createBlankPortfolioState(),
    userName: "Sample Self-Employed Saver",
    employerName: "Own business",
    schemeName: "Personal Pension",
    employmentType: "self",
    mainConcern: "under-saving",
    age: 41,
    retireAge: 68,
    salary: 28000,
    currentPot: 16750,
    pensionType: "DC",
    employerContributionPct: 0,
    employeeContributionPct: 12,
    dcInvestmentAccess: "sipp",
    dcInvestmentStyle: "balanced",
    secondJobEnabled: false,
    secondJobAnnualIncome: 0,
    secondJobPensionParticipation: "unknown",
    secondJobEmployerContributionPct: 0,
    secondJobEmployeeContributionPct: 0,
    secondJobPensionablePayBasis: "qualifying earnings",
    statePension: 0,
    statePensionAge: 67,
    emergencySavings: 2200,
    targetMonthlyIncome: 2200,
    pensionablePayBasis: "total earnings",
    payslipContribution: 0,
    providerContribution: 280,
    jobOne: 28000,
    jobTwo: 0,
    assumptionPreset: "base",
    shortTermSavings: {
      emergencyTarget: 5000,
      monthlyBudget: 400,
      cashSharePct: 70,
      incomePattern: "irregular",
      pauseMonths: 9,
    },
    meta: createPortfolioMeta({
      starterMode: "example-self-employed",
      savedAt: updatedAt,
    }),
  };

  employmentRecordSeq = 0;
  exampleState.employmentHistory = [
    createEmploymentRecord({
      status: "current",
      periodLabel: "Now",
      employerName: "Own business",
      employmentType: "self",
      schemeName: "Personal Pension",
      pensionType: "DC",
      annualIncome: 28000,
      pensionStatus: "active",
      potValue: 16750,
      employerContributionPct: 0,
      employeeContributionPct: 12,
      dcInvestmentAccess: "sipp",
      dcInvestmentStyle: "balanced",
      payslipContribution: 0,
      providerContribution: 280,
      pensionablePayBasis: "total earnings",
      updatedAt,
    }),
  ];

  applyPortfolioSnapshot(exampleState, {
    touchSavedAt: false,
    starterMode: "example-self-employed",
  });
  resetChatWindow();
  render();
}

function applyDemoStateFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const demoType = params.get("demo");
  if (!demoType) return false;
  if (demoType === "db") {
    applyDbExamplePortfolio();
  } else if (demoType === "low-earner") {
    applyLowEarnerExamplePortfolio();
  } else if (demoType === "part-time") {
    applyPartTimeExamplePortfolio();
  } else if (demoType === "multiple-jobs" || demoType === "multiple") {
    applyMultipleJobsExamplePortfolio();
  } else if (demoType === "self-employed" || demoType === "self-employed-sipp") {
    applySelfEmployedExamplePortfolio();
  } else if (demoType === "mixed") {
    applyMixedExamplePortfolio();
  } else if (demoType === "mixed-state" || demoType === "mixed-state-pension") {
    applyMixedStateExamplePortfolio();
  } else if (demoType === "state") {
    applyStateExamplePortfolio();
  } else if (demoType === "dc" || demoType === "example") {
    applyExamplePortfolio();
  } else {
    return false;
  }
  showOnboarding("demo");
  window.history.replaceState({}, "", `${window.location.pathname}${window.location.hash || ""}`);
  return true;
}

function exportPortfolioJson() {
  const snapshot = getPersistedPortfolioSnapshot();
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pension-portfolio-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function importPortfolioJson(event) {
  const file = event.target?.files?.[0];
  if (!file) return;

  try {
    const snapshot = JSON.parse(await file.text());
    applyPortfolioSnapshot(snapshot, {
      touchSavedAt: true,
      starterMode: "imported",
    });
    hideOnboarding();
    resetChatWindow();
    render();
  } catch (error) {
    window.alert("The selected file could not be imported. Please choose a valid pension portfolio JSON export.");
  } finally {
    event.target.value = "";
  }
}

function formatRelativeTime(isoString) {
  if (!isoString) return "not saved yet";
  const deltaMs = Date.now() - new Date(isoString).getTime();
  if (!Number.isFinite(deltaMs) || deltaMs < 60000) return "just now";
  const minutes = Math.round(deltaMs / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function renderPortfolioChrome() {
  applyUiMode();

  if (els.portfolioStatusPill) {
    const statusCopy = appState.meta?.savedAt ? `Saved locally - Updated ${formatRelativeTime(appState.meta.savedAt)}` : "Local portfolio";
    els.portfolioStatusPill.innerHTML = `<span></span>${escapeHtml(statusCopy)}`;
  }

  if (els.installAppButton) {
    const shouldShowInstallButton = uiState.shell === "web" && (Boolean(deferredInstallPrompt) || canOfferIosInstallHint());
    els.installAppButton.hidden = !shouldShowInstallButton;
    els.installAppButton.textContent = deferredInstallPrompt ? "Install App" : "Add to Home Screen";
  }

  if (els.contextActionButton) {
    const actionMap = {
      dashboard: { label: "Open Pension Record", target: "finder" },
      finder: { label: "Retirement Goal", target: "goal" },
      goal: { label: "Ask AI Assistant", target: "coach" },
      coach: { label: "View Dashboard", target: "dashboard" },
    };
    const action = actionMap[currentView] || actionMap.dashboard;
    els.contextActionButton.textContent = action.label;
    els.contextActionButton.dataset.viewJump = action.target;
  }
}

function setView(view) {
  currentView = view;
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("active", section.id === view);
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  const viewTitles = {
    dashboard: "Dashboard",
    finder: "Pension Record",
    goal: "Retirement Goal",
    coach: "AI Assistant",
  };
  els.viewTitle.textContent = viewTitles[view] || "Dashboard";
  renderPortfolioChrome();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function render() {
  applyUiMode();
  ensureEmploymentHistoryState();
  ensureScenarioState();
  ensureExtendedAssumptionState();
  syncLegacyStateFromCurrentRecord();
  ensureExtendedAssumptionState();
  syncAssumptionPreset();
  const projection = calculateProjection();
  syncGoalInputMode();
  syncGoalLayout(projection);
  syncInputs();
  renderPortfolioChrome();
  renderMetrics(projection);
  renderPosition(projection);
  renderScheme();
  renderContributions(projection);
  renderDashboardPathwayPanel(projection);
  renderShortTermSavingsSummary(projection);
  renderPots();
  renderManualPensionId();
  renderScenarioModeler(projection);
  renderGoalTracker(projection);
  renderAssumptionPaths(projection);
  renderAssumptionDetails(projection);
  renderSelfSelectPanel(projection);
  renderCashPlanner(projection);
  renderAdequacyFactors(projection);
  renderHouseholdPlanning(projection);
  renderBenchmarkPanel(projection);
  renderGoalPathwayPanel(projection);
  renderProjectionInspector(projection);
  renderAssistantTopicList();
  renderAssistantStarters();
  drawProjection(projection);
  persistPortfolio();
}

function syncGoalInputMode() {
  const type = appState.pensionType || "Unknown";
  const showPotField = type === "DC" || type === "Hybrid";
  const showDbFields = type === "DB" || type === "Hybrid";
  const showStateFields = type !== "Unknown";
  if (els.currentPotField) els.currentPotField.hidden = !showPotField;
  if (els.dbAnnualPensionField) els.dbAnnualPensionField.hidden = !showDbFields;
  if (els.dbSchemePensionAgeField) els.dbSchemePensionAgeField.hidden = !showDbFields;
  if (els.dbAmountBasisField) els.dbAmountBasisField.hidden = !showDbFields;
  if (els.dbRevaluationField) els.dbRevaluationField.hidden = !showDbFields;
  if (els.dbIndexationField) els.dbIndexationField.hidden = !showDbFields;
  if (els.dbAdjustmentField) els.dbAdjustmentField.hidden = !showDbFields;
  if (els.statePensionField) els.statePensionField.hidden = !showStateFields;
  if (els.statePensionAgeField) els.statePensionAgeField.hidden = !showStateFields;
  if (els.goalInputModeCopy) {
    els.goalInputModeCopy.textContent = getGoalInputModeCopy(type);
  }
}

function syncInputs() {
  setValue("ageInput", appState.age);
  setValue("targetMonthlyInput", appState.targetMonthlyIncome);
  setValue("retireAgeInput", appState.retireAge);
  setValue("currentPotInput", appState.currentPot);
  setValue("dbAnnualPensionInput", appState.dbAnnualPensionAtSchemeAge);
  setValue("dbSchemePensionAgeInput", appState.dbSchemePensionAge);
  setValue("dbAmountBasisInput", normalizeDbAmountBasis(appState.dbAmountBasis));
  setValue("dbRevaluationInput", appState.dbRevaluationPct);
  setValue("dbIndexationInput", appState.dbIndexationPct);
  setValue("dbAdjustmentInput", appState.dbAdjustmentPct);
  setValue("statePensionInput", appState.statePension);
  setValue("statePensionAgeInput", appState.statePensionAge);
  setValue("moneyModeInput", normalizeMoneyMode(appState.moneyMode));
  setValue("inflationInput", appState.inflationPct);
  setValue("annualChargeInput", appState.annualChargePct);
  setValue("salaryGrowthInput", appState.salaryGrowthPct);
  setValue("contributionEscalationInput", appState.contributionEscalationPct);
  setValue("taxReliefModeInput", normalizeTaxReliefMode(appState.taxReliefMode));
  setValue("marginalTaxInput", appState.marginalTaxPct);
  setValue("employeeNiInput", appState.employeeNiPct);
  setValue("emergencyTargetInput", appState.shortTermSavings?.emergencyTarget);
  setValue("monthlyBudgetInput", appState.shortTermSavings?.monthlyBudget);
  setValue("cashShareInput", appState.shortTermSavings?.cashSharePct);
  setValue("incomePatternInput", appState.shortTermSavings?.incomePattern);
  setValue("pauseMonthsInput", appState.shortTermSavings?.pauseMonths);
  setValue("housingStatusInput", normalizeHousingStatus(appState.lifeFactors?.housingStatus));
  setValue("housingCostInput", appState.lifeFactors?.monthlyHousingCost);
  setValue("debtPressureInput", normalizeDebtPressure(appState.lifeFactors?.debtPressure));
  setValue("dependantsInput", appState.lifeFactors?.dependants);
  setValue("survivorNeedInput", normalizeSurvivorNeed(appState.lifeFactors?.survivorNeed));
  setValue("investmentAccessInput", getCurrentRecordDcInvestmentAccess());
  setValue("investmentStyleInput", getCurrentRecordDcInvestmentStyle());
  if (els.householdEnabledInput) els.householdEnabledInput.checked = Boolean(appState.partnerProfile?.enabled);
  setValue("partnerNameInput", appState.partnerProfile?.name);
  setValue("partnerAgeInput", appState.partnerProfile?.age);
  setValue("partnerRetireAgeInput", appState.partnerProfile?.retireAge);
  setValue("partnerPensionTypeInput", appState.partnerProfile?.pensionType);
  setValue("partnerCurrentPotInput", appState.partnerProfile?.currentPot);
  setValue("partnerMonthlyContributionInput", appState.partnerProfile?.monthlyContribution);
  setValue("partnerStatePensionInput", appState.partnerProfile?.statePension);
  setValue("householdGoalInput", appState.householdGoal?.jointMonthlyIncome);
  setValue("householdScenarioTypeInput", appState.householdGoal?.scenarioType);
  setValue("householdScenarioValueInput", appState.householdGoal?.scenarioValue);
  document.querySelectorAll("[data-assumption-preset]").forEach((button) => {
    button.classList.toggle("active", button.dataset.assumptionPreset === appState.assumptionPreset);
  });
}

function getConnectedPensions(state = appState) {
  const records = getEmploymentHistoryForState(state)
    .filter((record) => record.status === "current" || isMeaningfulEmploymentRecord(record))
    .filter((record) => record.status === "current" || record.pensionType !== "State-only" || toNumber(record.potValue) > 0);

  const pensions = records.map((record) => {
    const isCurrent = record.status === "current";
    const contributionTotal = toNumber(record.employerContributionPct) + toNumber(record.employeeContributionPct);
    const notes = [];
    const isDb = record.pensionType === "DB";
    const isHybrid = record.pensionType === "Hybrid";
    if (isCurrent) {
      notes.push("Current record");
      if (contributionTotal > 0) notes.push(`${formatPct(contributionTotal)} total contribution`);
    } else {
      notes.push(record.periodLabel || "Previous record");
      if (record.pensionStatus === "deferred") notes.push("Deferred");
    }
    if (record.employmentType) notes.push(getEmploymentLabel(record.employmentType));
    if (isDb) {
      notes.push("DB promise");
      if (toNumber(record.dbSchemePensionAge) > 0) notes.push(`Scheme age ${toNumber(record.dbSchemePensionAge)}`);
    } else if (isHybrid) {
      notes.push("Hybrid record");
      if (toNumber(record.dbAnnualPensionAtSchemeAge) > 0) notes.push(`${formatMoney(toNumber(record.dbAnnualPensionAtSchemeAge))} / yr DB`);
      if (toNumber(record.dbSchemePensionAge) > 0) notes.push(`DB starts ${toNumber(record.dbSchemePensionAge)}`);
    } else if (toNumber(record.potValue) > 0 && toNumber(record.potValue) < 10000) {
      notes.push("Small pot");
    }

    return {
      id: record.id,
      name: isCurrent ? "Current workplace pension" : `${record.employerName || "Previous employment"} pension`,
      provider: record.schemeName || "Provider not entered",
      type: record.pensionType === "Unknown" ? "Unknown" : record.pensionType,
      source: isCurrent ? (record.employerName || "Current employer") : (record.periodLabel || "Previous employment"),
      value: isDb
        ? (toNumber(record.dbAnnualPensionAtSchemeAge) > 0 ? toNumber(record.dbAnnualPensionAtSchemeAge) : null)
        : isCurrent
          ? toNumber(record.potValue)
          : (toNumber(record.potValue) > 0 ? toNumber(record.potValue) : null),
      valueType: isDb ? "db-income" : "pot",
      status: isCurrent ? "Active" : (record.pensionStatus === "unknown" ? "Unknown" : record.pensionStatus[0].toUpperCase() + record.pensionStatus.slice(1)),
      notes,
    };
  });

  if (Math.max(0, toNumber(state.statePension)) > 0) {
    pensions.push({
      id: "state",
      name: "State Pension",
      provider: "Government forecast",
      type: "State",
      source: "National Insurance record",
      value: "state",
      status: "Forecast",
      notes: ["Forecast", "NI record"],
    });
  }

  return pensions;
}

function totalPrivatePensionWealth(input = appState) {
  const state = typeof input === "number" ? { ...appState, currentPot: input } : input;
  const current = getCurrentEmploymentRecord(state);
  return current && isProjectedDcArrangement(current.pensionType) ? Math.max(0, toNumber(current.potValue)) : 0;
}

function renderMetrics(projection) {
  let metricProjection = projection;
  let metricYearlyIncome = projection.projectedYearlyIncome;
  if (!projection.isBlocked && projection.usesIncomeMix) {
    metricProjection = getIncomeMixDisplayProjection(projection);
    metricYearlyIncome = getProjectionIncomeSegments(metricProjection).reduce((sum, segment) => sum + segment.value, 0);
  }
  const displayMetricYearlyIncome = displayYearlyIncome(metricProjection, metricYearlyIncome);
  const projectedMonthly = displayMetricYearlyIncome / 12;
  const metricGap = (metricProjection.displayTargetYearlyIncome ?? metricProjection.targetYearlyIncome) - displayMetricYearlyIncome;
  const gapMonthly = Math.abs(metricGap) / 12;
  const current = getCurrentEmploymentRecord();
  els.projectedIncome.textContent = formatMoney((metricProjection.displayTargetYearlyIncome ?? metricProjection.targetYearlyIncome) / 12);
  els.incomeStatus.textContent = metricProjection.moneyMode === "today" ? "Monthly goal in today's money" : "Monthly goal at retirement";

  if (projection.isBlocked) {
    els.emergencyValue.textContent = "Resolve scheme type";
    els.emergencyStatus.textContent = "Retirement projection is paused until the current arrangement is confirmed";
    els.monthlyTargetValue.textContent = "Blocked";
    els.yearlyTargetValue.textContent = "No gap shown while arrangement type is unresolved";
    if (els.connectedMetricLabel) els.connectedMetricLabel.textContent = "Current arrangement";
    els.connectedCount.textContent = getPlanLabel(current?.pensionType);
    els.connectedStatus.textContent = getProjectionBlockerCopy(projection);
    return;
  }

  els.emergencyValue.textContent = formatMoney(projectedMonthly);
  els.emergencyStatus.textContent = metricProjection.hasGoal
    ? `${Math.round((displayMetricYearlyIncome / (metricProjection.displayTargetYearlyIncome || metricProjection.targetYearlyIncome)) * 100)}% of goal on current arrangement`
    : "Add a monthly retirement goal to measure coverage";
  els.monthlyTargetValue.textContent = metricProjection.hasGoal ? formatMoney(gapMonthly) : "Enter goal";
  els.yearlyTargetValue.textContent = metricProjection.hasGoal
    ? metricGap > 0 ? "Still short per month" : "Above target per month"
    : "Add a monthly retirement goal to measure coverage and gap";
  if (projection.usesIncomeMix) {
    if (projection.currentType === "State-only") {
      if (els.connectedMetricLabel) els.connectedMetricLabel.textContent = "State Pension / year";
      els.connectedCount.textContent = metricProjection.statePensionSummary.included
        ? formatMoney(metricProjection.statePensionSummary.yearlyIncome)
        : `Starts ${metricProjection.statePensionSummary.startAge}`;
      els.connectedStatus.textContent = metricProjection.statePensionSummary.included
        ? "This metric is for the State Pension record only."
        : `The entered State Pension forecast is not counted yet because it starts at age ${metricProjection.statePensionSummary.startAge}.`;
      return;
    }
    if (els.connectedMetricLabel) els.connectedMetricLabel.textContent = "DB pension / year";
    els.connectedCount.textContent = formatMoney(toNumber(current?.dbAnnualPensionAtSchemeAge));
    els.connectedStatus.textContent =
      toNumber(current?.dbSchemePensionAge) > 0 ? `Statement amount payable from age ${toNumber(current.dbSchemePensionAge)}` : "Add the scheme pension age";
    return;
  }
  if (els.connectedMetricLabel) {
    els.connectedMetricLabel.textContent = "Current pension wealth";
  }
  els.connectedCount.textContent = formatMoney(projection.currentPrivateWealth);
  els.connectedStatus.textContent = projection.usesIncomeMix
    ? "Any DB statement income or State Pension is tracked separately from the DC component"
    : `${formatMoney(projection.totalMonthly)} currently saved into pension each month`;
}

function renderPosition(projection) {
  if (projection.isBlocked) {
    renderRows(els.positionList, [
      ["Current arrangement", getPlanLabel(projection.currentType)],
      ["Projection status", "Blocked until scheme type is confirmed"],
      ["Current record", "Unknown"],
      ["What is paused", "Retirement income, benchmark, scenario and chart comparisons"],
      ["Next step", "Open Pension Record and reclassify the current arrangement as DC, DB, Hybrid or State Pension only"],
      ["Reason", getProjectionBlockerCopy(projection)],
    ]);
    return;
  }

  if (hasMixedHistoryGoalView(projection)) {
    renderRows(els.positionList, getMixedHistoryGoalRows(getAgeSeriesDisplayProjection(projection), { includeComparisonAge: true }));
    return;
  }

  const currentOnlyYearlyIncome =
    projection.currentType === "DC" && !projection.hasStatePensionForecast ? projection.dcProjectedYearlyIncome : projection.projectedYearlyIncome;
  const rows = projection.usesIncomeMix
    ? (() => {
        const displayProjection = getIncomeMixDisplayProjection(projection);
        return [
          ["Monthly goal", formatMonthlyGoalValue(displayProjection)],
          ["Comparison age", `Age ${displayProjection.state.retireAge}`],
          ...getIncomeMixProjectionRows(displayProjection).filter(([label]) => label !== "Source basis"),
        ];
      })()
    : [
        ["Monthly goal", formatMonthlyGoalValue(projection)],
        [
	          projection.currentType === "DC" && !projection.hasStatePensionForecast
	            ? "Projected DC income / month"
	            : "Projected monthly retirement income",
	          formatProjectionMoney(projection, currentOnlyYearlyIncome / 12),
	        ],
	        [
	          "Coverage of goal",
	          projection.hasGoal
	            ? `${Math.round((displayYearlyIncome(projection, currentOnlyYearlyIncome) / (projection.displayTargetYearlyIncome || projection.targetYearlyIncome)) * 100)}%`
	            : "Enter goal first",
	        ],
	        ["Projected retirement pot", formatProjectionMoney(projection, projection.projectedPot)],
        ["Years to retirement", String(projection.years)],
        ["Gap to goal", formatGapFromYearlyIncome(projection, currentOnlyYearlyIncome)],
      ];
  renderRows(els.positionList, rows);
}

function renderScheme() {
  const current = getCurrentEmploymentRecord();
  const rows = [
    ["Employer", current?.employerName || "Not entered"],
    ["Period", current?.periodLabel || "Now"],
    ["Employment type", getEmploymentLabel(current?.employmentType)],
    ["Scheme / provider", current?.pensionType === "State-only" ? "Not needed for State Pension only" : current?.schemeName || "Not entered"],
    ["Arrangement", getPlanLabel(current?.pensionType)],
    ["Annual income", formatMoney(toNumber(current?.annualIncome))],
  ];
  if (current?.pensionType === "DB") {
    rows.push(["DB pension / year", formatMoney(toNumber(current?.dbAnnualPensionAtSchemeAge))]);
    rows.push(["DB scheme pension age", toNumber(current?.dbSchemePensionAge) > 0 ? String(toNumber(current?.dbSchemePensionAge)) : "Not entered"]);
    rows.push(["DB amount basis", normalizeDbAmountBasis(current?.dbAmountBasis) === "current-deferred" ? "Current deferred amount" : "Statement amount at scheme age"]);
    rows.push(["DB revaluation / indexation", `${formatPct(toNumber(current?.dbRevaluationPct))} / ${formatPct(toNumber(current?.dbIndexationPct))}`]);
    rows.push(["Early/late factor", formatPct(toNumber(current?.dbAdjustmentPct))]);
  } else if (current?.pensionType === "Hybrid") {
    rows.push(["Current DC balance", formatMoney(toNumber(current?.potValue))]);
    rows.push(["DB pension / year", formatMoney(toNumber(current?.dbAnnualPensionAtSchemeAge))]);
    rows.push(["DB scheme pension age", toNumber(current?.dbSchemePensionAge) > 0 ? String(toNumber(current?.dbSchemePensionAge)) : "Not entered"]);
    rows.push(["DB amount basis", normalizeDbAmountBasis(current?.dbAmountBasis) === "current-deferred" ? "Current deferred amount" : "Statement amount at scheme age"]);
    rows.push(["DB revaluation / indexation", `${formatPct(toNumber(current?.dbRevaluationPct))} / ${formatPct(toNumber(current?.dbIndexationPct))}`]);
    rows.push(["Early/late factor", formatPct(toNumber(current?.dbAdjustmentPct))]);
  } else if (current?.pensionType === "Unknown") {
    rows.push(["Projection status", "Confirm the arrangement before using retirement comparisons"]);
  }
  renderRows(els.schemeList, rows);
}

function renderContributions(projection) {
  const current = getCurrentEmploymentRecord();
  if (current?.pensionType === "State-only") {
    renderRows(els.contributionList, [
      ["Arrangement", "State Pension only"],
      ["Projection use", "No private-pension contribution stream is modelled for this record."],
      ["State Pension / year", formatMoney(appState.statePension)],
    ]);
    return;
  }
  if (current?.pensionType === "Unknown") {
    renderRows(els.contributionList, [
      ["Arrangement", "Unknown"],
      ["Projection use", "Retirement projection is paused until the arrangement is confirmed."],
      ["Next step", "Confirm whether this record is DC, DB, Hybrid or State Pension only."],
    ]);
    return;
  }

  const rows = [
    ["Employer contribution", formatPct(appState.employerContributionPct)],
    ["Your contribution", formatPct(appState.employeeContributionPct)],
    ["Employer amount / month", formatMoney(projection.employerMonthly)],
    ["Your amount / month", formatMoney(projection.employeeMonthly)],
    ["Payslip deduction / month", formatMoney(appState.payslipContribution)],
    ["Provider shown / month", formatMoney(appState.providerContribution)],
    ["Pay basis", appState.pensionablePayBasis],
  ];
  if (current?.pensionType === "DB") {
    rows.push(["Projection use", "Tracked for employment guidance only. The DB retirement result uses the statement income and scheme age instead."]);
  } else if (current?.pensionType === "Hybrid") {
    rows.push(["Projection use", "Contribution inputs drive only the DC side of the hybrid record. The DB side uses the statement income and scheme age."]);
  }
  renderRows(els.contributionList, rows);
}

function getBenchmarkSet(isHousehold = Boolean(appState.partnerProfile?.enabled)) {
  return isHousehold ? benchmarkThresholds.couple : benchmarkThresholds.single;
}

function getBenchmarkTier(income, benchmarkSet = getBenchmarkSet()) {
  if (income >= benchmarkSet.comfortable) {
    return {
      label: "At or above the comfortable benchmark",
      nextTarget: null,
      nextLabel: "Already above the comfortable benchmark",
    };
  }

  if (income >= benchmarkSet.moderate) {
    return {
      label: "Between the moderate and comfortable benchmarks",
      nextTarget: benchmarkSet.comfortable,
      nextLabel: "Comfortable benchmark",
    };
  }

  if (income >= benchmarkSet.minimum) {
    return {
      label: "Between the minimum and moderate benchmarks",
      nextTarget: benchmarkSet.moderate,
      nextLabel: "Moderate benchmark",
    };
  }

  return {
    label: "Below the minimum benchmark",
    nextTarget: benchmarkSet.minimum,
    nextLabel: "Minimum benchmark",
  };
}

function getIncomePatternLabel(value = appState.shortTermSavings?.incomePattern) {
  const labels = {
    steady: "Steady income",
    lower: "Lower-income pressure",
    irregular: "Irregular income",
  };
  return labels[value] || "Steady income";
}

function getLifeEventLabel(value = appState.lifeEvent?.type) {
  const labels = {
    none: "No event selected",
    "starting-work": "Starting work",
    "changing-jobs": "Changing jobs",
    "self-employed": "Becoming self-employed",
    "parental-leave": "Maternity or parental leave",
    sickness: "Sickness or lower income",
    divorce: "Divorce or separation",
    "approaching-retirement": "Approaching retirement",
  };
  return labels[value] || "No event selected";
}

function getAdequacyStatus(projection) {
  if (projection.isBlocked) {
    return {
      status: "Blocked",
      tone: "warning",
      summary: "Retirement adequacy is paused until the current Unknown arrangement is reclassified.",
      benchmarkSet: getBenchmarkSet(Boolean(appState.partnerProfile?.enabled)),
      benchmarkTier: null,
      extraMonthlyNeeded: 0,
      strongestLever: null,
    };
  }

  const benchmarkSet = getBenchmarkSet(Boolean(appState.partnerProfile?.enabled));
  const benchmarkTier = getBenchmarkTier(projection.displayProjectedYearlyIncome ?? projection.projectedYearlyIncome, benchmarkSet);
  const needed = estimateContributionNeeded();
  const bufferGap = Math.max(0, toNumber(appState.shortTermSavings?.emergencyTarget) - toNumber(appState.emergencySavings));
  const extraMonthlyNeeded = Math.max(0, needed.requiredMonthly - projection.totalMonthly);
  const coverage = projection.coverage;
  let status = "On track";
  let tone = "good";
  let summary = "Current assumptions cover the goal and the benchmark picture is broadly healthy.";

  if (coverage < 0.65) {
    status = "Severe shortfall";
    tone = "critical";
    summary = "Current assumptions leave a material gap against the entered target.";
  } else if (coverage < 0.85) {
    status = "Short";
    tone = "warning";
    summary = "The target is still some distance away on current assumptions.";
  } else if (coverage < 1 || bufferGap > 0) {
    status = "Watch";
    tone = "watch";
    summary = "The record is close to the target, but either the income path or the short-term buffer still needs work.";
  }

  const raiseProjection = calculateScenarioProjection(
    { ...createDefaultScenarioModel(), type: "raise-contributions", extraEmployeePct: 2 },
    projection.state
  );
  const laterProjection = calculateScenarioProjection(
    { ...createDefaultScenarioModel(), type: "retire-later", retireLaterYears: 2 },
    projection.state
  );
  const splitProjection = calculateScenarioProjection(
    { ...createDefaultScenarioModel(), type: "split-savings", splitExtraMonthly: Math.max(25, Math.round((toNumber(appState.shortTermSavings?.monthlyBudget) || 0) / 2) || 100) },
    projection.state
  );
  const leverCandidates = [
    {
      label: "Retire two years later",
      gain: laterProjection ? laterProjection.displayProjectedYearlyIncome / 12 - projection.displayProjectedYearlyIncome / 12 : 0,
    },
    {
      label: "Add 2% to pension contributions",
      gain: raiseProjection ? raiseProjection.displayProjectedYearlyIncome / 12 - projection.displayProjectedYearlyIncome / 12 : 0,
    },
    {
      label: "Move more flexible saving into pension",
      gain: splitProjection ? splitProjection.displayProjectedYearlyIncome / 12 - projection.displayProjectedYearlyIncome / 12 : 0,
    },
  ].sort((a, b) => b.gain - a.gain);

  return {
    status,
    tone,
    summary,
    benchmarkSet,
    benchmarkTier,
    extraMonthlyNeeded,
    strongestLever: leverCandidates[0],
  };
}

function getShortTermSavingsPlan(projection) {
  const settings = {
    ...createDefaultShortTermSavings(),
    ...(appState.shortTermSavings || {}),
  };
  const emergencyTarget = Math.max(thresholds.emergencyTarget, toNumber(settings.emergencyTarget));
  const currentSavings = toNumber(appState.emergencySavings);
  const bufferGap = Math.max(0, emergencyTarget - currentSavings);
  const monthlyBudget = Math.max(0, toNumber(settings.monthlyBudget));
  const cashSharePct = Math.min(100, Math.max(0, toNumber(settings.cashSharePct)));
  const monthlyCash = monthlyBudget * (cashSharePct / 100);
  const monthlyPensionFlex = Math.max(0, monthlyBudget - monthlyCash);
  const pauseMonths = Math.max(1, toNumber(settings.pauseMonths));
  const pauseReserveTarget = monthlyBudget * pauseMonths;
  const pauseGap = Math.max(0, pauseReserveTarget - currentSavings);
  const monthsCovered = monthlyBudget > 0 ? currentSavings / monthlyBudget : 0;
  const pauseProjection = calculateScenarioProjection(
    { ...createDefaultScenarioModel(), type: "pause-saving", pauseMonths },
    projection.state
  );
  const restartProjection = calculateScenarioProjection(
    { ...createDefaultScenarioModel(), type: "restart-after-pause", extraEmployeePct: 2 },
    projection.state
  );
  const pauseEffect = pauseProjection ? projection.displayProjectedYearlyIncome / 12 - pauseProjection.displayProjectedYearlyIncome / 12 : 0;
  const restartRecovery =
    pauseProjection && restartProjection
      ? restartProjection.displayProjectedYearlyIncome / 12 - pauseProjection.displayProjectedYearlyIncome / 12
      : 0;
  let splitGuidance = "Keep a balanced split between cash and pension.";

  if (bufferGap > 0 && settings.incomePattern !== "steady") {
    splitGuidance = "Bias the flexible budget toward cash first so a short shock does not force a longer pension setback.";
  } else if (bufferGap > 0) {
    splitGuidance = "Finish building the cash buffer first, then redirect more of the flexible budget into pension.";
  } else if ((projection.displayGap ?? projection.gap) > 0) {
    splitGuidance = "The cash buffer is already in a safer range, so extra flexible money can start working harder for the pension goal.";
  }

  return {
    emergencyTarget,
    currentSavings,
    bufferGap,
    monthlyBudget,
    cashSharePct,
    monthlyCash,
    monthlyPensionFlex,
    pauseMonths,
    pauseReserveTarget,
    pauseGap,
    monthsCovered,
    pauseEffect,
    restartRecovery,
    splitGuidance,
    incomePatternLabel: getIncomePatternLabel(settings.incomePattern),
  };
}

function getAnnualQualifyingEarningsBase(annualIncome) {
  const income = Math.max(0, toNumber(annualIncome));
  return Math.max(0, Math.min(income, thresholds.upperBand) - thresholds.lowerBand);
}

function getContributionBaseForPayBasis(annualIncome, payBasis) {
  const income = Math.max(0, toNumber(annualIncome));
  const normalizedBasis = normalizePensionablePayBasis(payBasis);
  if (normalizedBasis === "qualifying earnings") {
    return getAnnualQualifyingEarningsBase(income);
  }
  if (normalizedBasis === "unknown") {
    return 0;
  }
  return income;
}

function getAutoEnrolmentRoute({ annualIncome, age = appState.age, statePensionAge = appState.statePensionAge, employmentType = "employee" } = {}) {
  const income = Math.max(0, toNumber(annualIncome));
  const roundedAge = Math.round(toNumber(age));
  const statePensionAgeValue = normalizeStatePensionAge(statePensionAge);
  const normalizedEmploymentType = normalizeEmploymentType(employmentType);
  const inEligibleAgeBand = roundedAge >= 22 && roundedAge < statePensionAgeValue;
  const aboveLowerBand = income > thresholds.lowerBand;
  const atOrAboveTrigger = income >= thresholds.trigger;

  if (normalizedEmploymentType === "self") {
    return {
      key: "self-employed",
      label: "Self-employed route",
      shortLabel: "Self-employed",
      employerContributionRequired: false,
      explanation: "No automatic-enrolment employer contribution duty usually applies to self-employed work.",
    };
  }

  if (roundedAge < 16 || roundedAge > 74) {
    return {
      key: "outside-age-band",
      label: "Outside the usual worker age band",
      shortLabel: "Outside age band",
      employerContributionRequired: false,
      explanation: "The normal 16 to 74 workplace-pension worker tests may not apply in the usual way at this age.",
    };
  }

  if (inEligibleAgeBand && atOrAboveTrigger) {
    return {
      key: "auto-enrol",
      label: "Automatic enrolment",
      shortLabel: "Auto-enrol",
      employerContributionRequired: true,
      explanation: "Employer should enrol automatically and contribute if worker and UK tests are met.",
    };
  }

  if (aboveLowerBand) {
    return {
      key: "opt-in",
      label: inEligibleAgeBand ? "Opt in with employer contribution" : "Opt in while outside the auto-enrol age band",
      shortLabel: "Opt-in",
      employerContributionRequired: true,
      explanation: inEligibleAgeBand
        ? "Employer contributions usually follow once you opt in."
        : "Outside the main auto-enrol age band, but an opt-in route can still carry employer contributions.",
    };
  }

  return {
    key: "join-right",
    label: "Join-right only",
    shortLabel: "Join-right",
    employerContributionRequired: false,
    explanation: "You can usually ask to join, but the employer does not usually have to contribute at this earnings level.",
  };
}

function getCurrentRecordParticipationStatus(record) {
  if (!record || record.pensionType === "Unknown" || record.pensionType === "State-only") return "unknown";
  const hasContributions =
    toNumber(record.employerContributionPct) > 0 ||
    toNumber(record.employeeContributionPct) > 0 ||
    toNumber(record.payslipContribution) > 0 ||
    toNumber(record.providerContribution) > 0;
  const hasBenefit =
    toNumber(record.potValue) > 0 ||
    toNumber(record.dbAnnualPensionAtSchemeAge) > 0 ||
    record.pensionStatus === "active";
  return hasContributions || hasBenefit ? "active" : "not-joined";
}

function getJobCoverageSummary({
  label,
  annualIncome,
  pensionablePayBasis,
  employerContributionPct = 0,
  employeeContributionPct = 0,
  age = appState.age,
  statePensionAge = appState.statePensionAge,
  employmentType = "employee",
  participation = "unknown",
}) {
  const income = Math.max(0, toNumber(annualIncome));
  const route = getAutoEnrolmentRoute({
    annualIncome: income,
    age,
    statePensionAge,
    employmentType,
  });
  const qualifyingEarningsBase = getAnnualQualifyingEarningsBase(income);
  const statutoryEmployerAnnual = qualifyingEarningsBase * 0.03;
  const statutoryTotalAnnual = qualifyingEarningsBase * 0.08;
  const actualContributionBase = getContributionBaseForPayBasis(income, pensionablePayBasis);
  const actualEmployerAnnual = actualContributionBase * (toNumber(employerContributionPct) / 100);
  const actualEmployeeAnnual = actualContributionBase * (toNumber(employeeContributionPct) / 100);
  const actualTotalAnnual = actualEmployerAnnual + actualEmployeeAnnual;
  const normalizedParticipation = normalizeSecondJobPensionParticipation(participation);
  const missedEmployerAnnual =
    route.employerContributionRequired && normalizedParticipation !== "active" ? statutoryEmployerAnnual : 0;

  return {
    label,
    income,
    route,
    qualifyingEarningsBase,
    statutoryEmployerAnnual,
    statutoryTotalAnnual,
    actualContributionBase,
    actualEmployerAnnual,
    actualEmployeeAnnual,
    actualTotalAnnual,
    participation: normalizedParticipation,
    missedEmployerAnnual,
    payBasis: normalizePensionablePayBasis(pensionablePayBasis),
  };
}

function getPathwayGroupLabel(key) {
  const labels = {
    "low-earner": "Low earner",
    "part-time": "Part-time",
    "multiple-jobs": "Multiple jobs",
  };
  return labels[key] || "Tailored pathway";
}

function getTailoredPathwaySummary(projection = calculateProjection()) {
  const current = getCurrentEmploymentRecord(projection.state);
  if (!current || current.employmentType === "self" || current.pensionType === "State-only") return null;

  const secondJobOn = Boolean(current.secondJobEnabled) || current.employmentType === "multiple";
  const jobOne = getJobCoverageSummary({
    label: secondJobOn ? "Job 1" : "Current job",
    annualIncome: current.annualIncome,
    pensionablePayBasis: current.pensionablePayBasis,
    employerContributionPct: current.employerContributionPct,
    employeeContributionPct: current.employeeContributionPct,
    age: projection.state.age,
    statePensionAge: projection.state.statePensionAge,
    employmentType: current.employmentType,
    participation: getCurrentRecordParticipationStatus(current),
  });
  const jobTwo = secondJobOn
    ? getJobCoverageSummary({
        label: "Job 2",
        annualIncome: current.secondJobAnnualIncome,
        pensionablePayBasis: current.secondJobPensionablePayBasis,
        employerContributionPct: current.secondJobEmployerContributionPct,
        employeeContributionPct: current.secondJobEmployeeContributionPct,
        age: projection.state.age,
        statePensionAge: projection.state.statePensionAge,
        employmentType: "employee",
        participation: current.secondJobPensionParticipation,
      })
    : null;

  const groups = [];
  if (jobOne.income > 0 && jobOne.income < thresholds.trigger) groups.push("low-earner");
  if (current.employmentType === "part-time") groups.push("part-time");
  if (secondJobOn) groups.push("multiple-jobs");

  if (!groups.length) return null;

  const benchmarkSet = getBenchmarkSet(Boolean(appState.partnerProfile?.enabled));
  const benchmarkTier = projection.hasGoal ? null : getBenchmarkTier(projection.displayProjectedYearlyIncome ?? projection.projectedYearlyIncome, benchmarkSet);
  const hasShortfall =
    (projection.displayGap ?? projection.gap) > 0 || (!projection.hasGoal && benchmarkTier?.label === "Below the minimum benchmark");
  const priority =
    groups.includes("multiple-jobs") ? "multiple-jobs" : groups.includes("low-earner") ? "low-earner" : groups[0];
  const missedEmployerAnnual = jobOne.missedEmployerAnnual + (jobTwo?.missedEmployerAnnual || 0);
  const combinedIncome = jobOne.income + (jobTwo?.income || 0);
  let nextAction = "Keep the job details and pension letters together, then check the employer route in writing.";

  if (priority === "multiple-jobs") {
    nextAction =
      jobTwo && missedEmployerAnnual > 0
        ? "Check each employer separately. Combined pay does not create automatic enrolment, but opt-in rights and missed employer contributions can still exist job by job."
        : "Keep each job separate in pension checks. Combined pay is context only, not the legal automatic-enrolment test.";
  } else if (priority === "low-earner") {
    nextAction =
      jobOne.route.key === "opt-in"
        ? "If you are not already in the scheme, opt in in writing so employer contributions should start on the legal minimum base."
        : "Ask to join in writing even if employer contributions may not follow at this earnings level.";
  } else if (priority === "part-time") {
    nextAction = "Part-time status does not remove pension rights. Check the age, earnings test, pay basis and first contribution date.";
  }

  const summary = {
    current,
    groups,
    priority,
    priorityLabel: getPathwayGroupLabel(priority),
    active: hasShortfall,
    statusLabel: hasShortfall ? "Under-saving risk" : "Informational pathway",
    reason: hasShortfall
      ? (projection.displayGap ?? projection.gap) > 0
        ? `${formatMoney((projection.displayGap ?? projection.gap) / 12)} short / month on the current projection.`
        : "No goal is set and the current result is below the minimum benchmark."
      : "The group is still relevant, but the current projection does not trigger a priority shortfall alert.",
    nextAction,
    note:
      priority === "multiple-jobs"
        ? "Job 2 is analysed as a separate workplace-pension coverage module. It does not change the main pot projection in this version."
        : priority === "part-time"
          ? "Part-time status is a pattern flag only. The legal route still depends on age, worker status and earnings."
          : "Low earnings can shrink or remove the employer-contribution route even when retirement needs are still material.",
    jobOne,
    jobTwo,
    combinedIncome,
    combinedQualifyingEarningsBase: jobOne.qualifyingEarningsBase + (jobTwo?.qualifyingEarningsBase || 0),
    combinedStatutoryEmployerAnnual: jobOne.statutoryEmployerAnnual + (jobTwo?.statutoryEmployerAnnual || 0),
    combinedStatutoryTotalAnnual: jobOne.statutoryTotalAnnual + (jobTwo?.statutoryTotalAnnual || 0),
    missedEmployerAnnual,
    benchmarkTier,
  };

  return summary;
}

function getEligibilitySnapshot() {
  const current = getCurrentEmploymentRecord();
  const income = toNumber(current?.annualIncome);
  const age = toNumber(appState.age);
  const statePensionAge = normalizeStatePensionAge(appState.statePensionAge);
  const routeView = getAutoEnrolmentRoute({
    annualIncome: income,
    age,
    statePensionAge,
    employmentType: current?.employmentType || "employee",
  });
  let nextStep = "Keep the payslip, joining letter and scheme booklet together.";

  if (routeView.key === "self-employed") {
    nextStep = "Use a personal pension or another retirement-savings route because there is usually no automatic-enrolment employer contribution.";
  } else if (routeView.key === "auto-enrol") {
    nextStep = "Check the enrolment letter, pay basis and the first contribution date.";
  } else if (routeView.key === "opt-in") {
    nextStep = "Ask to opt in in writing if not already enrolled and keep the employer reply.";
  } else if (routeView.key === "join-right") {
    nextStep = "Ask to join in writing even if employer contributions may not follow at this earnings level.";
  } else {
    nextStep = "Ask payroll how the scheme treats age, worker status and earnings for this job.";
  }

  const extraRoute =
    current?.employmentType === "multiple" || current?.secondJobEnabled
      ? "Each job is assessed separately, so keep the letters and payslips for every employer."
      : current?.employmentType === "part-time"
        ? "Part-time work does not remove pension rights; the key tests are age, worker status and earnings."
        : "If the scheme type is still unknown, confirm it from the provider or scheme documents before relying on the record.";

  return {
    ageBand: age < 22 ? "Under 22" : age < statePensionAge ? "22 to State Pension age" : "Over State Pension age",
    earningsBand:
      income >= thresholds.trigger
        ? "GBP 10,000 or more"
        : income > thresholds.lowerBand
          ? "GBP 6,241 to GBP 9,999"
          : "GBP 6,240 or below",
    route: routeView.label,
    nextStep,
    extraRoute,
  };
}

function getSmallPotRecords(state = appState) {
  return getEmploymentHistoryForState(state).filter(
    (record) => record.status !== "current" && toNumber(record.potValue) > 0 && record.pensionType !== "State-only"
  );
}

function buildPartnerProjectionSeries(partnerState, options = {}) {
  const monthlyRate = getProjectionMonthlyRate(appState);
  const years = Math.max(0, toNumber(partnerState.retireAge) - toNumber(partnerState.age));
  const months = years * 12;
  let pot = Math.max(0, toNumber(partnerState.currentPot));
  const points = [{ age: toNumber(partnerState.age), months: 0, pot }];

  for (let month = 1; month <= months; month += 1) {
    const contributionEscalationFactor = getContributionEscalationFactorForMonth(appState, month - 1);
    const baseMonthlyContribution = options.monthlyContributionForMonth
      ? Math.max(0, options.monthlyContributionForMonth(month - 1, partnerState))
      : Math.max(0, toNumber(partnerState.monthlyContribution));
    const monthlyContribution = baseMonthlyContribution * contributionEscalationFactor;
    pot = monthlyRate === 0 ? pot + monthlyContribution : pot * (1 + monthlyRate) + monthlyContribution;
    if (month % 12 === 0 || month === months) {
      points.push({ age: toNumber(partnerState.age) + month / 12, months: month, pot });
    }
  }

  return {
    years,
    months,
    points,
    projectedPot: pot,
  };
}

function calculatePartnerProjection(overrides = {}) {
  const partnerState = {
    ...createDefaultPartnerProfile(),
    ...(appState.partnerProfile || {}),
    ...overrides,
  };
  const series = buildPartnerProjectionSeries(partnerState, overrides.seriesOptions || {});
  const privateYearlyIncome = partnerState.pensionType === "State-only" ? 0 : series.projectedPot * (appState.drawdownPct / 100);
  const statePensionSummary = getStatePensionSummary(partnerState, partnerState.retireAge);
  const projectedYearlyIncome = privateYearlyIncome + statePensionSummary.yearlyIncome;
  const displayFactor = getDisplayMoneyFactor(appState, series.years);

  return {
    state: partnerState,
    years: series.years,
    projectedPot: partnerState.pensionType === "State-only" ? 0 : series.projectedPot,
    currentPrivateWealth: partnerState.pensionType === "State-only" ? 0 : Math.max(0, toNumber(partnerState.currentPot)),
    privateYearlyIncome,
    projectedYearlyIncome,
    displayProjectedYearlyIncome: projectedYearlyIncome * displayFactor,
    displayPrivateYearlyIncome: privateYearlyIncome * displayFactor,
    statePensionSummary,
    series: series.points,
    approximate: partnerState.pensionType !== "DC",
  };
}

function getHouseholdScenarioControlConfig(type = appState.householdGoal?.scenarioType) {
  const config = {
    none: { label: "Scenario value", value: 0, min: 0, max: 0, step: 1, hidden: true },
    "partner-retire-later": { label: "Years later", value: appState.householdGoal?.scenarioValue || 2, min: 1, max: 15, step: 1, hidden: false },
    "partner-pause-saving": { label: "Months paused", value: appState.householdGoal?.scenarioValue || 6, min: 1, max: 24, step: 1, hidden: false },
    "partner-lower-contributions": { label: "Lower partner saving %", value: appState.householdGoal?.scenarioValue || 25, min: 5, max: 100, step: 5, hidden: false },
    "both-raise-contributions": { label: "Extra saving each / month", value: appState.householdGoal?.scenarioValue || 100, min: 25, max: 1000, step: 25, hidden: false },
  };
  return config[type] || config.none;
}

function calculateHouseholdProjection(projection = calculateProjection()) {
  const enteredJointTargetYearly = toNumber(appState.householdGoal?.jointMonthlyIncome) * 12;
  const jointInflationFactor = getInflationFactor(appState, projection.years);
  const jointTargetYearly = enteredJointTargetYearly * jointInflationFactor;
  const displayJointTargetYearly = normalizeMoneyMode(appState.moneyMode) === "today" ? enteredJointTargetYearly : jointTargetYearly;
  if (!appState.partnerProfile?.enabled) {
    return {
      enabled: false,
      partnerProjection: null,
      enteredJointTargetYearly,
      jointTargetYearly,
      displayJointTargetYearly,
    };
  }

  const partnerProjection = calculatePartnerProjection();
  const projectedYearlyIncome = projection.projectedYearlyIncome + partnerProjection.projectedYearlyIncome;
  const displayProjectedYearlyIncome =
    (projection.displayProjectedYearlyIncome ?? projection.projectedYearlyIncome) +
    (partnerProjection.displayProjectedYearlyIncome ?? partnerProjection.projectedYearlyIncome);
  const projectedMonthlyIncome = projectedYearlyIncome / 12;
  const displayProjectedMonthlyIncome = displayProjectedYearlyIncome / 12;
  const gap = jointTargetYearly - projectedYearlyIncome;
  const displayGap = displayJointTargetYearly - displayProjectedYearlyIncome;

  return {
    enabled: true,
    partnerProjection,
    enteredJointTargetYearly,
    jointTargetYearly,
    displayJointTargetYearly,
    projectedYearlyIncome,
    displayProjectedYearlyIncome,
    projectedMonthlyIncome,
    displayProjectedMonthlyIncome,
    projectedPot: projection.projectedPot + partnerProjection.projectedPot,
    currentPrivateWealth: projection.currentPrivateWealth + partnerProjection.currentPrivateWealth,
    coverage: jointTargetYearly > 0 ? projectedYearlyIncome / jointTargetYearly : 0,
    gap,
    displayGap,
  };
}

function calculateHouseholdScenario(projection = calculateProjection()) {
  const household = calculateHouseholdProjection(projection);
  if (!household.enabled) return null;

  const type = appState.householdGoal?.scenarioType || "none";
  const value = Math.max(0, toNumber(appState.householdGoal?.scenarioValue));
  if (type === "none") return null;

  let label = "";
  let partnerProjection;
  let userProjection = projection;

  if (type === "partner-retire-later") {
    label = `Partner retires ${value} year${value === 1 ? "" : "s"} later`;
    partnerProjection = calculatePartnerProjection({
      retireAge: toNumber(appState.partnerProfile?.retireAge) + Math.max(1, value),
    });
  } else if (type === "partner-pause-saving") {
    label = `Partner pauses saving for ${value} month${value === 1 ? "" : "s"}`;
    partnerProjection = calculatePartnerProjection({
      seriesOptions: {
        monthlyContributionForMonth: (monthIndex, partnerState) => (monthIndex < Math.max(1, value) ? 0 : Math.max(0, toNumber(partnerState.monthlyContribution))),
      },
    });
  } else if (type === "partner-lower-contributions") {
    label = `Partner contributes ${formatPct(value)} less each month`;
    const multiplier = Math.max(0, 1 - value / 100);
    partnerProjection = calculatePartnerProjection({
      seriesOptions: {
        monthlyContributionForMonth: (_, partnerState) => Math.max(0, toNumber(partnerState.monthlyContribution) * multiplier),
      },
    });
  } else if (type === "both-raise-contributions") {
    label = `Both add ${formatMoney(value)} more per month`;
    partnerProjection = calculatePartnerProjection({
      seriesOptions: {
        monthlyContributionForMonth: (_, partnerState) => Math.max(0, toNumber(partnerState.monthlyContribution) + value),
      },
    });
    userProjection = calculateScenarioProjection(
      { ...createDefaultScenarioModel(), type: "split-savings", splitExtraMonthly: Math.max(25, value) },
      projection.state
    );
  }

  if (!partnerProjection) return null;

  const yearlyIncome = userProjection.projectedYearlyIncome + partnerProjection.projectedYearlyIncome;
  const displayYearlyIncome =
    (userProjection.displayProjectedYearlyIncome ?? userProjection.projectedYearlyIncome) +
    (partnerProjection.displayProjectedYearlyIncome ?? partnerProjection.projectedYearlyIncome);

  return {
    label,
    projectedYearlyIncome: yearlyIncome,
    displayProjectedYearlyIncome: displayYearlyIncome,
    projectedMonthlyIncome: yearlyIncome / 12,
    displayProjectedMonthlyIncome: displayYearlyIncome / 12,
    projectedPot: userProjection.projectedPot + partnerProjection.projectedPot,
    gap: household.jointTargetYearly - yearlyIncome,
    displayGap: household.displayJointTargetYearly - displayYearlyIncome,
    coverage: household.jointTargetYearly > 0 ? yearlyIncome / household.jointTargetYearly : 0,
    partnerProjection,
    userProjection,
  };
}

function getLifeEventGuide(type = appState.lifeEvent?.type) {
  const guides = {
    none: {
      title: "Pick a life event to narrow the checklist.",
      checks: [
        "Choose the event you want to plan for.",
        "Use the AI Assistant to ask the next practical question once the event is selected.",
      ],
      action: "No event selected yet.",
      documents: "Employment letters, pension statements and provider messages remain the core documents.",
      aiQuestion: "What should I check next based on my record?",
    },
    "starting-work": {
      title: "Check when enrolment starts and what pay counts.",
      checks: [
        "Check the joining letter and when the first contribution should appear.",
        "Confirm the pay basis and whether the employer uses qualifying earnings or another basis.",
      ],
      action: "Keep the first payslip, scheme letter and provider welcome pack together.",
      documents: "Offer letter, contract, first payslip, joining pack.",
      aiQuestion: "Am I likely to be automatically enrolled in this job?",
    },
    "changing-jobs": {
      title: "Treat the new job and old pots as separate decisions.",
      checks: [
        "Check the new employer's joining timeline and contribution basis.",
        "Do not consolidate old pots until charges, guarantees and transfer restrictions are checked.",
      ],
      action: "Keep the leaving statement from the old scheme and the joining letter for the new one.",
      documents: "P45, leaving statement, new joining pack, deferred-pot statements.",
      aiQuestion: "What should I check if I change jobs?",
    },
    "self-employed": {
      title: "Self-employed saving usually needs a flexible contribution plan.",
      checks: [
        "There is usually no automatic enrolment employer contribution.",
        "Use variable monthly saving and a stronger emergency buffer if income moves around.",
      ],
      action: "Set a baseline monthly pension amount and a second lower-income fallback amount.",
      documents: "Personal pension charges, tax-relief summary, income records.",
      aiQuestion: "How should I plan pension saving with irregular self-employed income?",
    },
    "parental-leave": {
      title: "Paid leave and unpaid leave can affect contributions differently.",
      checks: [
        "Check whether employer contributions stay linked to normal pay during paid leave.",
        "Check whether unpaid leave changes pension accrual or cover.",
      ],
      action: "Ask payroll for the leave-period pension calculation in writing.",
      documents: "Leave letter, payroll explanation, provider statement, cover wording.",
      aiQuestion: "What should I check during maternity or parental leave?",
    },
    sickness: {
      title: "Sickness can affect contributions, pay and death-in-service cover.",
      checks: [
        "Check what pension contributions are based on during sick pay.",
        "Check whether any death-in-service or insured cover changed while absent.",
      ],
      action: "Ask for the sick-pay pension basis and any cover change in writing.",
      documents: "Sick-pay letters, provider statements, insured-benefit wording.",
      aiQuestion: "What should I check if sickness or lower income affects my pension?",
    },
    divorce: {
      title: "Pension sharing and nominations may need review.",
      checks: [
        "Do not assume nomination forms or survivor wording still match the family position.",
        "Pension sharing, offsetting or earmarking can require specialist advice.",
      ],
      action: "Update nominations and keep any court/order documents with the pension record.",
      documents: "Court order, nomination form, provider statement, beneficiary wording.",
      aiQuestion: "What pension records should I review after divorce or separation?",
    },
    "approaching-retirement": {
      title: "Check access options before taking money out.",
      checks: [
        "Confirm the latest provider value, State Pension forecast and target income.",
        "Check whether drawdown, annuity, tax-free cash or scheme rules change the result.",
      ],
      action: "Use Pension Wise or regulated advice before major access decisions.",
      documents: "Retirement options pack, State Pension forecast, provider charges, beneficiary forms.",
      aiQuestion: "What should I check as I get close to retirement?",
    },
  };

  return guides[type] || guides.none;
}

function getActionPlanTasks(projection) {
  const tasks = [];
  if (projection.isBlocked) {
    tasks.push({
      severity: "critical",
      title: "Confirm the unknown arrangement first",
      copy: "No retirement projection is shown until the current Unknown record is reclassified as DC, DB, Hybrid or State Pension only.",
    });
    return tasks;
  }

  const adequacy = getAdequacyStatus(projection);
  const savings = getShortTermSavingsPlan(projection);
  const smallPots = getSmallPotRecords();
  const eligibility = getEligibilitySnapshot();
  const displayGap = projection.displayGap ?? projection.gap;

  if (displayGap > 0) {
    tasks.push({
      severity: adequacy.tone === "critical" ? "critical" : "warning",
      title: "Close the retirement goal gap",
      copy: `The current path is about ${formatMoney(displayGap / 12)} short per month. ${adequacy.strongestLever?.label || "Compare retire later and higher contributions"} currently gives the strongest modeled lift.`,
    });
  } else {
    tasks.push({
      severity: "",
      title: "Keep the target under review",
      copy: `The record is currently about ${formatMoney(Math.abs(displayGap / 12))} above the goal per month on these assumptions. Recheck after pay, provider or target changes.`,
    });
  }

  if (savings.bufferGap > 0) {
    tasks.push({
      severity: "warning",
      title: "Build the cash buffer",
      copy: `Emergency savings are ${formatMoney(savings.bufferGap)} below the entered cash target. A short shock could otherwise force a pension pause.`,
    });
  }

  if (smallPots.length) {
    const underTen = smallPots.filter((record) => toNumber(record.potValue) < 10000).length;
    tasks.push({
      severity: "",
      title: "Review deferred small pots",
      copy: `${underTen} deferred pot${underTen === 1 ? "" : "s"} are under GBP 10,000. Check charges, guarantees and transfer restrictions before consolidation.`,
    });
  }

  if (appState.mainConcern.includes("payslip") || appState.mainConcern.includes("contribution")) {
    tasks.push({
      severity: "warning",
      title: "Reconcile contributions",
      copy: "Ask payroll and the provider for a written month-by-month contribution reconciliation if the money shown still looks wrong.",
    });
  }

  if (eligibility.route !== "Automatic enrolment" && appState.employmentType !== "self") {
    tasks.push({
      severity: "",
      title: "Check the joining route",
      copy: `${eligibility.route}. Keep the request and any employer reply in writing.`,
    });
  }

  if (appState.partnerProfile?.enabled) {
    tasks.push({
      severity: "",
      title: "Review household nominations",
      copy: "Couple planning is enabled. Check survivor benefits, expression-of-wish forms and whether the joint goal still matches both retirement ages.",
    });
  }

  return tasks.slice(0, 4);
}

function renderShortTermSavingsSummary(projection) {
  if (!els.shortTermSavingsSummary) return;
  const savings = getShortTermSavingsPlan(projection);
  renderRows(els.shortTermSavingsSummary, [
    ["Current emergency savings", formatMoney(savings.currentSavings)],
    ["Emergency target", formatMoney(savings.emergencyTarget)],
    ["Gap to cash target", savings.bufferGap > 0 ? formatMoney(savings.bufferGap) : "Target already covered"],
  ]);
}

function renderCashPlanner(projection) {
  if (!els.cashPlannerList) return;
  const savings = getShortTermSavingsPlan(projection);
  renderRows(els.cashPlannerList, [
    ["Current cash savings", formatMoney(savings.currentSavings)],
    ["Cash target gap", savings.bufferGap > 0 ? formatMoney(savings.bufferGap) : "No current shortfall"],
    ["Flexible budget split", `${formatMoney(savings.monthlyCash)} to cash / ${formatMoney(savings.monthlyPensionFlex)} to pension`],
    ["Pause-saving effect", savings.pauseEffect > 0 ? `A ${savings.pauseMonths}-month pause cuts the projection by about ${formatMoney(savings.pauseEffect)} / month` : "No pause effect modelled"],
    ["Recovery view", savings.restartRecovery > 0 ? `Restarting with a slightly higher rate recovers about ${formatMoney(savings.restartRecovery)} / month versus a straight pause` : "Use the scenario modeller to test a restart plan"],
    ["Plain-English steer", savings.splitGuidance],
  ]);
}

function renderBenchmarkPanel(projection) {
  if (!els.benchmarkList) return;
  const showPanel = !projection.isBlocked && !projection.usesIncomeMix;
  if (els.goalStatusPanel) els.goalStatusPanel.hidden = !showPanel;
  if (!showPanel) {
    els.benchmarkList.innerHTML = "";
    syncGoalDetailGridVisibility();
    return;
  }

  const displayProjection = hasMixedHistoryGoalView(projection) ? getAgeSeriesDisplayProjection(projection) : projection;
  const householdMode = Boolean(appState.partnerProfile?.enabled);
  const benchmarkSet = getBenchmarkSet(householdMode);
  const comparisonIncome = householdMode
    ? calculateHouseholdProjection(displayProjection).displayProjectedYearlyIncome || displayProjection.displayProjectedYearlyIncome
    : displayProjection.displayProjectedYearlyIncome;
  const tier = getBenchmarkTier(comparisonIncome, benchmarkSet);
  const nextGap = tier.nextTarget ? Math.max(0, tier.nextTarget - comparisonIncome) : 0;
  const rows = [
    ["Goal status", getGoalProgressStatusCopy(displayProjection)],
    ["Projected total / month", formatMoney(comparisonIncome / 12)],
    ["Benchmark position", tier.label],
    ["Gap to next benchmark", tier.nextTarget ? formatMoney(nextGap) : "Already above the top benchmark used here"],
    ["Assumptions", getProjectionAssumptionCopy(displayProjection)],
  ];
  const estateNote = shouldSurfaceEstatePlanningNote(displayProjection) ? getPrivatePensionIhtShortNote(displayProjection) : "";
  if (estateNote) {
    rows.push(["Later-life tax note", estateNote]);
  }
  renderRows(els.benchmarkList, rows);
  syncGoalDetailGridVisibility();
}

function renderGoalPathwayPanel(projection) {
  if (!els.goalPathwayPanel || !els.goalPathwayList) return;
  const summary = getTailoredPathwaySummary(projection);
  els.goalPathwayPanel.hidden = !summary;
  if (!summary) {
    els.goalPathwayList.innerHTML = "";
    syncGoalDetailGridVisibility();
    return;
  }
  els.goalPathwayList.innerHTML = getTailoredPathwayPanelMarkup(summary, "goal");
  syncGoalDetailGridVisibility();
}

function renderDashboardPathwayPanel(projection) {
  if (!els.pathwayPanel || !els.pathwayList) return;
  const summary = getTailoredPathwaySummary(projection);
  const showPanel = Boolean(summary?.active);
  els.pathwayPanel.hidden = !showPanel;
  if (!showPanel) {
    els.pathwayList.innerHTML = "";
    return;
  }
  els.pathwayList.innerHTML = getTailoredPathwayPanelMarkup(summary, "dashboard");
}

function renderAssumptionPaths(projection = calculateProjection()) {
  if (!els.assumptionPathList) return;
  const layout = getGoalLayoutConfig(projection);
  if (els.assumptionPanel) els.assumptionPanel.hidden = !layout.showAssumptionPanel;
  if (projection.isBlocked || !layout.showAssumptionPanel) {
    els.assumptionPathList.innerHTML = "";
    return;
  }

  if (appState.targetMonthlyIncome <= 0) {
    els.assumptionPathList.innerHTML = `
      <div class="assumption-path-item">
        <div class="assumption-path-label">
          <strong>Enter a monthly goal first</strong>
          <span>The cautious, base and optimistic paths update as soon as the target is entered.</span>
        </div>
      </div>
    `;
    return;
  }

  const models = Object.keys(ASSUMPTION_PRESETS)
    .map((key) => buildAssumptionPathModel(key))
    .filter(Boolean);

  els.assumptionPathList.innerHTML = models
    .map(
      (item) => `
        <div class="assumption-path-item ${item.key === appState.assumptionPreset ? "active" : ""} ${item.showSuggestedChange ? "" : "no-change"}">
          <div class="assumption-path-label">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(formatPct(item.growthPct))} growth / ${escapeHtml(formatPct(item.drawdownPct))} withdrawal</span>
          </div>
	          <div class="assumption-path-metric">
	            <span>Projected income</span>
	            <strong>${escapeHtml(formatMoney(item.displayProjectedMonthlyIncome))} / month</strong>
	          </div>
          <div class="assumption-path-metric">
            <span>Total pension saving needed</span>
            <strong>${escapeHtml(formatMoney(item.requiredMonthly))} / month</strong>
          </div>
          ${
            item.showSuggestedChange
              ? `
                <div class="assumption-path-metric">
                  <span>Suggested change</span>
                  <strong>${escapeHtml(item.actionValue)}</strong>
                </div>
              `
              : ""
          }
        </div>
      `
    )
	    .join("");
}

function estimateEmployeeTakeHomeCost(grossMonthly = 0, state = appState) {
  const gross = Math.max(0, toNumber(grossMonthly));
  const marginalTax = Math.min(45, Math.max(0, toNumber(state.marginalTaxPct))) / 100;
  const ni = Math.min(12, Math.max(0, toNumber(state.employeeNiPct))) / 100;
  const mode = normalizeTaxReliefMode(state.taxReliefMode);
  if (mode === "salary-sacrifice") {
    return Math.max(0, gross * (1 - marginalTax - ni));
  }
  if (mode === "relief-at-source") {
    return gross * 0.8;
  }
  return Math.max(0, gross * (1 - marginalTax));
}

function getTaxReliefNote(state = appState) {
  const mode = normalizeTaxReliefMode(state.taxReliefMode);
  if (mode === "salary-sacrifice") return "Estimated after tax and employee NI saving; must not reduce pay below legal minimums.";
  if (mode === "relief-at-source") return "Shows basic 20% provider relief; higher/additional-rate relief may need a separate claim.";
  return "Estimated through payroll before income tax; employee NI usually still applies.";
}

function renderAssumptionDetails(projection) {
  if (!els.assumptionDetailList || !els.dataConfidenceList) return;
  const layout = getGoalLayoutConfig(projection);
  if (projection.isBlocked || !layout.showAssumptionPanel) {
    els.assumptionDetailList.innerHTML = "";
    els.dataConfidenceList.innerHTML = "";
    return;
  }
  const current = getCurrentEmploymentRecord();
  const monthlyTakeHomeCost = estimateEmployeeTakeHomeCost(projection.employeeMonthly, projection.state);
  const rows = [
    ["Money view", projection.moneyMode === "today" ? "Today's money" : "Nominal at retirement"],
    ["Inflation assumption", `${formatPct(projection.state.inflationPct)} / year`],
    ["Net growth after charges", `${formatPct(projection.netGrowthPct)} / year`],
    ["Salary / contribution growth", `${formatPct(projection.state.salaryGrowthPct)} salary / ${formatPct(projection.state.contributionEscalationPct)} contribution`],
    ["Estimated take-home cost", `${formatMoney(monthlyTakeHomeCost)} / month`],
    ["Tax relief note", getTaxReliefNote(projection.state)],
  ];
  renderRows(els.assumptionDetailList, rows);

  const confidenceRows = [
    ["Current pot", toNumber(current?.potValue) > 0 ? "User-entered provider/statement value" : "Not entered"],
    ["Contribution basis", current?.pensionablePayBasis === "unknown" ? "Unknown: check payslip/provider" : `User-entered ${current?.pensionablePayBasis}`],
    ["State Pension", projection.hasStatePensionForecast ? "User-entered official forecast" : "Not entered"],
    ["DB amount", projection.dbSummary?.hasDb ? "User-entered scheme statement value" : "Not used"],
    ["Projection", "Modelled from visible assumptions"],
  ];
  renderRows(els.dataConfidenceList, confidenceRows);
}

function getHousingStatusLabel(value) {
  const labels = {
    unknown: "Not entered",
    "owned-outright": "Own outright",
    mortgage: "Mortgage",
    renting: "Renting",
    shared: "Shared household costs",
  };
  return labels[normalizeHousingStatus(value)] || labels.unknown;
}

function renderAdequacyFactors(projection) {
  if (!els.adequacyFactorList) return;
  const factors = { ...createDefaultLifeFactors(), ...(appState.lifeFactors || {}) };
  const flags = [];
  if (normalizeHousingStatus(factors.housingStatus) === "renting") flags.push("Rent in retirement can raise the target materially.");
  if (toNumber(factors.monthlyHousingCost) > 0) flags.push(`${formatMoney(toNumber(factors.monthlyHousingCost))} housing cost should be reflected in the monthly goal.`);
  if (normalizeDebtPressure(factors.debtPressure) === "high") flags.push("High debt pressure points to a cash/debt plan before aggressive pension increases.");
  if (toNumber(factors.dependants) > 0) flags.push("Dependants make survivor cover and emergency savings more important.");
  if (normalizeSurvivorNeed(factors.survivorNeed) === "high") flags.push("High survivor need: check nomination, death benefits and partner income.");
  renderRows(els.adequacyFactorList, [
    ["Housing", getHousingStatusLabel(factors.housingStatus)],
    ["Monthly housing cost", formatMoney(toNumber(factors.monthlyHousingCost))],
    ["Debt pressure", normalizeDebtPressure(factors.debtPressure)],
    ["Dependants", String(Math.max(0, toNumber(factors.dependants)))],
    ["Survivor need", normalizeSurvivorNeed(factors.survivorNeed)],
    ["Planning flag", flags.length ? flags.join(" ") : "No extra adequacy pressure entered."],
  ]);
}

function renderHouseholdPlanning(projection) {
  if (
    !els.householdPlanningDetails ||
    !els.householdGoalList ||
    !els.householdScenarioList ||
    !els.householdScenarioTypeInput ||
    !els.householdScenarioValueInput ||
    !els.householdScenarioLabel
  ) {
    return;
  }

  const enabled = Boolean(appState.partnerProfile?.enabled);
  els.householdPlanningDetails.hidden = !enabled;
  if (els.householdIntroCopy) {
    const partnerApproximate = appState.partnerProfile?.pensionType && appState.partnerProfile.pensionType !== "DC";
    els.householdIntroCopy.textContent = enabled
      ? projection.isBlocked
        ? "Household planning stays paused until your own record has a confirmed arrangement type. Partner figures remain approximate whenever the partner pension is not pure DC."
        : partnerApproximate
          ? "Household planning is on. The partner side is still approximate because the partner pension is not pure DC."
          : "Household planning is on. Compare your record with your partner's details and track the joint retirement target here."
      : "Add a spouse or partner only if you want a joint retirement view based on both pension records.";
  }

  const config = getHouseholdScenarioControlConfig();
  els.householdScenarioLabel.textContent = config.label;
  els.householdScenarioTypeInput.disabled = Boolean(!enabled || projection.isBlocked);
  els.householdScenarioValueInput.min = String(config.min);
  els.householdScenarioValueInput.max = String(config.max);
  els.householdScenarioValueInput.step = String(config.step);
  els.householdScenarioValueInput.value = String(config.value);
  els.householdScenarioValueInput.disabled = Boolean(config.hidden || !enabled || projection.isBlocked);

  const household = calculateHouseholdProjection(projection);
  if (!household.enabled) {
    return;
  }

  if (projection.isBlocked) {
    renderRows(els.householdGoalList, [
      ["Household status", "Paused until your arrangement is confirmed"],
      ["Reason", getProjectionBlockerCopy(projection)],
      ["Partner note", appState.partnerProfile?.pensionType === "DC" ? "Partner side is ready once your own record is resolved." : "Partner side remains approximate because the partner pension is not pure DC."],
    ]);
    renderRows(els.householdScenarioList, [
      ["Household scenario", "Unavailable while your own arrangement is unresolved"],
      ["Next step", "Confirm your current arrangement in Pension Record first."],
    ]);
    return;
  }

  renderRows(els.householdGoalList, [
    ["Your projected income / month", formatMoney((projection.displayProjectedYearlyIncome ?? projection.projectedYearlyIncome) / 12)],
    [
      "Partner projected income / month",
      formatMoney((household.partnerProjection.displayProjectedYearlyIncome ?? household.partnerProjection.projectedYearlyIncome) / 12),
    ],
    ["Combined projected income / month", formatMoney(household.displayProjectedMonthlyIncome ?? household.projectedMonthlyIncome)],
    ["Joint goal / month", formatMoney((household.displayJointTargetYearly ?? household.jointTargetYearly) / 12)],
    [
      "Combined gap / month",
      (household.displayGap ?? household.gap) > 0
        ? `${formatMoney((household.displayGap ?? household.gap) / 12)} short`
        : `${formatMoney(Math.abs((household.displayGap ?? household.gap) / 12))} above`,
    ],
    ["Household note", household.partnerProjection.approximate ? "Partner projection is an approximation because the partner pension is not pure DC." : "Both sides are using the same simple pot-growth model."],
  ]);

  const householdScenario = calculateHouseholdScenario(projection);
  if (!householdScenario) {
    renderRows(els.householdScenarioList, [
      ["Household scenario", "No household comparison selected"],
      ["What to test", "Use this for a partner retirement-age change, a pause, lower saving or both adding more."],
    ]);
    return;
  }

  const currentHousehold = calculateHouseholdProjection(projection);
  const monthlyDiff =
    (householdScenario.displayProjectedMonthlyIncome ?? householdScenario.projectedMonthlyIncome) -
    (currentHousehold.displayProjectedMonthlyIncome ?? currentHousehold.projectedMonthlyIncome);
  renderRows(els.householdScenarioList, [
    ["Scenario tested", householdScenario.label],
    ["Scenario projected income / month", formatMoney(householdScenario.displayProjectedMonthlyIncome ?? householdScenario.projectedMonthlyIncome)],
    ["Change vs current household path", `${monthlyDiff >= 0 ? "+" : "-"}${formatMoney(Math.abs(monthlyDiff))} / month`],
    ["Scenario projected pot", formatProjectionMoney(projection, householdScenario.projectedPot)],
    [
      "Scenario gap / month",
      (householdScenario.displayGap ?? householdScenario.gap) > 0
        ? `${formatMoney((householdScenario.displayGap ?? householdScenario.gap) / 12)} short`
        : `${formatMoney(Math.abs((householdScenario.displayGap ?? householdScenario.gap) / 12))} above`,
    ],
  ]);
}

function getPensionValue(pension) {
  if (pension.value === "state") return `${formatMoney(appState.statePension)} / yr`;
  if (pension.valueType === "db-income" && typeof pension.value === "number") return `${formatMoney(pension.value)} / yr`;
  if (typeof pension.value === "number") return formatMoney(pension.value);
  return "Not entered";
}

function getPensionTags(pension) {
  return (pension.notes || []).map((note) => {
    let tone = "";
    if (note.includes("Small")) tone = "amber";
    if (note.includes("Deferred")) tone = "rose";
    if (note.includes("Current")) tone = "green";
    return { label: note, tone };
  });
}

function renderPots() {
  els.potList.innerHTML = getConnectedPensions()
    .map((pension) => {
      const tags = getPensionTags(pension)
        .map((tag) => `<span class="tag ${tag.tone}">${escapeHtml(tag.label)}</span>`)
        .join("");
      return `
        <div class="pot-row">
          <div class="pot-main">
            <strong>${escapeHtml(pension.name)}</strong>
            <p>${escapeHtml(pension.provider)} - ${escapeHtml(pension.source)} - ${escapeHtml(pension.status)}</p>
            <div class="pot-tags">${tags}</div>
          </div>
          <div class="pot-value">${getPensionValue(pension)}</div>
        </div>
      `;
    })
    .join("");
}

function renderManualPensionId() {
  renderEmploymentHistoryEditor();
}

function getCompactGoalStatusLine(projection) {
  if (!projection.hasGoal) return "Enter a monthly goal to measure the result.";
  if (projection.dbSummary.hasDb && projection.dbSummary.nextStartAge && projection.dbYearlyIncome === 0) {
    return `DB income starts at age ${projection.dbSummary.nextStartAge}.`;
  }
  if (projection.hasPreviousDbHistory && projection.previousDbSummary.nextStartAge && projection.previousDbYearlyIncome === 0) {
    return `Previous DB income starts at age ${projection.previousDbSummary.nextStartAge}.`;
  }
  if (projection.currentType === "State-only" && projection.statePensionSummary && !projection.statePensionSummary.included) {
    return `State Pension starts at age ${projection.statePensionSummary.startAge}.`;
  }
  if (projection.currentType === "State-only" && !projection.hasDcAssets && !projection.hasDbSource) {
    return "Using the State Pension forecast only.";
  }
  const gap = projection.displayGap ?? projection.gap;
  return gap > 0
    ? `${formatMoney(gap / 12)} short / month`
    : `${formatMoney(Math.abs(gap) / 12)} above / month`;
}

function getArrangementResultLabel(projection) {
  if (projection.currentType === "DB") return "Projected DB income";
  if (projection.currentType === "Hybrid") return "Projected hybrid income";
  if (projection.currentType === "State-only") return "Projected State Pension";
  return "Projected current income";
}

function getArrangementGoalStatusLine(projection, yearlyIncome) {
  if (!projection.hasGoal) return "Enter a monthly goal to measure the result.";
  const segments = getProjectionIncomeSegments(projection);
  const pendingSegment = segments.find((segment) => segment.value === 0 && segment.displayValue.startsWith("Starts at age"));
  const comparableIncome = displayYearlyIncome(projection, yearlyIncome);
  const gap = (projection.displayTargetYearlyIncome ?? projection.targetYearlyIncome) - comparableIncome;
  if (pendingSegment && yearlyIncome <= 0) return `${pendingSegment.label} ${pendingSegment.displayValue.toLowerCase()}.`;
  if (pendingSegment && gap > 0) {
    return `${formatMoney(gap / 12)} short / month before ${pendingSegment.label.toLowerCase()} starts.`;
  }
  return gap > 0
    ? `${formatMoney(gap / 12)} short / month`
    : `${formatMoney(Math.abs(gap / 12))} above / month`;
}

function getPendingIncomeSegment(segments) {
  return segments.find((segment) => segment.startsLater && segment.annualAtStart > 0) || null;
}

function getIncomeMixHeadlineText(projection, segments, yearlyIncome) {
  const pendingSegment = getPendingIncomeSegment(segments);
  if (yearlyIncome > 0) {
    return `${getArrangementResultLabel(projection)} ${formatProjectionMoney(projection, yearlyIncome / 12)} / month`;
  }
  if (pendingSegment) {
    return `${pendingSegment.label} starts at age ${pendingSegment.startAge}`;
  }
  const missingSegment = segments.find((segment) => segment.isMissing);
  if (missingSegment) {
    return `Add ${missingSegment.label.toLowerCase()} amount`;
  }
  return `${getArrangementResultLabel(projection)} not started`;
}

function formatGapFromYearlyIncome(projection, yearlyIncome) {
  if (!projection.hasGoal) return "Enter goal first";
  const comparableIncome = displayYearlyIncome(projection, yearlyIncome);
  const gap = (projection.displayTargetYearlyIncome ?? projection.targetYearlyIncome) - comparableIncome;
  return gap > 0
    ? `${formatMoney(gap / 12)} short`
    : `${formatMoney(Math.abs(gap / 12))} above`;
}

function getDbCalculationRows(projection) {
  const current = getCurrentEmploymentRecord(projection.state);
  const details = getDbIncomeDetails(current, projection.state, projection.state.retireAge);
  const annual = details.annual;
  const schemeAge = details.schemeAge;
  const selectedAge = projection.state.retireAge;
  const monthly = annual / 12;
  const rows = [
    ["DB formula", "Scheme rules: pensionable salary x pensionable service x accrual rate"],
    ["Who sets it", "The scheme/employer rules and pension statement set the promised DB amount"],
  ];

  if (projection.state.meta?.starterMode === "example-db") {
    rows.push([
      "Illustrative demo assumption",
      "Common DB examples often use around 1/60 accrual, but this app uses the entered annual statement amount for the actual result.",
    ]);
  }

  if (details.enteredAnnual > 0 && schemeAge) {
    rows.push(["Entered DB amount", `${formatMoney(details.enteredAnnual)} / year`]);
    rows.push(["Amount basis", details.basis === "current-deferred" ? "Current deferred amount, revalued to scheme age" : "Statement amount at scheme age"]);
    if (details.basis === "current-deferred") {
      rows.push(["Revalued to scheme age", `${formatMoney(details.amountAtSchemeAge)} using ${formatPct(details.revaluationPct)} / year`]);
    }
    if (details.indexationPct > 0 || details.adjustmentPct !== 0) {
      rows.push(["DB adjustment assumptions", `${formatPct(details.indexationPct)} indexation / ${formatPct(details.adjustmentPct)} early-late factor`]);
    }
    rows.push(["App calculation", `${formatMoney(annual)} / year / 12 = ${formatMoney(monthly)} / month`]);
    rows.push([
      "Selected age",
      details.included
        ? `Age ${selectedAge}: ${formatMoney(monthly)} / month`
        : `Age ${selectedAge}: not payable yet; starts at age ${schemeAge}`,
    ]);
    if (projection.hasGoal) {
      const gap =
        (projection.displayTargetYearlyIncome ?? projection.targetYearlyIncome) -
        displayYearlyIncome(projection, annual + projection.stateYearlyIncome);
      rows.push([
        "Goal status from DB plus State Pension",
        gap > 0 ? `${formatMoney(gap / 12)} short / month` : `${formatMoney(Math.abs(gap / 12))} above / month`,
      ]);
    }
  } else {
    rows.push(["App calculation", "Enter the annual DB pension at scheme age from the pension statement"]);
    rows.push(["Selected age", "DB amount not ready until the statement amount and scheme age are entered"]);
  }

  return rows;
}

function getStatePensionCalculationRows(projection) {
  const annual = Math.max(0, toNumber(projection.state.statePension));
  const startAge = normalizeStatePensionAge(projection.state.statePensionAge);
  const selectedAge = projection.state.retireAge;
  const monthly = annual / 12;
  const rows = [
    ["State Pension basis", "UK State Pension forecast built from qualifying National Insurance years and government forecast rules"],
    ["Who sets it", "Government rules and the official State Pension forecast service set the forecast amount and State Pension age"],
    ["10-year rule", `Usually no new State Pension under ${STATE_PENSION_MIN_QUALIFYING_YEARS} qualifying years; about ${formatPreciseMoney(getSimpleStatePensionWeeklyForYears(10))} / week at ${STATE_PENSION_MIN_QUALIFYING_YEARS} years in the simple post-2016 example.`],
    ["35-year rule", `The full new State Pension rate is ${formatPreciseMoney(FULL_NEW_STATE_PENSION_WEEKLY_2026_27)} / week in 2026/27. A simple post-2016 record usually needs ${STATE_PENSION_FULL_RATE_YEARS} qualifying years for that full rate.`],
    ["Between 10 and 34 years", `Simple illustration: about 1/35 of the full weekly rate for each qualifying year, so the amount rises proportionally between ${STATE_PENSION_MIN_QUALIFYING_YEARS} and ${STATE_PENSION_FULL_RATE_YEARS} years.`],
    ["Claiming", "The new State Pension is not paid automatically. You have to claim it when you reach State Pension age."],
  ];

  getStatePensionIllustrationRows().forEach(([label, value]) => rows.push([label, value]));
  rows.push(["Important exception", "Contracted-out or pre-2016 National Insurance records can produce a different result, so the official forecast always overrides this simple illustration."]);

  if (annual > 0) {
    rows.push(["App calculation", `${formatMoney(annual)} / year / 12 = ${formatMoney(monthly)} / month`]);
    rows.push([
      "Selected age",
      selectedAge >= startAge
        ? `Age ${selectedAge}: ${formatMoney(monthly)} / month`
        : `Age ${selectedAge}: not payable yet; starts at age ${startAge}`,
    ]);
    if (projection.hasGoal) {
      const gap =
        (projection.displayTargetYearlyIncome ?? projection.targetYearlyIncome) -
        displayYearlyIncome(projection, annual);
      rows.push([
        "Goal status from State Pension age",
        gap > 0 ? `${formatMoney(gap / 12)} short / month` : `${formatMoney(Math.abs(gap / 12))} above / month`,
      ]);
    }
  } else {
    rows.push(["App calculation", "Enter the annual State Pension forecast from the official forecast service"]);
    rows.push(["Selected age", "State Pension amount not ready until a forecast and State Pension age are entered"]);
  }

  return rows;
}

function getIncomeMixProjectionRows(projection) {
  const rows = [];
  const segments = getProjectionIncomeSegments(projection);
  const currentArrangementYearlyIncome = segments.reduce((sum, segment) => sum + segment.value, 0);
  const pendingSegment = getPendingIncomeSegment(segments);

  segments.forEach((segment) => {
    rows.push([segment.label, segment.displayValue]);
  });

  if (currentArrangementYearlyIncome > 0) {
    rows.push([getArrangementResultLabel(projection), `${formatProjectionMoney(projection, currentArrangementYearlyIncome / 12)} / month`]);
  } else if (pendingSegment) {
    rows.push([`Amount from age ${pendingSegment.startAge}`, `${formatProjectionMoney(projection, pendingSegment.annualAtStart / 12, pendingSegment.startAge)} / month`]);
  } else {
    rows.push([getArrangementResultLabel(projection), "Not ready"]);
  }

  if (projection.hasGoal && pendingSegment && currentArrangementYearlyIncome === 0) {
    rows.push([
      "Goal status",
      `Starts age ${pendingSegment.startAge}; ${formatGapFromYearlyIncome(projection, pendingSegment.annualAtStart)} from then`,
    ]);
  } else {
    rows.push(["Goal status", getArrangementGoalStatusLine(projection, currentArrangementYearlyIncome)]);
  }

  if (projection.currentType === "DB") {
    rows.push(["Source basis", "Current DB record only."]);
  } else if (projection.currentType === "Hybrid") {
    rows.push(["Source basis", "Current hybrid record only: DB side plus DC side."]);
  } else if (projection.currentType === "State-only") {
    rows.push(["Source basis", "Current State Pension record only."]);
  }

  return rows;
}

function hasMixedHistoryGoalView(projection) {
  return projection.currentType === "DC" && projection.hasPreviousDbHistory;
}

function getProjectionAgeSeriesRange(projection, scenarioProjection = null) {
  const futureAges = [
    projection.state.retireAge,
    scenarioProjection?.state?.retireAge || projection.state.retireAge,
  ];
  if (projection.hasPreviousDbHistory) {
    futureAges.push(projection.previousDbSummary?.nextStartAge);
  }
  if (projection.hasStatePensionForecast) {
    futureAges.push(projection.statePensionSummary?.startAge);
  }
  const maxAge = Math.max(
    projection.state.age + 1,
    ...futureAges.map((age) => Math.round(toNumber(age))).filter((age) => age > 0)
  );
  return {
    minAge: Math.round(toNumber(projection.state.age)),
    maxAge,
  };
}

function getProjectionAgeSeriesSelectedAge(projection, scenarioProjection = null) {
  const { minAge, maxAge } = getProjectionAgeSeriesRange(projection, scenarioProjection);
  const selectedAge = Number.isFinite(appState.projectionInspectorAge)
    ? appState.projectionInspectorAge
    : projection.state.retireAge;
  return Math.min(Math.max(Math.round(selectedAge), minAge), maxAge);
}

function getAgeSeriesDisplayProjection(projection) {
  if (!hasMixedHistoryGoalView(projection)) return projection;
  const selectedAge = getProjectionAgeSeriesSelectedAge(projection);
  appState.projectionInspectorAge = selectedAge;
  return selectedAge === projection.state.retireAge ? projection : calculateProjection({ retireAge: selectedAge });
}

function formatPreviousDbSupplementValue(projection) {
  if (projection.previousDbYearlyIncome > 0) {
    return `${formatProjectionMoney(projection, projection.previousDbYearlyIncome / 12)} / month`;
  }
  if (projection.previousDbSummary?.nextStartAge) {
    return `Starts at age ${projection.previousDbSummary.nextStartAge}`;
  }
  return "No previous DB promise entered";
}

function formatMixedStatePensionValue(projection) {
  if (!projection.hasStatePensionForecast) return "";
  if (projection.stateYearlyIncome > 0) {
    return `${formatProjectionMoney(projection, projection.stateYearlyIncome / 12)} / month`;
  }
  if (projection.statePensionSummary?.annual > 0) {
    return `Starts at age ${projection.statePensionSummary.startAge}`;
  }
  return "No forecast entered";
}

function getNextMixedHistoryStartAge(projection) {
  const selectedAge = projection.state.retireAge;
  const ages = [];
  if (projection.previousDbSummary?.nextStartAge && projection.previousDbSummary.nextStartAge > selectedAge) {
    ages.push(projection.previousDbSummary.nextStartAge);
  }
  if (
    projection.hasStatePensionForecast &&
    projection.statePensionSummary?.annual > 0 &&
    projection.statePensionSummary.startAge > selectedAge
  ) {
    ages.push(projection.statePensionSummary.startAge);
  }
  return ages.length ? Math.min(...ages) : null;
}

function getMixedHistoryGoalStatus(projection) {
  if (!projection.hasGoal) return "Enter a monthly goal to measure the result.";
  const gap = projection.displayGap ?? projection.gap;
  return gap > 0
    ? `${formatMoney(gap / 12)} short / month`
    : `${formatMoney(Math.abs(gap / 12))} above / month`;
}

function getMixedHistoryGoalRows(projection, { includeComparisonAge = false, includeProjectedPot = true } = {}) {
  const rows = [["Monthly goal", formatMonthlyGoalValue(projection)]];
  if (includeComparisonAge) {
    rows.push(["Comparison age", `Age ${projection.state.retireAge}`]);
  }
  rows.push(["Previous DB income", formatPreviousDbSupplementValue(projection)]);
  if (projection.hasStatePensionForecast) {
    rows.push(["State Pension", formatMixedStatePensionValue(projection)]);
  }
  rows.push(["Projected DC income / month", `${formatProjectionMoney(projection, projection.dcProjectedYearlyIncome / 12)} / month`]);
  rows.push(["Projected combined income / month", `${formatProjectionMoney(projection, projection.projectedYearlyIncome / 12)} / month`]);
  const nextStartAge = getNextMixedHistoryStartAge(projection);
  if (nextStartAge) {
    const laterProjection = calculateProjection({ retireAge: nextStartAge });
    rows.push([`Combined from age ${nextStartAge}`, `${formatProjectionMoney(laterProjection, laterProjection.projectedYearlyIncome / 12)} / month`]);
  }
  rows.push(["Goal status", getMixedHistoryGoalStatus(projection)]);
  if (includeProjectedPot) {
    rows.push(["Projected pot", formatProjectionMoney(projection, projection.projectedPot)]);
  }
  return rows;
}

function renderGoalTracker(projection) {
  if (projection.isBlocked) {
    renderRows(els.goalTrackerList, [
      ["Arrangement", getPlanLabel(projection.currentType)],
      ["Projection status", "Blocked until scheme type is confirmed"],
      ["Current record", "Unknown"],
      ["Next step", "Replace the current Unknown arrangement in Pension Record first"],
      ["Reason", getProjectionBlockerCopy(projection)],
    ]);
    return;
  }

  if (projection.currentType === "DC") {
    if (hasMixedHistoryGoalView(projection)) {
      renderRows(els.goalTrackerList, getMixedHistoryGoalRows(getAgeSeriesDisplayProjection(projection)));
      return;
    }
    const privateYearlyIncome = projection.privateYearlyIncome;
    const rows = [
      ["Monthly goal", formatMonthlyGoalValue(projection)],
      ["Projected DC income / month", formatProjectionMoney(projection, privateYearlyIncome / 12)],
    ];
    if (projection.hasStatePensionForecast) {
      rows.push(["State Pension", formatStatePensionProjectionValue(projection)]);
      rows.push(["Projected combined income / month", formatProjectionMoney(projection, projection.projectedYearlyIncome / 12)]);
    }
    rows.push(
      [
        "Coverage of goal",
        projection.hasGoal
          ? `${Math.round((projection.displayProjectedYearlyIncome / (projection.displayTargetYearlyIncome || projection.targetYearlyIncome)) * 100)}%`
          : "Enter goal first",
      ],
      ["Gap to goal / month", formatGapFromYearlyIncome(projection, projection.projectedYearlyIncome)],
      ["Projected pot", formatProjectionMoney(projection, projection.projectedPot)]
    );
    renderRows(els.goalTrackerList, rows);
    return;
  }

  const displayProjection = getIncomeMixDisplayProjection(projection);
  const rows = [
    ["Monthly goal", formatMonthlyGoalValue(displayProjection)],
    ["Comparison age", `Age ${displayProjection.state.retireAge}`],
  ];
  getIncomeMixProjectionRows(displayProjection)
    .filter(([label]) => label !== "Source basis")
    .forEach((row) => rows.push(row));
  renderRows(els.goalTrackerList, rows);
}

function renderScenarioModeler(projection) {
  if (!els.scenarioTypeInput || !els.scenarioPrimaryInput || !els.scenarioPrimaryLabel || !els.scenarioSummaryList) return;
  const layout = getGoalLayoutConfig(projection);
  ensureScenarioState();
  if (els.scenarioPanel) els.scenarioPanel.hidden = !layout.showScenarioPanel;
  if (!layout.showScenarioPanel) {
    if (els.scenarioBlockedState) els.scenarioBlockedState.hidden = true;
    if (els.scenarioInputGrid) els.scenarioInputGrid.hidden = true;
    if (els.scenarioSummaryList) els.scenarioSummaryList.hidden = true;
    els.scenarioSummaryList.innerHTML = "";
    return;
  }
  if (els.scenarioBlockedState) els.scenarioBlockedState.hidden = true;
  if (els.scenarioInputGrid) els.scenarioInputGrid.hidden = false;
  if (els.scenarioSummaryList) els.scenarioSummaryList.hidden = false;
  if (els.scenarioIntroCopy) els.scenarioIntroCopy.textContent = layout.scenarioIntro;
  els.scenarioTypeInput.disabled = false;
  const config = getScenarioControlConfig(appState.scenarioModel.type);
  els.scenarioTypeInput.value = appState.scenarioModel.type;
  els.scenarioPrimaryLabel.textContent = config.label;
  els.scenarioPrimaryInput.min = String(config.min);
  els.scenarioPrimaryInput.max = String(config.max);
  els.scenarioPrimaryInput.step = String(config.step);
  els.scenarioPrimaryInput.value = String(config.value);
  els.scenarioPrimaryInput.disabled = Boolean(config.hidden);

  const scenarioProjection = getActiveScenarioProjection(projection);
  if (!scenarioProjection) {
    renderRows(els.scenarioSummaryList, [
      ["Scenario", "No comparison selected"],
      ["What this does", "Choose a scenario above to compare the current path with one changed assumption."],
      ["Best use", "Use it for retire-later, higher contributions, pause-saving, restart-after-pause, lower-earnings or split-savings illustrations."],
    ]);
    return;
  }

  const scenarioMonthly = scenarioProjection.displayProjectedYearlyIncome / 12;
  const currentMonthly = projection.displayProjectedYearlyIncome / 12;
  const monthlyDiff = scenarioMonthly - currentMonthly;
  const potDiff = scenarioProjection.projectedPot - projection.projectedPot;
  renderRows(els.scenarioSummaryList, [
    ["Scenario tested", scenarioProjection.label],
    ["Scenario projected income / month", formatMoney(scenarioMonthly)],
    ["Change vs current path", `${monthlyDiff >= 0 ? "+" : "-"}${formatMoney(Math.abs(monthlyDiff))} per month`],
    ["Scenario projected pot", formatProjectionMoney(scenarioProjection, scenarioProjection.projectedPot)],
    ["Pot difference", `${potDiff >= 0 ? "+" : "-"}${formatProjectionMoney(projection, Math.abs(potDiff))}`],
    ["Short-term choice", scenarioProjection.shortEffect],
  ]);
}

function renderProjectionStatusRow(label, value) {
  if (!els.projectionStatusRow) return;
  els.projectionStatusRow.hidden = false;
  els.projectionStatusRow.innerHTML = `
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value)}</strong>
  `;
}

function getDcInvestmentAccessLabel(value) {
  const labels = {
    default: "Default",
    "workplace-self-select": "Workplace self-select",
    sipp: "SIPP",
  };
  return labels[value] || labels.default;
}

function getDcInvestmentStyleLabel(value) {
  const labels = {
    aggressive: "Aggressive",
    balanced: "Balanced",
    conservative: "Conservative",
  };
  return labels[value] || labels.balanced;
}

function normalizeAllocationModel(baseAllocation) {
  const entries = Object.entries(baseAllocation).map(([key, value]) => [key, Math.max(0, Math.round(value))]);
  let total = entries.reduce((sum, [, value]) => sum + value, 0);
  if (total === 0) return Object.fromEntries(entries);
  while (total !== 100) {
    const key = total > 100 ? "bonds" : "globalEquity";
    const currentValue = entries.find(([entryKey]) => entryKey === key);
    if (!currentValue) break;
    currentValue[1] += total > 100 ? -1 : 1;
    total = entries.reduce((sum, [, value]) => sum + value, 0);
  }
  return Object.fromEntries(entries);
}

function buildSelfSelectInvestingModel(projection) {
  if (!supportsDcInvestmentSettings(projection.currentType)) return null;
  const access = getCurrentRecordDcInvestmentAccess();
  const style = getCurrentRecordDcInvestmentStyle();
  const horizonYears = Math.max(0, toNumber(appState.retireAge) - toNumber(appState.age));
  const gapMonthly = projection.hasGoal ? (projection.displayGap ?? projection.gap) / 12 : 0;
  let allocation = {
    aggressive: { globalEquity: 55, ukEquity: 15, bonds: 20, cash: 5, property: 5 },
    balanced: { globalEquity: 45, ukEquity: 10, bonds: 30, cash: 10, property: 5 },
    conservative: { globalEquity: 30, ukEquity: 5, bonds: 45, cash: 15, property: 5 },
  }[style];

  if (horizonYears >= 20) {
    allocation = { ...allocation, globalEquity: allocation.globalEquity + 5, bonds: allocation.bonds - 5 };
  } else if (horizonYears <= 10) {
    allocation = {
      ...allocation,
      globalEquity: allocation.globalEquity - 8,
      ukEquity: allocation.ukEquity - 2,
      bonds: allocation.bonds + 7,
      cash: allocation.cash + 3,
    };
  }

  if (projection.hasGoal && gapMonthly > 0 && horizonYears >= 12) {
    if (style === "conservative") {
      allocation = {
        ...allocation,
        globalEquity: allocation.globalEquity + 4,
        bonds: allocation.bonds - 2,
        cash: allocation.cash - 2,
      };
    } else {
      allocation = { ...allocation, globalEquity: allocation.globalEquity + 5, bonds: allocation.bonds - 5 };
    }
  } else if (projection.hasGoal && gapMonthly <= 0 && horizonYears < 12) {
    allocation = {
      ...allocation,
      globalEquity: allocation.globalEquity - 4,
      bonds: allocation.bonds + 2,
      cash: allocation.cash + 2,
    };
  }

  allocation = normalizeAllocationModel(allocation);

  const tiltCopy =
    horizonYears >= 15 && gapMonthly > 0
      ? "Longer runway with a remaining gap points to a growth-leaning mix within your selected style."
      : horizonYears <= 10
        ? "Shorter runway points to more ballast in bonds and cash within your selected style."
        : "This keeps a broad-market core while staying within your selected style.";

  const examples =
    access === "default"
      ? [
          {
            title: "Default fund check",
            primary: "Check the default fund's factsheet, equity/bond mix, charges, and whether it moves into lower-risk assets near retirement.",
            secondary: "If it broadly matches your risk style and horizon, staying in the default can be a reasonable low-maintenance route.",
          },
          {
            title: "Charge and lifestyling check",
            primary: "Compare the annual charge with other scheme options and check whether lifestyling fits drawdown, annuity, or cash plans.",
            secondary: "A default designed for annuity purchase may not fit someone planning flexible drawdown.",
          },
        ]
      : access === "workplace-self-select"
	      ? [
          {
            title: "Global equity",
            primary: "Look first for a low-cost global developed-world or global all-cap equity index fund in the scheme menu.",
            secondary: "Secondary illustrations: MSCI World, FTSE All-World, or global all-cap index funds and ETFs.",
          },
          {
            title: "UK equity",
            primary: "Use a broad UK equity index fund only as a smaller home-bias sleeve if the menu offers one.",
            secondary: "Secondary illustrations: FTSE All-Share or FTSE 100 index options.",
          },
          {
            title: "Bonds and cash",
            primary: "Look for high-quality bond index funds, gilt funds, short-duration bond funds, and money-market or cash funds.",
            secondary: "Secondary illustrations: global aggregate bond index funds, UK gilt index funds, and short-term cash funds.",
          },
          {
            title: "Property / REITs",
            primary: "Use only a small diversifier sleeve if the scheme offers a property or listed real-assets fund.",
            secondary: "Secondary illustrations: diversified property securities or global REIT index options.",
          },
        ]
      : [
          {
            title: "Global equity",
            primary: "Keep the core in broad-market global index funds rather than single-country or thematic funds.",
            secondary:
              "Illustrations: Vanguard FTSE Global All Cap Index Fund, Vanguard FTSE All-World ETF, or iShares Core MSCI World UCITS ETF.",
          },
          {
            title: "UK equity",
            primary: "Use only a modest UK sleeve if you want home-market exposure.",
            secondary: "Illustrations: FTSE All-Share or FTSE 100 index funds and ETFs.",
          },
          {
            title: "Bonds and cash",
            primary: "Anchor the lower-risk side with broad investment-grade bond index funds, gilts, and cash or money-market funds.",
            secondary: "Illustrations: global bond index funds, gilt ETFs, and short-term money-market funds.",
          },
          {
            title: "Property / REITs",
            primary: "Keep any property sleeve diversified and small.",
            secondary: "Illustrations: global property securities or developed-markets REIT funds and ETFs.",
          },
        ];

  return {
	    access,
	    style,
	    summaryRows: [
	      ["Current age", `${appState.age}`],
	      ["Retirement horizon", `${horizonYears} year${horizonYears === 1 ? "" : "s"}`],
	      ["Access", getDcInvestmentAccessLabel(access)],
	      ["Style", getDcInvestmentStyleLabel(style)],
	      ["Risk category", style === "aggressive" ? "Higher volatility / higher growth aim" : style === "conservative" ? "Lower volatility / more ballast" : "Balanced growth and ballast"],
	      ["Goal gap", projection.hasGoal ? getCompactGoalStatusLine(projection) : "Enter a monthly goal to size the gap"],
	      ["Illustrative tilt", tiltCopy],
	      ["Assistant link", "Ask the AI Assistant what to check; this prototype uses built-in guidance rules, not live personalised fund advice."],
	    ],
    allocationRows: [
      ["Global equity", `${allocation.globalEquity}%`],
      ["UK equity", `${allocation.ukEquity}%`],
      ["Bonds", `${allocation.bonds}%`],
      ["Cash", `${allocation.cash}%`],
      ["Property / REITs", `${allocation.property}%`],
    ],
	    examplesSummary:
	      access === "default"
	        ? "Default fund checks"
	        : access === "workplace-self-select"
	        ? "Example fund types to look for first"
	        : "Example broad-market funds and ETFs",
	    exampleCopy:
	      access === "default"
	        ? "This keeps the function practical without pushing the user into self-selecting funds. Ask the AI Assistant what to check before changing the default."
	        : access === "workplace-self-select"
	        ? "Start with the scheme menu's lowest-cost diversified fund types. The AI Assistant can explain the checks in plain English; named funds and ETFs are only secondary illustrations."
	        : "Keep the core broad, diversified, and low-cost. The AI Assistant can explain the checks in plain English; examples are illustrations, not personal recommendations.",
    examples,
    disclaimer:
      "Built-in demo guidance only. This is not regulated financial advice or a personal recommendation. A live version could connect to provider and market-data APIs before showing personalised guidance.",
  };
}

function renderSelfSelectPanel(projection) {
  if (!els.selfSelectPanel || !els.selfSelectAllocationList || !els.selfSelectSummaryList || !els.selfSelectExampleList) return;
  const model = buildSelfSelectInvestingModel(projection);
  if (!model) {
    els.selfSelectPanel.hidden = true;
    els.selfSelectAllocationList.innerHTML = "";
    els.selfSelectSummaryList.innerHTML = "";
    els.selfSelectExampleList.innerHTML = "";
    if (els.selfSelectHintPanel) els.selfSelectHintPanel.hidden = true;
    return;
  }

  if (els.selfSelectHintPanel) els.selfSelectHintPanel.hidden = true;
  els.selfSelectPanel.hidden = false;
  if (els.investmentAccessInput) els.investmentAccessInput.value = model.access;
  if (els.investmentStyleInput) els.investmentStyleInput.value = model.style;
  if (els.selfSelectPanelSummary) els.selfSelectPanelSummary.textContent = "DC investment guide";
  if (els.selfSelectIntroCopy) {
    els.selfSelectIntroCopy.textContent =
      model.access === "default"
        ? "Default-fund route: use the checks below first. You can also ask the AI Assistant what to check before changing funds."
        : model.access === "workplace-self-select"
          ? "Workplace self-select route: use broad fund categories first, then ask the AI Assistant for plain-English checks."
          : "SIPP route: use broad fund categories first, then ask the AI Assistant for plain-English checks. Named examples are illustrations only.";
  }
  if (els.selfSelectExamplesSummary) els.selfSelectExamplesSummary.textContent = model.examplesSummary;
  if (els.selfSelectExampleCopy) els.selfSelectExampleCopy.textContent = model.exampleCopy;
  if (els.selfSelectDisclaimer) els.selfSelectDisclaimer.textContent = model.disclaimer;
  renderRows(els.selfSelectAllocationList, model.allocationRows);
  renderRows(els.selfSelectSummaryList, model.summaryRows);
  els.selfSelectExampleList.innerHTML = model.examples
    .map(
      (example) => `
        <div class="follow-up-item">
          <strong>${escapeHtml(example.title)}</strong>
          <p>${escapeHtml(example.primary)}</p>
          <p>${escapeHtml(example.secondary)}</p>
        </div>
      `
    )
    .join("");
}

function getProjectionPointAtAge(projection, age) {
  const points = projection?.series || [];
  if (!points.length) return { point: null, ended: true };
  const withinRange = age <= points[points.length - 1].age;
  const eligible = withinRange ? points.filter((point) => point.age <= age) : points;
  return {
    point: eligible.length ? eligible[eligible.length - 1] : points[0],
    ended: !withinRange,
  };
}

function getIncomeMixAgeRange(projection) {
  const startAges = [projection.state.retireAge];
  if (projection.hasStatePensionForecast || projection.currentType === "State-only") {
    startAges.push(projection.statePensionSummary?.startAge);
  }
  if (hasDbArrangementComponent(projection.currentType)) {
    startAges.push(...(projection.dbSummary?.entries || []).map((entry) => entry.schemeAge));
  }
  const validStartAges = startAges.map((age) => toNumber(age)).filter((age) => age > 0);
  const minAge = Math.round(toNumber(projection.state.age));
  const maxAge = Math.max(minAge + 1, ...validStartAges);
  return { minAge, maxAge };
}

function getIncomeMixSelectedAge(projection) {
  const { minAge, maxAge } = getIncomeMixAgeRange(projection);
  const defaultAge = Math.min(Math.max(Math.round(toNumber(projection.state.retireAge)), minAge), maxAge);
  const candidate = toNumber(appState.projectionInspectorAge);
  const selected =
    appState.incomeMixAgeTouched || (candidate > minAge && candidate <= maxAge)
      ? candidate
      : defaultAge;
  return Math.min(Math.max(Math.round(selected), minAge), maxAge);
}

function getIncomeMixDisplayProjection(projection) {
  const selectedAge = getIncomeMixSelectedAge(projection);
  appState.projectionInspectorAge = selectedAge;
  return selectedAge === projection.state.retireAge ? projection : calculateProjection({ retireAge: selectedAge });
}

function createIncomeSegment({ key, label, value, displayValue, swatchClass, status, note, ...extra }) {
  const safeValue = Math.max(0, toNumber(value));
  return {
    key,
    label,
    value: safeValue,
    monthlyValue: safeValue / 12,
    displayValue,
    swatchClass,
    status,
    note,
    ...extra,
  };
}

function getCurrentDbIncomeSegment(projection, current) {
  const details = getDbIncomeDetails(current, projection.state, projection.state.retireAge);
  const schemeAge = details.schemeAge;
  const displayValue = details.enteredAnnual <= 0
    ? "No statement amount entered"
    : details.startsLater
      ? `Starts at age ${schemeAge}`
      : `${formatProjectionMoney(projection, details.annual / 12)} / month`;
  const status = details.enteredAnnual <= 0
    ? "Add DB statement amount"
    : details.startsLater
      ? `Starts at age ${schemeAge}`
      : details.basis === "current-deferred"
        ? "Revalued DB estimate"
        : "Scheme statement income";
  const note = details.enteredAnnual <= 0
    ? "No annual DB pension amount has been entered for the current record."
    : details.startsLater
      ? `This DB pension is not counted yet because the selected comparison age is before the scheme pension age of ${schemeAge}.`
      : "This DB pension uses the entered amount plus any DB revaluation, indexation or early/late factor entered in the record.";
  return createIncomeSegment({
    key: "db",
    label: "DB pension",
    value: details.annual,
    displayValue,
    swatchClass: "db",
    status,
    note,
    startAge: schemeAge,
    annualAtStart: details.amountAtSchemeAge,
    startsLater: details.startsLater,
    isMissing: details.enteredAnnual <= 0,
  });
}

function projectCurrentRecordDcYearlyIncome(projection, current) {
  if (!current || !isProjectedDcArrangement(current.pensionType)) return 0;
  const years = Math.max(0, projection.state.retireAge - projection.state.age);
  const months = years * 12;
  const pot = Math.max(0, toNumber(current.potValue));
  let projectedPot = pot;
  const isCurrentRecord = current.status === "current";
  const monthlyRate = getProjectionMonthlyRate(projection.state);

  for (let month = 1; month <= months; month += 1) {
    const salaryGrowthFactor = getAnnualFactor(Math.max(0, toNumber(projection.state.salaryGrowthPct)), (month - 1) / 12);
    const contributionEscalationFactor = getContributionEscalationFactorForMonth(projection.state, month - 1);
    const annualContributionBase = isCurrentRecord
      ? getContributionBaseForPayBasis(
          projection.state.salary * salaryGrowthFactor,
          projection.state.pensionablePayBasis
        )
      : 0;
    const monthlyContributionBase = annualContributionBase / 12;
    const monthlyContribution = isCurrentRecord
      ? monthlyContributionBase *
        ((projection.state.employerContributionPct + projection.state.employeeContributionPct) / 100) *
        contributionEscalationFactor
      : 0;
    projectedPot = monthlyRate === 0 ? projectedPot + monthlyContribution : projectedPot * (1 + monthlyRate) + monthlyContribution;
  }
  return projectedPot * (projection.state.drawdownPct / 100);
}

function getCurrentDcIncomeSegment(projection, current) {
  const projectedAnnual = projectCurrentRecordDcYearlyIncome(projection, current);
  return createIncomeSegment({
    key: "dc",
    label: projection.currentType === "Hybrid" ? "DC side" : "DC income",
    value: projectedAnnual,
    displayValue: `${formatProjectionMoney(projection, projectedAnnual / 12)} / month`,
    swatchClass: "dc",
    status: "Projected from current DC pot",
    note: "This DC income is projected from the current record's DC pot, net-growth, charge and contribution assumptions.",
  });
}

function getStatePensionIncomeSegment(projection) {
  const hasStateForecast = projection.statePensionSummary.annual > 0;
  return createIncomeSegment({
    key: "state",
    label: "State Pension",
    value: projection.statePensionSummary.yearlyIncome,
    displayValue: projection.statePensionSummary.included
      ? `${formatProjectionMoney(projection, projection.statePensionSummary.yearlyIncome / 12)} / month`
      : hasStateForecast
        ? `Starts at age ${projection.statePensionSummary.startAge}`
        : "No forecast entered",
    swatchClass: "state",
    status: projection.statePensionSummary.included
      ? "Government forecast counted"
      : hasStateForecast
        ? `Starts at age ${projection.statePensionSummary.startAge}`
        : "No forecast entered",
    note: projection.statePensionSummary.included
      ? "This uses the entered annual State Pension forecast because the selected comparison age has reached State Pension age."
      : hasStateForecast
        ? `This State Pension forecast is not counted yet because it starts at age ${projection.statePensionSummary.startAge}.`
        : "No State Pension forecast has been entered yet.",
    startAge: projection.statePensionSummary.startAge,
    annualAtStart: projection.statePensionSummary.annual,
    startsLater: hasStateForecast && !projection.statePensionSummary.included,
    isMissing: !hasStateForecast,
  });
}

function getProjectionIncomeSegments(projection) {
  const segments = [];
  const current = getCurrentEmploymentRecord(projection.state);
  if (projection.currentType === "DB") {
    segments.push(getCurrentDbIncomeSegment(projection, current));
  } else if (projection.currentType === "Hybrid") {
    segments.push(getCurrentDbIncomeSegment(projection, current));
    segments.push(getCurrentDcIncomeSegment(projection, current));
  } else if (projection.currentType === "State-only") {
    segments.push(getStatePensionIncomeSegment(projection));
  } else if (projection.hasDcAssets || projection.dcProjectedYearlyIncome > 0) {
    segments.push(getCurrentDcIncomeSegment(projection, current));
  }
  if (projection.currentType !== "State-only" && projection.hasStatePensionForecast) {
    segments.push(getStatePensionIncomeSegment(projection));
  }
  return segments;
}

function getDefaultProjectionSegmentKey(projection) {
  const segments = getProjectionIncomeSegments(projection);
  return segments.find((segment) => segment.value > 0)?.key || segments[0]?.key || "state";
}

function renderProjectionInspector(projection) {
  if (!els.projectionAgeInput || !els.projectionFocusCopy || !els.projectionDetailList || !els.projectionLegend || !els.projectionStatusRow) return;
  if (els.projectionBlockedState) els.projectionBlockedState.hidden = !projection.isBlocked;
  if (els.projectionChart) els.projectionChart.hidden = projection.isBlocked;
  if (els.projectionInteraction) els.projectionInteraction.hidden = projection.isBlocked;
  if (els.projectionLegend) els.projectionLegend.hidden = projection.isBlocked;
  if (els.projectionDetailList) els.projectionDetailList.hidden = projection.isBlocked;
  if (els.projectionStatusRow) els.projectionStatusRow.hidden = projection.isBlocked;

  if (projection.isBlocked) {
    if (els.projectionTitle) els.projectionTitle.textContent = "Projection paused until the arrangement is confirmed";
    if (els.projectionBadge) els.projectionBadge.textContent = "No projection shown";
    if (els.projectionBlockedCopy) els.projectionBlockedCopy.textContent = getProjectionBlockerCopy(projection);
    if (els.projectionChart) els.projectionChart.style.cursor = "default";
    return;
  }

  if (projection.usesIncomeMix) {
    const displayProjection = getIncomeMixDisplayProjection(projection);
    const { minAge, maxAge } = getIncomeMixAgeRange(projection);
    const selectedAge = displayProjection.state.retireAge;
    if (els.projectionTitle) {
      els.projectionTitle.textContent =
        projection.currentType === "DB"
          ? "DB pension calculation basis"
          : projection.currentType === "Hybrid"
            ? "Projected hybrid pension result"
            : "State Pension calculation basis";
    }
    if (els.projectionBadge) {
      els.projectionBadge.textContent = getProjectionMixBadge(projection);
    }
    if (els.projectionChart) {
      els.projectionChart.setAttribute("aria-label", `${els.projectionTitle?.textContent || "Projected retirement income"} chart`);
      els.projectionChart.style.cursor = "pointer";
    }
    if (els.projectionScrubber) els.projectionScrubber.hidden = false;
	  els.projectionAgeInput.min = String(minAge);
	  els.projectionAgeInput.max = String(maxAge);
	  els.projectionAgeInput.step = "1";
	  els.projectionAgeInput.value = String(selectedAge);
	  const segments = getProjectionIncomeSegments(displayProjection);
	  if (els.projectionChart) {
	    els.projectionChart.classList.add("income-mix-chart");
	    els.projectionChart.classList.remove("age-series-chart");
	    els.projectionChart.classList.toggle("single-source-chart", segments.length <= 1);
	  }
	  const selectedKey = segments.some((segment) => segment.key === appState.projectionInspectorSegment)
	    ? appState.projectionInspectorSegment
      : getDefaultProjectionSegmentKey(displayProjection);
    appState.projectionInspectorSegment = selectedKey;
    const selectedSegment = segments.find((segment) => segment.key === selectedKey) || segments[0];
    renderProjectionStatusRow("Selected age", `Age ${selectedAge} - ${selectedSegment.label}: ${selectedSegment.status}`);
    els.projectionLegend.hidden = true;
    els.projectionLegend.innerHTML = "";
    if (projection.currentType === "DB" || projection.currentType === "State-only") {
      if (els.projectionChart) {
        els.projectionChart.hidden = true;
        els.projectionChart.classList.remove("income-mix-chart", "single-source-chart", "age-series-chart");
      }
      if (els.projectionFocusCopy) {
        els.projectionFocusCopy.textContent =
          projection.currentType === "DB"
            ? `Use the age slider or left and right arrow keys to compare DB ages. Current selection: age ${selectedAge}. ${selectedSegment.note}`
            : `Use the age slider or left and right arrow keys to compare State Pension ages. Current selection: age ${selectedAge}. ${selectedSegment.note}`;
      }
      renderRows(
        els.projectionDetailList,
        projection.currentType === "DB" ? getDbCalculationRows(displayProjection) : getStatePensionCalculationRows(displayProjection)
      );
      return;
    }
    if (els.projectionFocusCopy) {
      els.projectionFocusCopy.textContent = `Use the age slider or left and right arrow keys to compare ages. Use up and down arrow keys to move between sources where there is more than one. Current selection: ${selectedSegment.label} at age ${selectedAge}. ${selectedSegment.note}`;
    }
    renderRows(els.projectionDetailList, getIncomeMixProjectionRows(displayProjection));
    return;
  }
	  ensureScenarioState();
	  if (els.projectionTitle) els.projectionTitle.textContent = "Projected DC pot result";
	  if (els.projectionBadge) {
	    els.projectionBadge.textContent = getProjectionMixBadge(projection);
	  }
	  if (els.projectionChart) {
	    els.projectionChart.setAttribute("aria-label", "Projected cumulative pension wealth chart");
	    els.projectionChart.style.cursor = "crosshair";
	    els.projectionChart.classList.add("age-series-chart");
	    els.projectionChart.classList.remove("income-mix-chart", "single-source-chart");
	  }
  if (els.projectionFocusCopy) {
    els.projectionFocusCopy.textContent = hasMixedHistoryGoalView(projection)
      ? "Use the slider or left and right arrow keys to compare ages. The chart stays DC-led while the result rows add any previous DB promise and the entered State Pension forecast separately."
      : "Use the slider or left and right arrow keys to inspect the projected pot path year by year.";
  }
  if (els.projectionScrubber) els.projectionScrubber.hidden = false;
  els.projectionLegend.hidden = false;
  const scenarioProjection = getActiveScenarioProjection(projection);
  const { minAge, maxAge } = getProjectionAgeSeriesRange(projection, scenarioProjection);
  const selectedAge = getProjectionAgeSeriesSelectedAge(projection, scenarioProjection);
  appState.projectionInspectorAge = selectedAge;
  const displayProjection = hasMixedHistoryGoalView(projection)
    ? selectedAge === projection.state.retireAge
      ? projection
      : calculateProjection({ retireAge: selectedAge })
    : projection;

  els.projectionAgeInput.min = String(minAge);
  els.projectionAgeInput.max = String(maxAge);
  els.projectionAgeInput.step = "1";
  els.projectionAgeInput.value = String(selectedAge);
  renderProjectionStatusRow("Selected age", `Age ${selectedAge}`);

  const currentPoint = getProjectionPointAtAge(projection, selectedAge);
  const scenarioPoint = scenarioProjection ? getProjectionPointAtAge(scenarioProjection, selectedAge) : null;
  const detailRows = [
    [
      "Current path at this age",
      currentPoint.ended ? `Current path ends at age ${projection.state.retireAge}` : formatProjectionMoney(projection, currentPoint.point?.pot || 0, selectedAge),
    ],
  ];

  if (scenarioProjection) {
    detailRows.push([
      "Scenario path at this age",
      scenarioPoint?.ended
        ? `Scenario path ends at age ${scenarioProjection.state.retireAge}`
        : formatProjectionMoney(scenarioProjection, scenarioPoint?.point?.pot || 0, selectedAge),
    ]);
    if (!currentPoint.ended && !scenarioPoint?.ended) {
      const difference = (scenarioPoint?.point?.pot || 0) - (currentPoint.point?.pot || 0);
      detailRows.push(["Difference at this age", `${difference >= 0 ? "+" : "-"}${formatProjectionMoney(projection, Math.abs(difference), selectedAge)}`]);
    }
  }

  detailRows.push(["Target pot line", formatProjectionMoney(displayProjection, displayProjection.targetPot)]);
  if (hasMixedHistoryGoalView(displayProjection)) {
    getMixedHistoryGoalRows(displayProjection, { includeComparisonAge: true, includeProjectedPot: false }).forEach((row) => detailRows.push(row));
    if (displayProjection.hasStatePensionForecast) {
      detailRows.push(["State Pension note", `${getStatePensionQualificationNote(displayProjection.state)} You have to claim it.`]);
    }
    if (shouldSurfaceEstatePlanningNote(displayProjection)) {
      detailRows.push(["Estate / IHT note", getPrivatePensionIhtLongNote(displayProjection)]);
    }
  } else {
    if (projection.hasStatePensionForecast) {
      detailRows.push(["Projected DC income / month", formatProjectionMoney(projection, projection.privateYearlyIncome / 12)]);
      detailRows.push(["State Pension", formatStatePensionProjectionValue(projection)]);
      detailRows.push(["Projected combined income / month", formatProjectionMoney(projection, projection.projectedYearlyIncome / 12)]);
      detailRows.push(["State Pension note", `${getStatePensionQualificationNote(projection.state)} You have to claim it.`]);
    } else {
      detailRows.push(["Projected DC income / month", formatProjectionMoney(projection, projection.projectedYearlyIncome / 12)]);
    }
    if (projection.hasGoal) {
      detailRows.push(["Monthly goal", formatMonthlyGoalValue(projection)]);
      detailRows.push(["Gap to goal / month", formatGapToGoalValue(projection)]);
    } else {
      detailRows.push(["Monthly goal", formatMonthlyGoalValue(projection)]);
    }
    if (shouldSurfaceEstatePlanningNote(displayProjection) && getPrivatePensionIhtLongNote(displayProjection)) {
      detailRows.push(["Estate / IHT note", getPrivatePensionIhtLongNote(displayProjection)]);
    }
  }
  if (scenarioProjection) {
    detailRows.push(["Projected scenario income / month", formatMoney(scenarioProjection.displayProjectedYearlyIncome / 12)]);
  }
  renderRows(els.projectionDetailList, detailRows);

  const legendItems = [
    `<span class="projection-legend-item"><span class="projection-legend-swatch"></span>Current path</span>`,
  ];
  if (scenarioProjection) {
    legendItems.push(
      `<span class="projection-legend-item"><span class="projection-legend-swatch scenario"></span>${escapeHtml(scenarioProjection.label)}</span>`
    );
  }
  legendItems.push(`<span class="projection-legend-item">Dashed line: target pot</span>`);
  els.projectionLegend.innerHTML = legendItems.join("");
}

function updateProjectionSegmentFocus(segmentKey) {
  const projection = calculateProjection();
  const displayProjection = projection.usesIncomeMix ? getIncomeMixDisplayProjection(projection) : projection;
  const validKeys = getProjectionIncomeSegments(displayProjection).map((segment) => segment.key);
  if (!validKeys.includes(segmentKey)) return;
  appState.projectionInspectorSegment = segmentKey;
  renderProjectionInspector(projection);
  drawProjection(projection);
}

function updateProjectionFocus(age) {
  const projection = calculateProjection();
  if (projection.usesIncomeMix) {
    const { minAge, maxAge } = getIncomeMixAgeRange(projection);
    const nextAge = Math.min(Math.max(Math.round(age), minAge), maxAge);
    appState.projectionInspectorAge = nextAge;
    appState.incomeMixAgeTouched = true;
    renderGoalTracker(projection);
    renderBenchmarkPanel(projection);
    renderProjectionInspector(projection);
    drawProjection(projection);
    return;
  }
  const scenarioProjection = getActiveScenarioProjection(projection);
  const { minAge, maxAge } = getProjectionAgeSeriesRange(projection, scenarioProjection);
  const nextAge = Math.min(Math.max(Math.round(age), minAge), maxAge);
  appState.projectionInspectorAge = nextAge;
  renderGoalTracker(projection);
  renderBenchmarkPanel(projection);
  renderProjectionInspector(projection);
  drawProjection(projection);
}

function getProjectionAgeFromClientX(clientX) {
  if (!els.projectionChart || !projectionCanvasMeta || projectionCanvasMeta.mode !== "age-series") return null;
  const rect = els.projectionChart.getBoundingClientRect();
  if (!rect.width || projectionCanvasMeta.chartW <= 0) return null;
  const relativeX = clientX - rect.left;
  const clampedX = Math.min(
    Math.max(relativeX, projectionCanvasMeta.pad.left),
    rect.width - projectionCanvasMeta.pad.right
  );
  const ratio = (clampedX - projectionCanvasMeta.pad.left) / projectionCanvasMeta.chartW;
  return projectionCanvasMeta.minAge + ratio * projectionCanvasMeta.ageSpan;
}

function getProjectionIncomeMixAgeFromClientX(clientX) {
  if (!els.projectionChart || !projectionCanvasMeta || projectionCanvasMeta.mode !== "income-mix") return null;
  const rect = els.projectionChart.getBoundingClientRect();
  if (!rect.width) return null;
  const ageStartX = projectionCanvasMeta.ageStartX ?? 0;
  const ageEndX = projectionCanvasMeta.ageEndX ?? rect.width;
  const minAge = projectionCanvasMeta.minAge ?? appState.age;
  const maxAge = projectionCanvasMeta.maxAge ?? appState.retireAge;
  if (maxAge <= minAge || ageEndX <= ageStartX) return minAge;
  const relativeX = clientX - rect.left;
  const clampedX = Math.min(Math.max(relativeX, ageStartX), ageEndX);
  const ratio = (clampedX - ageStartX) / (ageEndX - ageStartX);
  return minAge + ratio * (maxAge - minAge);
}

function updateProjectionIncomeMixFromClientPoint(clientX, clientY) {
  const segment = getProjectionSegmentFromClientPoint(clientX, clientY);
  if (segment) {
    appState.projectionInspectorSegment = segment.key;
  }
  const age = getProjectionIncomeMixAgeFromClientX(clientX);
  if (age == null) {
    const projection = calculateProjection();
    renderProjectionInspector(projection);
    drawProjection(projection);
    return;
  }
  updateProjectionFocus(age);
}

function getProjectionSegmentFromClientPoint(clientX, clientY) {
  if (!els.projectionChart || !projectionCanvasMeta || projectionCanvasMeta.mode !== "income-mix") return null;
  const rect = els.projectionChart.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const relativeX = clientX - rect.left;
  const relativeY = clientY - rect.top;
  return (
    projectionCanvasMeta.segments.find(
      (segment) =>
        relativeX >= segment.startX &&
        relativeX <= segment.endX &&
        relativeY >= segment.startY &&
        relativeY <= segment.endY
    ) || null
  );
}

function drawProjectionIncomeMix(projection, ctx, width, height) {
  const segments = getProjectionIncomeSegments(projection);
  const focusedKey = segments.some((segment) => segment.key === appState.projectionInspectorSegment)
    ? appState.projectionInspectorSegment
    : getDefaultProjectionSegmentKey(projection);
  appState.projectionInspectorSegment = focusedKey;

  const compact = width < 560;
  const rowGap = compact ? 12 : 14;
  const rowHeight = compact ? 54 : 58;
  const cardX = 14;
  const cardW = width - cardX * 2;
  const labelPad = Math.max(72, Math.min(116, width * 0.2));
  const valuePad = Math.max(92, Math.min(126, width * 0.22));
  const pad = {
    top: compact ? 92 : 76,
    left: cardX + labelPad + 14,
    right: valuePad + 22,
    bottom: 36,
  };
  const chartLeft = pad.left;
  const chartRight = width - pad.right;
  const chartW = Math.max(96, chartRight - chartLeft);
  const chartTop = pad.top;
  const chartBottom = chartTop + segments.length * rowHeight + Math.max(0, segments.length - 1) * rowGap;
  const monthlyGoal = Math.max(0, projection.targetYearlyIncome / 12);
  const monthlyTotal = segments.reduce((sum, segment) => sum + Math.max(0, segment.monthlyValue || 0), 0);
  const yearlyTotal = monthlyTotal * 12;
  const scaleMax = Math.max(monthlyGoal, monthlyTotal, ...segments.map((segment) => segment.monthlyValue || 0), 500) * 1.08;

  const colorMap = {
    db: "#0f625e",
    dc: "#171717",
    state: "#b6781f",
  };

  ctx.fillStyle = "#5e6964";
  ctx.font = "700 12px 'IBM Plex Sans', 'Avenir Next', sans-serif";
  ctx.fillText(`At comparison age ${projection.state.retireAge}`, 18, 24);

  ctx.fillStyle = "#171717";
  ctx.font = `${compact ? "700 14px" : "700 15px"} 'IBM Plex Sans', 'Avenir Next', sans-serif`;
  ctx.fillText(getIncomeMixHeadlineText(projection, segments, yearlyTotal), 18, 48);

  if (projection.hasGoal) {
    ctx.fillStyle = "#5e6964";
    ctx.font = "700 12px 'IBM Plex Sans', 'Avenir Next', sans-serif";
    if (compact) {
      ctx.fillText(`Goal ${formatMonthlyGoalValue(projection)} / month`, 18, 68);
    } else {
      ctx.textAlign = "right";
      ctx.fillText(`Goal ${formatMonthlyGoalValue(projection)} / month`, width - 18, 24);
      ctx.textAlign = "left";
    }
  }

  const tickCount = compact ? 2 : 4;
  ctx.fillStyle = "#67625b";
  ctx.font = "11px 'IBM Plex Sans', 'Avenir Next', sans-serif";
  ctx.strokeStyle = "#e5e2da";
  ctx.lineWidth = 1;
  const tickLabelY = Math.min(height - 16, chartBottom + 28);
  for (let i = 0; i <= tickCount; i += 1) {
    const x = chartLeft + (chartW / tickCount) * i;
    ctx.beginPath();
    ctx.moveTo(x, chartTop - 4);
    ctx.lineTo(x, chartBottom + 6);
    ctx.stroke();
    const label = formatProjectionMoney(projection, (scaleMax * i) / tickCount);
    ctx.textAlign = i === tickCount ? "right" : i === 0 ? "left" : "center";
    ctx.fillText(label, x, tickLabelY);
  }
  ctx.textAlign = "left";

  if (projection.hasGoal && monthlyGoal > 0) {
    const goalX = chartLeft + (monthlyGoal / scaleMax) * chartW;
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = "rgba(18, 18, 18, 0.42)";
    ctx.beginPath();
    ctx.moveTo(goalX, chartTop - 8);
    ctx.lineTo(goalX, chartBottom + 6);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "#3f3c36";
    ctx.font = "700 11px 'IBM Plex Sans', 'Avenir Next', sans-serif";
    ctx.fillText("Goal", Math.min(width - 44, goalX + 6), chartTop - 12);
  }

  const segmentMeta = [];
  segments.forEach((segment, index) => {
    const rowY = chartTop + index * (rowHeight + rowGap);
    const trackY = rowY + (compact ? 28 : 30);
    const trackHeight = 16;
    const barWidth = scaleMax > 0 ? (Math.max(0, segment.monthlyValue || 0) / scaleMax) * chartW : 0;
    const color = colorMap[segment.key] || "#171717";
    const isFocused = segment.key === focusedKey;
    const startsLater = segment.displayValue.startsWith("Starts at age");

    ctx.fillStyle = isFocused ? "#f7faf8" : "#ffffff";
    ctx.strokeStyle = isFocused ? color : "#dfddd6";
    ctx.lineWidth = isFocused ? 1.6 : 1;
    ctx.beginPath();
    ctx.roundRect(cardX, rowY, cardW, rowHeight, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#171717";
    ctx.font = `${compact ? "700 11px" : "700 12px"} 'IBM Plex Sans', 'Avenir Next', sans-serif`;
    ctx.fillText(segment.label, cardX + 12, rowY + 18);

    ctx.textAlign = "right";
    ctx.fillStyle = startsLater ? "#5e6964" : "#171717";
    ctx.font = `${compact ? "700 11px" : "700 12px"} 'IBM Plex Sans', 'Avenir Next', sans-serif`;
    ctx.fillText(segment.displayValue, width - 18, rowY + 18);
    ctx.textAlign = "left";

    ctx.fillStyle = "#eef2ef";
    ctx.beginPath();
    ctx.roundRect(chartLeft, trackY, chartW, trackHeight, 999);
    ctx.fill();

    if (barWidth > 0) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(chartLeft, trackY, Math.max(8, barWidth), trackHeight, 999);
      ctx.fill();
    } else if (startsLater) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(chartLeft, trackY, 30, trackHeight, 999);
      ctx.stroke();
      ctx.restore();
    }

    segmentMeta.push({
      key: segment.key,
      startX: cardX,
      endX: cardX + cardW,
      startY: rowY,
      endY: rowY + rowHeight,
    });
  });

  projectionCanvasMeta = {
    mode: "income-mix",
    segments: segmentMeta,
    minAge: projection.state.age,
    maxAge: Math.max(projection.state.age + 1, projection.state.retireAge),
    ageStartX: chartLeft,
    ageEndX: chartRight,
  };
}

function drawProjection(projection) {
  const canvas = els.projectionChart;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const scenarioProjection = projection.usesIncomeMix ? null : getActiveScenarioProjection(projection);
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 900;
  const height = canvas.clientHeight || 320;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  if (projection.isBlocked) {
    projectionCanvasMeta = null;
    return;
  }

  if (projection.usesIncomeMix) {
    const displayProjection = getIncomeMixDisplayProjection(projection);
    drawProjectionIncomeMix(displayProjection, ctx, width, height);
    const ageRange = getIncomeMixAgeRange(projection);
    projectionCanvasMeta = {
      ...projectionCanvasMeta,
      minAge: ageRange.minAge,
      maxAge: ageRange.maxAge,
      ageStartX: projectionCanvasMeta?.ageStartX,
      ageEndX: projectionCanvasMeta?.ageEndX,
    };
    return;
  }

  const pad = { top: 28, right: 28, bottom: 42, left: 78 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const points = projection.series || [];
  const scenarioPoints = scenarioProjection?.series || [];
  const targetPot = projection.targetPot;
  const { minAge, maxAge } = getProjectionAgeSeriesRange(projection, scenarioProjection);
  const ageSpan = Math.max(1, maxAge - minAge);
  const maxPot = Math.max(...points.map((point) => point.pot), ...scenarioPoints.map((point) => point.pot), projection.projectedPot, scenarioProjection?.projectedPot || 0, targetPot, 50000);
  projectionCanvasMeta = {
    mode: "age-series",
    minAge,
    maxAge,
    ageSpan,
    pad,
    chartW,
    chartH,
  };

  ctx.strokeStyle = "#dfddd6";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#67625b";
  ctx.font = "12px 'IBM Plex Sans', 'Avenir Next', sans-serif";
  for (let i = 0; i <= 4; i += 1) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(formatMoney(maxPot * (1 - i / 4)), 10, y + 4);
  }

  if (targetPot > 0) {
    const targetY = pad.top + chartH - (targetPot / maxPot) * chartH;
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = "rgba(18, 18, 18, 0.45)";
    ctx.beginPath();
    ctx.moveTo(pad.left, targetY);
    ctx.lineTo(width - pad.right, targetY);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "#3f3c36";
    ctx.fillText("Target pot", width - pad.right - 62, Math.max(pad.top + 12, targetY - 8));
  }

  const area = new Path2D();
  const line = new Path2D();
  points.forEach((point, index) => {
    const x = pad.left + ((point.age - minAge) / ageSpan) * chartW;
    const y = pad.top + chartH - (point.pot / maxPot) * chartH;
    if (index === 0) {
      line.moveTo(x, y);
      area.moveTo(x, pad.top + chartH);
      area.lineTo(x, y);
    } else {
      line.lineTo(x, y);
      area.lineTo(x, y);
    }
  });
  area.lineTo(width - pad.right, pad.top + chartH);
  area.closePath();

  const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
  gradient.addColorStop(0, "rgba(23, 23, 23, 0.24)");
  gradient.addColorStop(1, "rgba(23, 23, 23, 0.02)");
  ctx.fillStyle = gradient;
  ctx.fill(area);
  ctx.strokeStyle = "#171717";
  ctx.lineWidth = 3;
  ctx.stroke(line);

  if (scenarioPoints.length) {
    const scenarioLine = new Path2D();
    scenarioPoints.forEach((point, index) => {
      const x = pad.left + ((point.age - minAge) / ageSpan) * chartW;
      const y = pad.top + chartH - (point.pot / maxPot) * chartH;
      if (index === 0) {
        scenarioLine.moveTo(x, y);
      } else {
        scenarioLine.lineTo(x, y);
      }
    });
    ctx.save();
    ctx.setLineDash([10, 7]);
    ctx.strokeStyle = "#7f7b73";
    ctx.lineWidth = 2.5;
    ctx.stroke(scenarioLine);
    ctx.restore();
  }

  const end = points[points.length - 1];
  const endX = pad.left + ((end.age - minAge) / ageSpan) * chartW;
  const endY = pad.top + chartH - (end.pot / maxPot) * chartH;
  ctx.fillStyle = "#171717";
  ctx.beginPath();
  ctx.arc(endX, endY, 5, 0, Math.PI * 2);
  ctx.fill();

  const focusAge = Math.min(Math.max(appState.projectionInspectorAge || minAge, minAge), maxAge);
  const focusCurrent = getProjectionPointAtAge(projection, focusAge);
  if (!focusCurrent.ended && focusCurrent.point) {
    const x = pad.left + ((focusCurrent.point.age - minAge) / ageSpan) * chartW;
    const y = pad.top + chartH - (focusCurrent.point.pot / maxPot) * chartH;
    ctx.save();
    ctx.setLineDash([5, 6]);
    ctx.strokeStyle = "rgba(15, 98, 94, 0.36)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, pad.top);
    ctx.lineTo(x, pad.top + chartH);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "#171717";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (scenarioProjection) {
    const focusScenario = getProjectionPointAtAge(scenarioProjection, focusAge);
    if (!focusScenario.ended && focusScenario.point) {
      const x = pad.left + ((focusScenario.point.age - minAge) / ageSpan) * chartW;
      const y = pad.top + chartH - (focusScenario.point.pot / maxPot) * chartH;
      ctx.fillStyle = "#7f7b73";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "#171717";
  ctx.font = "700 12px 'IBM Plex Sans', 'Avenir Next', sans-serif";
  ctx.fillText(`Age ${minAge}`, pad.left, height - 14);
  ctx.fillText(`Age ${maxAge}`, width - pad.right - 54, height - 14);
}
