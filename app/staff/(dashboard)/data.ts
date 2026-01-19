import {
  FileSpreadsheet,
  LifeBuoy,
  CalendarClock,
  Megaphone,
  QrCode,
  ClipboardList,
  ShieldCheck,
  Map,
  User,
} from "lucide-react";

const stats = [
  {
    label: "Users synced",
    value: "268",
    icon: FileSpreadsheet,
    meta: "Current number of users synced with the database",
    href: "/staff/people",
  },
  {
    label: "Help requests",
    value: "5",
    icon: LifeBuoy,
    meta: "Current number of help requests",
    href: "/staff/help",
  },
  {
    label: "Current events",
    value: "3",
    icon: CalendarClock,
    meta: "Number of events currently ongoing",
    href: "/staff/schedules",
  },
];

const quickActions = [
  {
    slug: "schedules",
    label: "Personal schedules",
    icon: CalendarClock,
    href: "/staff/schedules",
    description: "View and manage personal schedules.",
  },
  {
    slug: "announcements",
    label: "Announcements",
    icon: Megaphone,
    href: "/staff/announcements",
    description: "View, delete, and create announcements.",
  },
  {
    slug: "help",
    label: "Help desk queue",
    icon: LifeBuoy,
    href: "/staff/help",
    description: "View and respond to help requests.",
  },
  {
    slug: "rooms",
    label: "Room assignments",
    icon: QrCode,
    href: "/staff/rooms",
    description:
      "View and distribute room assignments.",
  },
  {
    slug: "qr-codes",
    label: "QR codes",
    icon: QrCode,
    href: "/staff/qrcodes",
    description: "View and upload digital QR codes.",
  },
  {
    slug: "resources",
    label: "Resource library",
    icon: ClipboardList,
    href: "/staff/resources",
    description: "View, upload, and delete resources.",
  },
  {
    slug: "roles",
    label: "People & access",
    icon: ShieldCheck,
    href: "/staff/people",
    description: "View and manage people, roles, and access.",
  },
  {
    slug: "attentee ui",
    label: "Attendee interface",
    icon: User,
    href: "/staff/attentee-ui",
    description: "Interact with the attendee interface.",
  },
];

export { stats, quickActions };
