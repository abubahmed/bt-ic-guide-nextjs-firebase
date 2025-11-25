const seededAnnouncements: AnnouncementEntry[] = [
  {
    id: "msg-01",
    title: "Door rotations begin in 15",
    message: "Security + logistics, swap badges and stage at Ballroom North.",
    type: "reminder",
    channel: "push",
    scope: "all",
    author: "Jordan King",
    timestamp: "Today · 09:15 AM",
  },
  {
    id: "msg-02",
    title: "Hospitality suites briefing",
    message: "Hospitality leads meet at Ops Loft room 4 for VIP prep.",
    type: "announcement",
    channel: "email",
    scope: "hospitality",
    author: "Nora Quinn",
    timestamp: "Today · 08:42 AM",
  },
  {
    id: "msg-03",
    title: "Stage walk-through",
    message: "Programming + operations join the ballroom walk-through at 11:00.",
    type: "announcement",
    channel: "email",
    scope: "programming",
    author: "Cal Rivers",
    timestamp: "Today · 07:55 AM",
  },
  {
    id: "msg-04",
    title: "Reminder · shuttle manifests",
    message: "Logistics verify shuttle manifests before 14:00 dispatch.",
    type: "reminder",
    channel: "email",
    scope: "logistics",
    author: "Alex Chen",
    timestamp: "Today · 06:45 AM",
  },
  {
    id: "msg-05",
    title: "Attendee dinner seating",
    message: "Attendees check app for assigned tables at 18:30 dinner.",
    type: "announcement",
    channel: "push",
    scope: "all",
    author: "Maya Patel",
    timestamp: "Yesterday · 10:12 PM",
  },
  {
    id: "msg-06",
    title: "Badge troubleshooting stand-up",
    message: "Security bring escalations to the Command Deck at 09:45.",
    type: "reminder",
    channel: "email",
    scope: "security",
    author: "Kofi Diaz",
    timestamp: "Today · 09:30 AM",
  },
] as const;

const teams = [
  { id: "operations", label: "Operations" },
  { id: "programming", label: "Programming" },
  { id: "hospitality", label: "Hospitality" },
  { id: "security", label: "Security" },
  { id: "logistics", label: "Logistics" },
] as const;

const channels = [
  { id: "push", label: "App Push" },
  { id: "email", label: "Email" },
] as const;

export { teams, channels, seededAnnouncements };
