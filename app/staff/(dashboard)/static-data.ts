import {
  FileSpreadsheet,
  Users,
  LifeBuoy,
  CalendarClock,
  Megaphone,
  QrCode,
  ClipboardList,
  ShieldCheck,
  BellRing,
  MapPin,
  Share2,
  MessageSquare,
  BusFront,
  Map,
} from "lucide-react";

const stats = [
  {
    label: "Users synced",
    value: "268",
    meta: "Spreadsheet import • 4 min ago",
    icon: FileSpreadsheet,
    accent: "from-sky-400/20 via-sky-500/10 to-transparent",
  },
  {
    label: "Pending approvals",
    value: "12",
    meta: "Email verification required",
    icon: Users,
    accent: "from-emerald-400/20 via-emerald-500/10 to-transparent",
  },
  {
    label: "Help requests",
    value: "5",
    meta: "2 escalated to leadership",
    icon: LifeBuoy,
    accent: "from-rose-400/20 via-rose-500/10 to-transparent",
  },
];

const quickActions = [
  {
    slug: "schedules",
    label: "Manage personal schedules",
    description: "View and upload schedules for attendees and staffers.",
    icon: CalendarClock,
  },
  {
    slug: "announcements",
    label: "Manage announcements & reminders",
    description: "Compose push/email announcements or reminders.",
    icon: Megaphone,
  },
  {
    slug: "help",
    label: "Open help desk queue",
    description: "Triage help requests and provide support.",
    icon: LifeBuoy,
  },
  {
    slug: "rooms",
    label: "Manage room assignments",
    description: "View and assign rooms to attendees and staffers.",
    icon: QrCode,
  },
  {
    slug: "qrcodes",
    label: "Manage QR codes",
    description: "View and assign QR codes to attendees and staffers.",
    icon: QrCode,
  },
  {
    slug: "resources",
    label: "Manage resource library",
    description: "View and upload slides, FAQ, forms, merchandise, and more.",
    icon: ClipboardList,
  },
  {
    slug: "roles",
    label: "Manage people & access control",
    description: "Invite attendees/staffers, update roles, revoke access, and more.",
    icon: ShieldCheck,
  },
  {
    slug: "map",
    label: "Manage map",
    description: "View and upload map for attendees and staffers.",
    icon: Map,
  },
];

const actionLabels = quickActions.reduce<Record<string, string>>((acc, action) => {
  acc[action.slug] = action.label;
  return acc;
}, {});

const scheduleViews = {
  phoenix: {
    label: "Team Phoenix · Ops HQ",
    sessions: [
      {
        time: "08:30",
        title: "Leadership stand-up",
        location: "Ops HQ · Room 214",
        detail: "Confirm overnight help tickets + floor map updates.",
      },
      {
        time: "11:00",
        title: "Networking concierge brief",
        location: "Atrium · Level 1",
        detail: "Assign staff rotations pulled from uploaded roster.",
      },
      {
        time: "15:30",
        title: "Post-keynote recap",
        location: "Command Pod",
        detail: "Log announcements to re-send as reminders.",
      },
    ],
  },
  brenda: {
    label: "Brenda Lee · Accessibility lead",
    sessions: [
      {
        time: "09:15",
        title: "ADA route validation",
        location: "Main Hall · Level 2",
        detail: "Walk attendee Brenda's custom schedule import.",
      },
      {
        time: "13:00",
        title: "Speaker tech check",
        location: "Innovation Stage",
        detail: "Upload slides for visibility + attach to session.",
      },
      {
        time: "17:10",
        title: "Help desk sync",
        location: "Ops HQ",
        detail: "Resolve outstanding wheelchair escort requests.",
      },
    ],
  },
  avpod: {
    label: "AV Admin Pod",
    sessions: [
      {
        time: "07:45",
        title: "Room sweep + QR scanner test",
        location: "Expo Theater",
        detail: "Validate attendee access by role + QR code.",
      },
      {
        time: "12:20",
        title: "Slide upload window",
        location: "Innovation Stage",
        detail: "Parse CSV schedule rows to attach deck URLs.",
      },
      {
        time: "18:00",
        title: "Evening recap",
        location: "Broadcast Booth",
        detail: "Prep template reminders for next morning.",
      },
    ],
  },
};

