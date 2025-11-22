"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  BellRing,
  BusFront,
  CalendarClock,
  ClipboardList,
  FileSpreadsheet,
  LifeBuoy,
  MapPin,
  Megaphone,
  MessageSquare,
  QrCode,
  Share2,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    description: "Upload CSV schedules or manually edit schedules.",
    icon: CalendarClock,
  },
  {
    slug: "announcements",
    label: "Manage announcements & reminders",
    description: "Compose push/email nudges or schedule reminders.",
    icon: Megaphone,
  },
  {
    slug: "help",
    label: "Open help desk queue",
    description: "Triage help requests and dispatch on-site support.",
    icon: LifeBuoy,
  },
  {
    slug: "rooms",
    label: "Manage room assignments & QR badges",
    description: "Manage room assignments and distribute QR badges.",
    icon: QrCode,
  },
  {
    slug: "resources",
    label: "Manage resource library",
    description: "Slides, FAQ, forms, merchandise, and more.",
    icon: ClipboardList,
  },
  {
    slug: "roles",
    label: "Manage people & access control",
    description: "Invite attendees/staffers, update roles, revoke access, etc.",
    icon: ShieldCheck,
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

type ScheduleKey = keyof typeof scheduleViews;

const scheduleOptions: { id: ScheduleKey; label: string }[] = Object.entries(scheduleViews).map(([key, value]) => ({
  id: key as ScheduleKey,
  label: value.label,
}));

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

export default function StaffDashboardPage() {
  const [scheduleKey, setScheduleKey] = useState<ScheduleKey>("phoenix");
  const currentSchedule = scheduleViews[scheduleKey];

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-900/70 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 lg:flex-nowrap lg:px-0">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm font-semibold text-white">
              BTIC Ops
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Business Today</p>
              <p className="text-sm text-slate-300">Annual International Conference</p>
            </div>
          </div>
          <nav className="flex flex-1 items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            {primaryNav.map((link) => (
              <button
                key={link.slug}
                data-nav={link.slug}
                className="rounded-full border border-transparent px-4 py-1.5 transition hover:border-sky-500/40 hover:text-sky-300">
                {link.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2">
            <Avatar className="size-10 border border-slate-800 bg-slate-900">
              <AvatarFallback className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
                {staffProfile.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-semibold text-white">{staffProfile.name}</p>
              <p className="text-xs text-slate-400">{staffProfile.email}</p>
            </div>
            <div className="flex flex-col gap-1">
              <Button variant="outline" size="sm" className="h-7 rounded-xl border-slate-700 bg-transparent text-[0.65rem] uppercase tracking-[0.25em] text-slate-200">
                Switch
              </Button>
              <Button size="sm" className="h-7 rounded-xl bg-slate-100 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-slate-900">
                Log out
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-950 p-8 shadow-[0px_30px_80px_rgba(2,6,23,0.7)]">
          <div className="flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
            <span>Business Today International Conference</span>
            <span className="h-px w-8 bg-slate-800" />
            <span>Staff admin command center</span>
          </div>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white md:text-4xl">Staffer home base</h1>
              <p className="mt-3 max-w-2xl text-base text-slate-400">
                Coordinate the Business Today Annual International Conference—from Princeton campus arrivals to Midtown venue
                breakouts—with a dashboard that mirrors your spreadsheets, manual inputs, and QR-secured spaces.
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="rounded-2xl bg-sky-500 px-6 text-sm font-semibold text-white hover:bg-sky-400">
                New announcement
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-900">
                Design schedule
              </Button>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="border-slate-800 bg-slate-900/70 text-slate-100">
                  <CardContent className="relative rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6">
                    <span
                      className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.accent} opacity-70`}
                    />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{stat.label}</p>
                        <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
                        <p className="mt-2 text-sm text-slate-400">{stat.meta}</p>
                      </div>
                      <span className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-sky-400">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                data-action={action.slug}
                aria-label={action.label}
                className="group flex items-center gap-4 rounded-3xl border border-slate-800/60 bg-slate-900/40 p-5 text-left transition hover:-translate-y-0.5 hover:border-sky-500/50 hover:bg-slate-900/80"
                type="button">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 text-sky-400">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{action.label}</p>
                  <p className="text-sm text-slate-400">{action.description}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-sky-400" />
              </button>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.75fr_1fr]">
          <Card data-action="schedules" className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader className="flex flex-col gap-4 border-b border-slate-800/70 pb-6">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="rounded-full border-slate-700 bg-slate-950/40 text-xs uppercase tracking-[0.35em] text-slate-400">
                  Schedules
                </Badge>
                <p className="text-xs text-slate-500">Imported from spreadsheets or manual entries</p>
              </div>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="text-2xl text-white">Personal timelines</CardTitle>
                  <CardDescription className="text-slate-400">
                    Select any attendee, staffer, or team to preview their schedule and/or make updates.
                  </CardDescription>
                </div>
                <Select value={scheduleKey} onValueChange={(value) => setScheduleKey(value as ScheduleKey)}>
                  <SelectTrigger className="rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100">
                    <SelectValue placeholder="Choose schedule" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-950/90 text-slate-100">
                    {scheduleOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {currentSchedule.sessions.map((slot) => (
                <div
                  key={`${slot.title}-${slot.time}`}
                  className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-sky-500/50">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-semibold text-white">{slot.time}</p>
                    <Badge className="rounded-full bg-slate-800/70 text-xs text-slate-200">{slot.location}</Badge>
                  </div>
                  <p className="mt-2 text-base font-semibold text-white">{slot.title}</p>
                  <p className="text-sm text-slate-400">{slot.detail}</p>
                </div>
              ))}
            </CardContent>
            <CardContent className="border-t border-slate-800/70 pt-6">
              <Button className="w-full rounded-2xl border border-sky-500/40 bg-slate-950/60 text-sm font-semibold text-sky-200 hover:bg-slate-900">
                Open {currentSchedule.label} workspace
              </Button>
            </CardContent>
          </Card>

          <Card data-action="announcements" className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader className="border-b border-slate-800/70 pb-6">
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-sky-400" />
                <CardTitle className="text-xl text-white">{actionLabels.announcements}</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Stage occasional reminders, compose announcements, or send team-specific messages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {announcements.map((announcement) => {
                const Icon = announcement.icon;
                return (
                  <div key={announcement.title} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="flex items-start gap-3">
                      <span className="rounded-2xl border border-slate-800 bg-slate-900/80 p-2 text-sky-400">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{announcement.title}</p>
                        <p className="text-sm text-slate-400">{announcement.detail}</p>
                        <Badge className="mt-3 rounded-full bg-slate-800/60 text-xs text-slate-300">
                          {announcement.channel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
            <CardContent className="border-t border-slate-800/70 pt-6">
              <div className="grid gap-3">
                <Button className="w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                  Compose from scratch
                </Button>
                <Button className="w-full rounded-2xl border border-slate-700 bg-slate-950/60 text-sm font-semibold text-slate-100 hover:border-sky-500/60">
                  Schedule reminder window
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card data-action="help" className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader className="border-b border-slate-800/70 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <LifeBuoy className="h-5 w-5 text-rose-400" />
                  <CardTitle className="text-xl text-white">{actionLabels.help}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-slate-700 bg-slate-950/40 text-xs font-semibold text-slate-100 hover:border-sky-500/60">
                  Open queue
                </Button>
              </div>
              <CardDescription className="text-slate-400">
                Answer attendee questions, escalate to leaders, or dispatch on-site support right from the queue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {helpRequests.map((request) => (
                <div key={request.team} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-white">{request.team}</p>
                    <Badge className="rounded-full bg-slate-800/70 text-xs text-slate-200">
                      {request.priority} priority
                    </Badge>
                    <span className="text-xs text-slate-500">{request.minutes}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{request.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card data-action="rooms" className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader className="border-b border-slate-800/70 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <QrCode className="h-5 w-5 text-sky-400" />
                  <CardTitle className="text-xl text-white">{actionLabels.rooms}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-slate-700 bg-slate-950/40 text-xs font-semibold text-slate-100 hover:border-sky-500/60">
                  Manage rooms
                </Button>
              </div>
              <CardDescription className="text-slate-400">
                Keep room numbers, floor assignments, and QR badge access distinct from static resources so staffers never mix feeds.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {roomAssignments.map((room) => (
                <div key={room.label} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-white">{room.label}</p>
                    <Badge className="rounded-full bg-slate-800/70 text-xs text-slate-200">{room.qr}</Badge>
                  </div>
                  <p className="text-sm text-slate-400">{room.detail}</p>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Access: {room.access}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card data-action="resources" className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader className="border-b border-slate-800/70 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-amber-300" />
                  <CardTitle className="text-xl text-white">{actionLabels.resources}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-slate-700 bg-slate-950/40 text-xs font-semibold text-slate-100 hover:border-sky-500/60">
                  Open library
                </Button>
              </div>
              <CardDescription className="text-slate-400">
                Static files that never rely on spreadsheets—slide decks, surveys, historical one-pagers, and reimbursement forms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {resourceLibraryItems.map((resource) => {
                const Icon = resource.icon;
                return (
                  <div key={resource.label} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                    <span className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2 text-sky-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{resource.label}</p>
                      <p className="text-sm text-slate-400">{resource.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card data-action="roles" className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader className="border-b border-slate-800/70 pb-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-emerald-300" />
                <CardTitle className="text-xl text-white">{actionLabels.roles}</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Manage admins, staffers, speakers, and attendees—email verification plus spreadsheet presence remain the source of truth.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {accessControls.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-slate-400">{item.detail}</p>
                </div>
              ))}
              <div className="flex flex-wrap gap-3">
                <Button className="flex-1 rounded-2xl border border-sky-500/40 bg-slate-950/60 text-sm font-semibold text-sky-200 hover:bg-slate-900">
                  Invite staffer
                </Button>
                <Button className="flex-1 rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                  Update roles & access
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
