import {
  FileSpreadsheet,
  LifeBuoy,
  CalendarClock,
  Megaphone,
  QrCode,
  ClipboardList,
  ShieldCheck,
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
    label: "Help requests",
    value: "5",
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
    href: "/staff/schedules",
  },
  {
    slug: "announcements",
    label: "Manage announcements & reminders",
    description: "Compose push/email announcements or reminders.",
    icon: Megaphone,
    href: "/staff/announcements",
  },
  {
    slug: "help",
    label: "Open help desk queue",
    description: "Triage help requests and provide support.",
    icon: LifeBuoy,
    href: "/staff/help",
  },
  {
    slug: "rooms",
    label: "Manage room assignments",
    description: "View and assign rooms to attendees and staffers.",
    icon: QrCode,
    href: "/staff/rooms",
  },
  {
    slug: "qrcodes",
    label: "Manage QR codes",
    description: "View and assign QR codes to attendees and staffers.",
    icon: QrCode,
    href: "/staff/qrcodes",
  },
  {
    slug: "resources",
    label: "Manage resource library",
    description: "View and upload slides, FAQ, forms, merchandise, and more.",
    icon: ClipboardList,
    href: "/staff/resources",
  },
  {
    slug: "roles",
    label: "Manage people & access",
    description: "Invite attendees/staffers, update roles, revoke access, and more.",
    icon: ShieldCheck,
    href: "/staff/roles",
  },
  {
    slug: "map",
    label: "Manage map",
    description: "View and upload map for attendees and staffers.",
    icon: Map,
    href: "/staff/map",
  },
];

export {
  stats,
  quickActions,
};
