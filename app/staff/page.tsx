import { ArrowUpRight, BarChart3, BellRing, Bot, BusFront, CalendarClock, CalendarPlus, ClipboardList, FileSpreadsheet, Gift, LifeBuoy, MapPin, Megaphone, MessageSquare, PlusCircle, QrCode, Share2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    label: "Attendees synced",
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
    label: "Live help requests",
    value: "5",
    meta: "2 escalated to leadership",
    icon: LifeBuoy,
    accent: "from-rose-400/20 via-rose-500/10 to-transparent",
  },
];

const quickActions = [
  {
    label: "Create conference",
    description: "Spin up venues, floors, badge colors, and rooms.",
    icon: CalendarPlus,
  },
  {
    label: "Add staffer / attendee",
    description: "Invite via Princeton email + verification code.",
    icon: PlusCircle,
  },
  {
    label: "Build schedule",
    description: "Drag sessions, speakers, rooms, and livestream links.",
    icon: CalendarClock,
  },
  {
    label: "Broadcast announcement",
    description: "Push reminders to app, SMS, and inbox at once.",
    icon: Megaphone,
  },
  {
    label: "Upload floor map",
    description: "Sync routing + room numbers for precise navigation.",
    icon: MapPin,
  },
  {
    label: "Resource library",
    description: "Slides, FAQ, surveys, reimbursements, swag forms.",
    icon: ClipboardList,
  },
];

const schedule = [
  {
    time: "08:30",
    title: "Leadership stand-up",
    location: "Ops HQ · Room 214",
    detail: "Confirm overnight help tickets + floor map updates.",
  },
  {
    time: "10:15",
    title: "Accessibility walkthrough",
    location: "Main Hall · Level 2",
    detail: "Pair with facilities to validate signage + beacons.",
  },
  {
    time: "13:00",
    title: "Speaker tech check",
    location: "Innovation Stage",
    detail: "Upload slides for visibility + attach to app session.",
  },
  {
    time: "16:45",
    title: "Live poll + merch drop",
    location: "Expo Theater",
    detail: "Schedule push notification + swag giveaway form.",
  },
];

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

const resourceLinks = [
  {
    label: "Digital badges & QR access",
    description: "Assign rooms, track scans, share VIP door codes.",
    icon: QrCode,
  },
  {
    label: "Transportation & meal reimbursements",
    description: "Track submissions, approvals, and payout status.",
    icon: BusFront,
  },
  {
    label: "FAQ + about conference",
    description: "Update knowledge base surfaced in attendee app + chatbot.",
    icon: MessageSquare,
  },
  {
    label: "Resource bundles",
    description: "Upload slides, misc documents, sponsor links, swag info.",
    icon: Share2,
  },
];

const accessControls = [
  {
    title: "Staff & speaker bios",
    detail: "Profile photos, about-me blurbs, and contact channels.",
  },
  {
    title: "Attendee permissions",
    detail: "Room, session, networking, and poll eligibility.",
  },
  {
    title: "Verification queue",
    detail: "Approve Princeton email sign-ups + resend codes.",
  },
];

const communityTiles = [
  {
    title: "Live polls & pulse checks",
    detail: "Launch polls mid-session and mirror results on stage displays.",
    icon: BarChart3,
  },
  {
    title: "Open speaker slides",
    detail: "Autofill accessibility mode for remote + low-visibility seats.",
    icon: Gift,
  },
  {
    title: "Networking space",
    detail: "Attendees, staffers, and speakers share socials + intros.",
    icon: Users,
  },
  {
    title: "Post-event wrap + socials",
    detail: "Push thank-you notes, highlight reels, and LinkedIn prompts.",
    icon: Megaphone,
  },
];

