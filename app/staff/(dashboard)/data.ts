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
    icon: CalendarClock,
    href: "/staff/schedules",
  },
  {
    slug: "announcements",
    label: "Manage announcements & reminders",
    icon: Megaphone,
    href: "/staff/announcements",
  },
  {
    slug: "help",
    label: "Open help desk queue",
    icon: LifeBuoy,
    href: "/staff/help",
  },
  {
    slug: "rooms",
    label: "Manage room assignments",
    icon: QrCode,
    href: "/staff/rooms",
  },
  {
    slug: "qrcodes",
    label: "Manage QR codes",
    icon: QrCode,
    href: "/staff/qrcodes",
  },
  {
    slug: "resources",
    label: "Manage resource library",
    icon: ClipboardList,
    href: "/staff/resources",
  },
  {
    slug: "roles",
    label: "Manage people & access",
    icon: ShieldCheck,
    href: "/staff/people",
  },
  {
    slug: "map",
    label: "Manage map",
    icon: Map,
    href: "/staff/map",
  },
];

export {
  stats,
  quickActions,
};
