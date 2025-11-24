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
import { signOutActionClient } from "@/actions/client/auth-actions";
import { getTheme } from "@/lib/theme";
import { useRouter } from "next/navigation";
import {
  scheduleViews,
  stats,
  actionLabels,
  quickActions,
  primaryNav,
  staffProfile,
  announcements,
  helpRequests,
  roomAssignments,
  resourceLibraryItems,
  accessControls,
} from "./static-data";

type ScheduleKey = keyof typeof scheduleViews;

const scheduleOptions: { id: ScheduleKey; label: string }[] = Object.entries(scheduleViews).map(([key, value]) => ({
  id: key as ScheduleKey,
  label: value.label,
}));

export default function StaffDashboardPage() {
  const router = useRouter();
  const [scheduleKey, setScheduleKey] = useState<ScheduleKey>("phoenix");
  const currentSchedule = scheduleViews[scheduleKey];
  const theme = getTheme("staff");

  const pageShell = `${theme.colors.page} ${theme.colors.textBase}`;
  const headerBorder = theme.id === "staff" ? "border-slate-900/70" : "border-sky-100";
  const headerBg = theme.id === "staff" ? "bg-slate-950/80" : "bg-white/85";
  const brandPillBorder = theme.id === "staff" ? "border-sky-500/30" : "border-sky-200/80";
  const brandPillBg = theme.id === "staff" ? "bg-sky-500/10" : "bg-sky-100/60";
  const brandPillText = theme.id === "staff" ? theme.colors.textPrimary : "text-sky-900";
  const navText = theme.id === "staff" ? "text-slate-500" : "text-sky-700";
  const navHover = theme.id === "staff" ? "hover:text-sky-300" : "hover:text-sky-800";
  const navButtonBorder = theme.id === "staff" ? "border-slate-700" : "border-sky-200";
  const navButtonText = theme.id === "staff" ? "text-slate-200" : "text-sky-800";
  const navButtonBg = theme.id === "staff" ? "bg-transparent" : "bg-white";
  const navButtonAccentBg = theme.id === "staff" ? "bg-slate-100" : "bg-sky-900";
  const navButtonAccentText = theme.id === "staff" ? "text-slate-900" : "text-white";
  const panelBorder = `${theme.colors.borderStrong}`;
  const panelBg = theme.id === "staff" ? "bg-slate-900/60" : "bg-white/85";
  const panelGradient =
    theme.id === "staff"
      ? "bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-950"
      : "bg-gradient-to-br from-white via-sky-50/60 to-white";
  const panelTint = theme.id === "staff" ? "bg-slate-950/40" : "bg-white";
  const dividerBorder = theme.id === "staff" ? "border-slate-800/70" : "border-sky-100";
  const mutedPanelBg = theme.id === "staff" ? "bg-slate-950/50" : "bg-white";
  const hoverAccent =
    theme.id === "staff" ? "hover:border-sky-500/50 hover:bg-slate-900/80" : "hover:border-sky-400 hover:bg-white";
  const footerBorder = theme.id === "staff" ? "border-slate-900/60" : "border-sky-100";
  const footerBg = theme.id === "staff" ? "bg-slate-950/90" : "bg-white";
  const dividerBg = theme.id === "staff" ? "bg-slate-800" : "bg-sky-200";

  return (
    <main className={`min-h-dvh ${pageShell}`}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className={`rounded-[32px] border ${panelBorder} ${panelGradient} p-8 shadow-sm`}>
          <div className="flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
            <span>Business Today International Conference</span>
            <span className={`h-px w-8 ${dividerBg}`} />
            <span>Staff admin command center</span>
          </div>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className={`text-3xl font-semibold ${theme.colors.textPrimary} md:text-4xl`}>
                Lead Staffer Dashboard
              </h1>
              <p className={`mt-3 max-w-2xl text-base ${theme.colors.textMuted}`}>
                Business Today International Conference Operations Dashboard
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className={`border ${panelBorder} ${panelBg} ${theme.colors.textBase}`}>
                  <CardContent className={`relative rounded-2xl border ${panelBorder} ${panelTint} p-6`}>
                    <span
                      className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.accent} opacity-70`}
                    />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className={`text-sm uppercase tracking-[0.35em] ${navText}`}>{stat.label}</p>
                        <p className={`mt-4 text-3xl font-semibold ${theme.colors.textPrimary}`}>{stat.value}</p>
                        <p className={`mt-2 text-sm ${theme.colors.textMuted}`}>{stat.meta}</p>
                      </div>
                      <span className={`rounded-2xl border ${panelBorder} ${panelBg} p-3 text-sky-400`}>
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
                className={`group flex items-center gap-4 rounded-3xl border ${panelBorder} ${panelBg} p-5 text-left transition hover:-translate-y-0.5 shadow-sm ${hoverAccent}`}
                type="button">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${panelBorder} ${panelTint} text-sky-400`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${theme.colors.textPrimary}`}>{action.label}</p>
                  <p className={`text-sm ${theme.colors.textMuted}`}>{action.description}</p>
                </div>
                <ArrowUpRight className={`h-4 w-4 ${navText} transition group-hover:text-sky-400`} />
              </button>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.75fr_1fr]">
          <Card data-action="schedules" className={`border ${panelBorder} ${panelBg} ${theme.colors.textBase}`}>
            <CardHeader className={`flex flex-col gap-4 border-b ${dividerBorder} pb-6`}>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={`rounded-full border ${navButtonBorder} ${panelTint} text-xs uppercase tracking-[0.35em] ${theme.colors.textMuted}`}>
                  Schedules
                </Badge>
                <p className={`text-xs ${navText}`}>Imported from spreadsheets or manual entries</p>
              </div>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className={`text-2xl ${theme.colors.textPrimary}`}>Personal timelines</CardTitle>
                  <CardDescription className={theme.colors.textMuted}>
                    Select any attendee, staffer, or team to preview their schedule and/or make updates.
                  </CardDescription>
                </div>
                <Select value={scheduleKey} onValueChange={(value) => setScheduleKey(value as ScheduleKey)}>
                  <SelectTrigger
                    className={`rounded-2xl border ${navButtonBorder} ${panelTint} ${theme.colors.textBase}`}>
                    <SelectValue placeholder="Choose schedule" />
                  </SelectTrigger>
                  <SelectContent
                    className={`border ${panelBorder} ${theme.id === "staff" ? "bg-slate-950/90" : "bg-white"} ${
                      theme.colors.textBase
                    }`}>
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
                  className={`rounded-2xl border ${panelBorder} ${mutedPanelBg} p-4 transition hover:border-sky-500/50`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className={`text-lg font-semibold ${theme.colors.textPrimary}`}>{slot.time}</p>
                    <Badge className={`rounded-full ${panelTint} text-xs ${theme.colors.textSecondary}`}>
                      {slot.location}
                    </Badge>
                  </div>
                  <p className={`mt-2 text-base font-semibold ${theme.colors.textPrimary}`}>{slot.title}</p>
                  <p className={`text-sm ${theme.colors.textMuted}`}>{slot.detail}</p>
                </div>
              ))}
            </CardContent>
            <CardContent className={`border-t ${dividerBorder} pt-6`}>
              <Button
                className={`w-full rounded-2xl border border-sky-500/40 ${
                  theme.id === "staff"
                    ? "bg-slate-950/60 text-sky-200 hover:bg-slate-900"
                    : "bg-white text-sky-800 hover:bg-sky-50"
                }`}>
                Open {currentSchedule.label} workspace
              </Button>
            </CardContent>
          </Card>

          <Card data-action="announcements" className={`border ${panelBorder} ${panelBg} ${theme.colors.textBase}`}>
            <CardHeader className={`border-b ${dividerBorder} pb-6`}>
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-sky-400" />
                <CardTitle className={`text-xl ${theme.colors.textPrimary}`}>{actionLabels.announcements}</CardTitle>
              </div>
              <CardDescription className={theme.colors.textMuted}>
                Stage occasional reminders, compose announcements, or send team-specific messages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {announcements.map((announcement) => {
                const Icon = announcement.icon;
                return (
                  <div key={announcement.title} className={`rounded-2xl border ${panelBorder} ${mutedPanelBg} p-4`}>
                    <div className="flex items-start gap-3">
                      <span className={`rounded-2xl border ${panelBorder} ${panelTint} p-2 text-sky-400`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className={`text-sm font-semibold ${theme.colors.textPrimary}`}>{announcement.title}</p>
                        <p className={`text-sm ${theme.colors.textMuted}`}>{announcement.detail}</p>
                        <Badge className={`mt-3 rounded-full ${panelTint} text-xs ${theme.colors.textSecondary}`}>
                          {announcement.channel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
            <CardContent className={`border-t ${dividerBorder} pt-6`}>
              <div className="grid gap-3">
                <Button className="w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white hover:bg-sky-400">
                  Compose from scratch
                </Button>
                <Button
                  className={`w-full rounded-2xl border ${navButtonBorder} ${panelTint} text-sm font-semibold ${theme.colors.textBase} hover:border-sky-500/60`}>
                  Schedule reminder window
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card data-action="help" className={`border ${panelBorder} ${panelBg} ${theme.colors.textBase}`}>
            <CardHeader className={`border-b ${dividerBorder} pb-6`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <LifeBuoy className="h-5 w-5 text-rose-400" />
                  <CardTitle className={`text-xl ${theme.colors.textPrimary}`}>{actionLabels.help}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className={`rounded-xl border ${navButtonBorder} ${panelTint} text-xs font-semibold ${theme.colors.textBase} hover:border-sky-500/60`}>
                  Open queue
                </Button>
              </div>
              <CardDescription className={theme.colors.textMuted}>
                Answer attendee questions, escalate to leaders, or dispatch on-site support right from the queue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {helpRequests.map((request) => (
                <div key={request.team} className={`rounded-2xl border ${panelBorder} ${panelTint} p-4`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className={`text-sm font-semibold ${theme.colors.textPrimary}`}>{request.team}</p>
                    <Badge className={`rounded-full ${panelTint} text-xs ${theme.colors.textSecondary}`}>
                      {request.priority} priority
                    </Badge>
                    <span className={`text-xs ${navText}`}>{request.minutes}</span>
                  </div>
                  <p className={`mt-2 text-sm ${theme.colors.textSecondary}`}>{request.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card data-action="rooms" className={`border ${panelBorder} ${panelBg} ${theme.colors.textBase}`}>
            <CardHeader className={`border-b ${dividerBorder} pb-6`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <QrCode className="h-5 w-5 text-sky-400" />
                  <CardTitle className={`text-xl ${theme.colors.textPrimary}`}>{actionLabels.rooms}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className={`rounded-xl border ${navButtonBorder} ${panelTint} text-xs font-semibold ${theme.colors.textBase} hover:border-sky-500/60`}>
                  Manage rooms
                </Button>
              </div>
              <CardDescription className={theme.colors.textMuted}>
                Keep room numbers, floor assignments, and QR badge access distinct from static resources so staffers
                never mix feeds.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {roomAssignments.map((room) => (
                <div key={room.label} className={`rounded-2xl border ${panelBorder} ${mutedPanelBg} p-4`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className={`text-sm font-semibold ${theme.colors.textPrimary}`}>{room.label}</p>
                    <Badge className={`rounded-full ${panelTint} text-xs ${theme.colors.textSecondary}`}>
                      {room.qr}
                    </Badge>
                  </div>
                  <p className={`text-sm ${theme.colors.textMuted}`}>{room.detail}</p>
                  <p className={`text-xs uppercase tracking-[0.35em] ${navText}`}>Access: {room.access}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card data-action="resources" className={`border ${panelBorder} ${panelBg} ${theme.colors.textBase}`}>
            <CardHeader className={`border-b ${dividerBorder} pb-6`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-amber-300" />
                  <CardTitle className={`text-xl ${theme.colors.textPrimary}`}>{actionLabels.resources}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className={`rounded-xl border ${navButtonBorder} ${panelTint} text-xs font-semibold ${theme.colors.textBase} hover:border-sky-500/60`}>
                  Open library
                </Button>
              </div>
              <CardDescription className={theme.colors.textMuted}>
                Static files that never rely on spreadsheets—slide decks, surveys, historical one-pagers, and
                reimbursement forms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {resourceLibraryItems.map((resource) => {
                const Icon = resource.icon;
                return (
                  <div
                    key={resource.label}
                    className={`flex items-start gap-3 rounded-2xl border ${panelBorder} ${mutedPanelBg} p-4`}>
                    <span className={`rounded-2xl border ${panelBorder} ${panelTint} p-2 text-sky-300`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className={`text-sm font-semibold ${theme.colors.textPrimary}`}>{resource.label}</p>
                      <p className={`text-sm ${theme.colors.textMuted}`}>{resource.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card data-action="roles" className={`border ${panelBorder} ${panelBg} ${theme.colors.textBase}`}>
            <CardHeader className={`border-b ${dividerBorder} pb-6`}>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-emerald-300" />
                <CardTitle className={`text-xl ${theme.colors.textPrimary}`}>{actionLabels.roles}</CardTitle>
              </div>
              <CardDescription className={theme.colors.textMuted}>
                Manage admins, staffers, speakers, and attendees—email verification plus spreadsheet presence remain the
                source of truth.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {accessControls.map((item) => (
                <div key={item.title} className={`rounded-2xl border ${panelBorder} ${mutedPanelBg} p-4`}>
                  <p className={`text-sm font-semibold ${theme.colors.textPrimary}`}>{item.title}</p>
                  <p className={`text-sm ${theme.colors.textMuted}`}>{item.detail}</p>
                </div>
              ))}
              <div className="flex flex-wrap gap-3">
                <Button
                  className={`flex-1 rounded-2xl border border-sky-500/40 ${
                    theme.id === "staff"
                      ? "bg-slate-950/60 text-sky-200 hover:bg-slate-900"
                      : "bg-white text-sky-800 hover:bg-sky-50"
                  }`}>
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
      <footer className={`border-t ${footerBorder} ${footerBg}`}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-0">
          <p className={`text-[0.75rem] ${theme.colors.textMuted}`}>
            © 2025 Business Today · Annual International Conference Operations
          </p>
          <div
            className={`flex flex-wrap items-center gap-4 text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${navText}`}>
            <button className={`transition ${navHover}`}>Support</button>
            <button className={`transition ${navHover}`}>Ops Playbook</button>
            <button className={`transition ${navHover}`}>Privacy</button>
          </div>
        </div>
      </footer>
    </main>
  );
}
