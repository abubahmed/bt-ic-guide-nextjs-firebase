const teams = [
  { id: "operations", label: "Operations" },
  { id: "programming", label: "Programming" },
  { id: "hospitality", label: "Hospitality" },
  { id: "security", label: "Security" },
  { id: "logistics", label: "Logistics" },
] as const;

const helpTypes = [
  { id: "attendee-invite", label: "Attendee invite request" },
  { id: "staff-invite", label: "Staff invite request" },
  { id: "live-help", label: "Live help desk" },
  { id: "issue-escalation", label: "Issue escalation" },
] as const;

const helpRequests = [
  {
    id: "req-001",
    requesterId: "alex-chen",
    requesterName: "Alex Chen",
    requesterRole: "Ops hub lead",
    channel: "Staff portal",
    ownerTeam: "operations",
    requestType: "staff-invite",
    summary: "Need three additional wristbands for overnight rotation",
    detail:
      "Night rotation requires three extra verified badges for ad-hoc AV temps. Requesting expedited invite links before 18:00.",
    submittedAt: "Today · 10:22 AM",
    priority: "high",
    status: "pending",
  },
  {
    id: "req-002",
    requesterId: "guest-mira",
    requesterName: "Mira Sandoval",
    requesterRole: "Attendee · BTIC Guest",
    channel: "Attendee app",
    ownerTeam: "hospitality",
    requestType: "attendee-invite",
    summary: "Guest pass for partner arriving Saturday morning",
    detail:
      "Need to convert companion pass to full attendee invite for Saturday programming. Partner arriving at 09:15, requires QR delivery.",
    submittedAt: "Today · 09:48 AM",
    priority: "medium",
    status: "new",
  },
  {
    id: "req-003",
    requesterId: "brianna-lee",
    requesterName: "Brianna Lee",
    requesterRole: "Site logistics",
    channel: "Internal chat",
    ownerTeam: "logistics",
    requestType: "issue-escalation",
    summary: "Lost equipment manifest sync",
    detail:
      "Manifest upload from the attendee inventory portal is failing checksum. Need manual override for Freight drop 4.",
    submittedAt: "Today · 08:05 AM",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "req-004",
    requesterId: "owen-blake",
    requesterName: "Owen Blake",
    requesterRole: "Content editor",
    channel: "Staff portal",
    ownerTeam: "programming",
    requestType: "staff-invite",
    summary: "Transfer speaker pass to new producer",
    detail:
      "Producer swap: need to update invite from Erin Patel to Dax Morgan for Studio 4 sessions. Please revoke old link once new one is live.",
    submittedAt: "Today · 07:32 AM",
    priority: "medium",
    status: "pending",
  },
  {
    id: "req-005",
    requesterId: "kofi-diaz",
    requesterName: "Kofi Diaz",
    requesterRole: "Perimeter lead",
    channel: "Ops radio log",
    ownerTeam: "security",
    requestType: "live-help",
    summary: "Badge scanner failure at Gate 3",
    detail:
      "Handheld reader timing out. Need alternate authentication path or replacement hardware before evening influx.",
    submittedAt: "Yesterday · 11:18 PM",
    priority: "high",
    status: "failed",
  },
  {
    id: "req-006",
    requesterId: "guest-lena",
    requesterName: "Lena Hart",
    requesterRole: "Attendee · Workshop Facilitator",
    channel: "Attendee app",
    ownerTeam: "programming",
    requestType: "live-help",
    summary: "Room change confirmation for breakout",
    detail:
      "Requested breakout swap from Loft B to Studio C due to accessibility needs. Looking for confirmation before 15:00.",
    submittedAt: "Yesterday · 06:42 PM",
    priority: "low",
    status: "solved",
  },
  {
    id: "req-007",
    requesterId: "samir-holt",
    requesterName: "Samir Holt",
    requesterRole: "Freight coordinator",
    channel: "Staff portal",
    ownerTeam: "logistics",
    requestType: "issue-escalation",
    summary: "Need manual override for freight elevator access",
    detail:
      "Four attendee support volunteers stuck at freight elevator due to badge mis-scan. Requesting temporary clearance.",
    submittedAt: "Yesterday · 04:10 PM",
    priority: "medium",
    status: "pending",
  },
];

const statusStyles = {
  new: { label: "New", badge: "bg-slate-800 text-white border-slate-700" },
  pending: { label: "Pending", badge: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  "in-progress": { label: "In progress", badge: "bg-sky-500/20 text-sky-200 border-sky-500/40" },
  solved: { label: "Solved", badge: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40" },
  failed: { label: "Failed", badge: "bg-rose-500/20 text-rose-200 border-rose-500/40" },
};

const priorityStyles = {
  high: { label: "High", badge: "bg-rose-500/15 text-rose-300 border-rose-500/40" },
  medium: { label: "Medium", badge: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  low: { label: "Low", badge: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
};

export { teams, helpTypes, helpRequests, statusStyles, priorityStyles };
