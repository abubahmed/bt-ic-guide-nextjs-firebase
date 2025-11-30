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
    icon: FileSpreadsheet,
    accent: "from-sky-400/20 via-sky-500/10 to-transparent",
    meta: "Current number of users synced with the database",
    href: "/staff/people",
  },
  {
    label: "Help requests",
    value: "5",
    icon: LifeBuoy,
    accent: "from-rose-400/20 via-rose-500/10 to-transparent",
    meta: "Current number of help requests",
    href: "/staff/help",
  },
  {
    label: "Current events",
    value: "3",
    icon: CalendarClock,
    accent: "from-green-400/20 via-green-500/10 to-transparent",
    meta: "Number of events currently ongoing",
    href: "/staff/schedules",
  },
];

const quickActions = [
  {
    slug: "schedules",
    label: "Manage personal schedules",
    icon: CalendarClock,
    href: "/staff/schedules",
    description: "View and manage personal schedules for attendees and staff",
  },
  {
    slug: "announcements",
    label: "Manage announcements",
    icon: Megaphone,
    href: "/staff/announcements",
    description: "View, delete, and create announcements with visibility control",
  },
  {
    slug: "help",
    label: "Open help desk queue",
    icon: LifeBuoy,
    href: "/staff/help",
    description: "View and respond to help requests from attendees and staff",
  },
  {
    slug: "rooms",
    label: "Manage room assignments",
    icon: QrCode,
    href: "/staff/rooms",
    description: "View and distribute room assignments for attendees and staff",
  },
  {
    slug: "qrcodes",
    label: "Manage QR codes",
    icon: QrCode,
    href: "/staff/qrcodes",
    description: "View and upload digital QR codes for attendees and staff",
  },
  {
    slug: "resources",
    label: "Manage resource library",
    icon: ClipboardList,
    href: "/staff/resources",
    description: "View, upload, and delete resources for attendees and staff",
  },
  {
    slug: "roles",
    label: "Manage people & access",
    icon: ShieldCheck,
    href: "/staff/people",
    description: "View and manage people, roles, and access",
  },
  {
    slug: "map",
    label: "Manage map",
    icon: Map,
    href: "/staff/map",
    description: "View and manage the official conference map",
  },
];

export { stats, quickActions };
