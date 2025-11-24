"use client";

import { useState } from "react";
import { ArrowUpRight, ClipboardList, LifeBuoy, Megaphone, QrCode, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StaffHeader from "./components/header";
import StaffFooter from "./components/footer";
import QuickActionButton from "./components/quick-action-button";
import {
  stats,
  quickActions,
  scheduleViews,
  announcements,
  helpRequests,
  resourceLibraryItems,
  roomAssignments,
  accessControls,
} from "./static-data";

const actionLabels = quickActions.reduce<Record<string, string>>((acc, action) => {
  acc[action.slug] = action.label;
  return acc;
}, {});

type ScheduleKey = keyof typeof scheduleViews;

const scheduleOptions: { id: ScheduleKey; label: string }[] = Object.entries(scheduleViews).map(([key, value]) => ({
  id: key as ScheduleKey,
  label: value.label,
}));

export default function StaffDashboardPage() {
  const [scheduleKey, setScheduleKey] = useState<ScheduleKey>("phoenix");
  const currentSchedule = scheduleViews[scheduleKey];

  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <StaffHeader />
        <section className="rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-950 p-8 shadow-[0px_30px_80px_rgba(2,6,23,0.7)]">
          <div className="flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
            <span>Business Today International Conference</span>
            <span className="h-px w-8 bg-slate-800" />
            <span>Staff admin command center</span>
          </div>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white md:text-4xl">Lead Staffer Dashboard</h1>
              <p className="mt-3 max-w-2xl text-base text-slate-400">
                Business Today International Conference Operations Dashboard
              </p>
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
          {quickActions.map((action) => (
            <QuickActionButton key={action.label} action={action} />
          ))}
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
                Keep room numbers, floor assignments, and QR badge access distinct from static resources so staffers
                never mix feeds.
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
                    className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
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
                Manage admins, staffers, speakers, and attendees—email verification plus spreadsheet presence remain the
                source of truth.
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
      <StaffFooter />
    </main>
  );
}
