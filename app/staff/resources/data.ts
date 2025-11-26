const seededResources: any[] = [
  {
    id: "res-001",
    title: "Command deck handoff guide",
    description: "Checklist for opening/closing the ops deck with badge protocols.",
    owner: "Jordan King",
    visibility: "staff",
    updated: "Today · 09:12 AM",
    size: "2.1 MB",
    sourceType: "file",
    reference: "Command_Deck_Handoff.pdf",
  },
  {
    id: "res-002",
    title: "Programming run of show",
    description: "Session timings, cues, and presenter bios for Day 2.",
    owner: "Maya Patel",
    visibility: "both",
    updated: "Today · 08:40 AM",
    size: "Spreadsheet",
    sourceType: "link",
    reference: "https://btic.app/ros/day-2",
  },
  {
    id: "res-003",
    title: "Hospitality suite checklist",
    description: "Stocking requirements + VIP notes for suites 901-905.",
    owner: "Leo Carter",
    visibility: "staff",
    updated: "Today · 08:00 AM",
    size: "210 KB",
    sourceType: "file",
    reference: "Hospitality_Suite_Checklist.docx",
  },
  {
    id: "res-004",
    title: "Incident escalation form",
    description: "Quick form for on-site issues needing exec escalation.",
    owner: "Diana Park",
    visibility: "both",
    updated: "Today · 07:45 AM",
    size: "Web",
    sourceType: "link",
    reference: "https://forms.btic.app/escalations",
  },
  {
    id: "res-005",
    title: "Attendee reimbursements",
    description: "Expense policy and submission instructions for attendees.",
    owner: "Priya Iyer",
    visibility: "attendees",
    updated: "Yesterday · 09:32 PM",
    size: "1.3 MB",
    sourceType: "file",
    reference: "Attendee_Reimbursements.pdf",
  },
] as const;

const visibilityStyles: Record<any, { label: string; badge: string }> = {
  staff: {
    label: "Staff only",
    badge: "border border-sky-500/40 bg-sky-500/10 text-sky-200",
  },
  attendees: {
    label: "Attendee facing",
    badge: "border border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  },
  both: {
    label: "Staff + attendee",
    badge: "border border-amber-500/40 bg-amber-500/10 text-amber-200",
  },
};

const sourceStyles: Record<any, { label: string; badge: string }> = {
  link: {
    label: "URL",
    badge: "border border-sky-400/40 bg-sky-400/10 text-sky-100",
  },
  file: {
    label: "File",
    badge: "border border-slate-500/50 bg-slate-500/10 text-slate-100",
  },
};

export { seededResources, visibilityStyles, sourceStyles };