const announcements = [
  {
    title: "Reminder • Opening keynote seating",
    detail: "Send push + email to seated attendees with QR room assignments.",
    channel: "Push + Email",
    icon: BellRing,
  },
  {
    title: "Floor map refresh",
    detail: "Upload updated service-elevator route for catering + ADA path.",
    channel: "Map sync",
    icon: MapPin,
  },
  {
    title: "Attendee feedback survey",
    detail: "Trigger post-session micro survey for Team Breakouts.",
    channel: "Survey",
    icon: ClipboardList,
  },
];

const helpRequests = [
  {
    team: "Team Phoenix",
    message: "Need assistance locating breakout 3B · ADA seating",
    minutes: "2m ago",
    priority: "High",
  },
  {
    team: "Speaker Support",
    message: "Slide deck for AR demo not rendering on confidence monitor",
    minutes: "7m ago",
    priority: "Medium",
  },
  {
    team: "Guest Services",
    message: "Food reimbursement form clarification for sponsor group",
    minutes: "12m ago",
    priority: "Low",
  },
];

const roomAssignments = [
  {
    label: "Innovation Stage · Level 2",
    detail: "Keynotes + AR demos · seat blocks A-F",
    qr: "BT-Stage-A",
    access: "Speakers, VIP, Production",
  },
  {
    label: "Breakout 3B · 14th Floor",
    detail: "Leadership workshops + international Fellows",
    qr: "BT-BRK-3B",
    access: "Fellows, Admin, Accessibility leads",
  },
  {
    label: "Ops HQ · Room 214",
    detail: "Staffer basecamp · help desk + merch storage",
    qr: "BT-OPS",
    access: "All staff, Logistics, Merch",
  },
  {
    label: "Networking Loft · Floor 5",
    detail: "Sponsor lounges, coffee chats, press booths",
    qr: "BT-NET-LOFT",
    access: "Attendees w/ sponsor tag, Media",
  },
];

const resourceLibraryItems = [
  {
    label: "Speaker slide bundles",
    description: "High-contrast decks for Business Today International keynotes.",
    icon: Share2,
  },
  {
    label: "Accessibility & wayfinding guide",
    description: "Static PDF handed to venues plus attendee FAQ snippets.",
    icon: MapPin,
  },
  {
    label: "Feedback & pulse surveys",
    description: "Forms for mid-conference sentiment and post-event takeaways.",
    icon: ClipboardList,
  },
  {
    label: "Transportation reimbursement form",
    description: "Static doc covering bus, rideshare, and meal stipend rules.",
    icon: BusFront,
  },
  {
    label: "Business Today history sheet",
    description: "About BT International Conference for media + attendees.",
    icon: MessageSquare,
  },
];

const accessControls = [
  {
    title: "Staff & speaker bios",
    detail: "Profile photos, about-me blurbs, and contact channels pulled from import sheets.",
  },
  {
    title: "Role + permission matrix",
    detail: "Update or revoke access per email; unmatched emails stay locked out.",
  },
  {
    title: "Verification queue",
    detail: "Approve Princeton email sign-ups + resend codes if spreadsheet entry exists.",
  },
];

const primaryNav = [
  { slug: "schedules", label: "Schedules" },
  { slug: "help", label: "Help Desk" },
  { slug: "roles", label: "Access" },
];

const staffProfile = {
  name: "Maya Chen",
  email: "maya.chen@businesstoday.org",
};

export {
  stats,
  quickActions,
  actionLabels,
  scheduleViews,
  announcements,
  helpRequests,
  roomAssignments,
  resourceLibraryItems,
  accessControls,
  primaryNav,
  staffProfile,
};