export default function StaffDashboardPage() {
  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-950 p-8 shadow-[0px_30px_80px_rgba(2,6,23,0.7)]">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.4em] text-sky-400">
            <span>BT&nbsp;IC</span>
            <span className="h-px w-8 bg-slate-800" />
            <span>Staff admin command center</span>
          </div>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white md:text-4xl">Staffer home base</h1>
              <p className="mt-3 max-w-2xl text-base text-slate-400">
                Coordinate the entire conference from one sleek dashboard—create conferences, map venues, seed schedules, answer
                help requests, and keep every attendee in sync with push notifications and AI copilots.
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="rounded-2xl bg-sky-500 px-6 text-sm font-semibold text-white hover:bg-sky-400">
                New announcement
              </Button>
              <Button variant="outline" className="rounded-2xl border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-900">
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
          <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader className="flex flex-col gap-2 border-b border-slate-800/70 pb-6">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="rounded-full border-slate-700 bg-slate-950/40 text-xs uppercase tracking-[0.35em] text-slate-400">
                  Schedule
                </Badge>
                <p className="text-xs text-slate-500">Personalized + fully editable</p>
              </div>
              <CardTitle className="text-2xl text-white">Today&apos;s control room</CardTitle>
              <CardDescription className="text-slate-400">
                Drag-and-drop sessions, attach locations, and mirror updates to attendee timelines instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {schedule.map((slot) => (
                <div
                  key={slot.title}
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
                Customize schedule + attach slides
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader className="border-b border-slate-800/70 pb-6">
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-sky-400" />
                <CardTitle className="text-xl text-white">Announcements & reminders</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Stage urgent nudges, send push notifications, or queue leader messages.
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
                        <Badge className="mt-3 rounded-full bg-slate-800/60 text-xs text-slate-300">{announcement.channel}</Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
            <CardContent className="border-t border-slate-800/70 pt-6">
              <Button className="w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                Schedule reminder
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader className="border-b border-slate-800/70 pb-6">
              <div className="flex items-center gap-3">
                <LifeBuoy className="h-5 w-5 text-rose-400" />
                <CardTitle className="text-xl text-white">Help requests & AI support</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Answer attendee questions, escalate to leaders, or let the LLM copilot draft replies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {helpRequests.map((request) => (
                <div key={request.team} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-white">{request.team}</p>
                    <Badge className="rounded-full bg-slate-800/70 text-xs text-slate-200">{request.priority} priority</Badge>
                    <span className="text-xs text-slate-500">{request.minutes}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{request.message}</p>
                </div>
              ))}
              <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950/80 p-4">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-sky-300" />
                  <p className="text-sm font-semibold text-white">LLM concierge</p>
                  <Badge className="rounded-full bg-slate-800/60 text-xs text-slate-300">37 prompts today</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  “Draft a courteous response for Brenda in Row D needing wheelchair escort + attach updated floor map.”
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Suggested reply pre-filled with precise turn-by-turn directions and a link to the ADA route overlay.
                </p>
                <Button className="mt-4 w-full rounded-2xl border border-sky-500/40 bg-slate-950/60 text-sm font-semibold text-sky-200 hover:bg-slate-900">
                  Open AI copilot
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader className="border-b border-slate-800/70 pb-6">
              <div className="flex items-center gap-3">
                <QrCode className="h-5 w-5 text-sky-400" />
                <CardTitle className="text-xl text-white">Resources & logistics</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Keep maps, QR badges, forms, and miscellaneous resources a tap away for staffers and attendees.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {resourceLinks.map((resource) => {
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
              <Button className="w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                Upload document or link
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader className="border-b border-slate-800/70 pb-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-emerald-300" />
                <CardTitle className="text-xl text-white">People & access control</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Manage admins, staffers, speakers, and attendees—email verification remains the source of truth.
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
                  Review approvals
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 text-slate-100">
            <CardHeader className="border-b border-slate-800/70 pb-6">
              <div className="flex items-center gap-3">
                <Share2 className="h-5 w-5 text-indigo-300" />
                <CardTitle className="text-xl text-white">Engagement & community</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Boost visibility with live polls, networking, speaker resources, and post-event gratitude.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6">
              {communityTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <div key={tile.title} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
                    <span className="rounded-2xl border border-slate-800 bg-slate-900/60 p-2 text-sky-400">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{tile.title}</p>
                      <p className="text-sm text-slate-400">{tile.detail}</p>
                    </div>
                  </div>
                );
              })}
              <Button className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 text-sm font-semibold text-slate-200 hover:border-sky-500/40 hover:text-white">
                Launch engagement playbook
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
