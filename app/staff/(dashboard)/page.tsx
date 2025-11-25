"use client";

import { useState } from "react";
import { ArrowUpRight, ClipboardList, LifeBuoy, Megaphone, QrCode, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StaffHeader from "../components/header";
import StaffFooter from "../components/footer";
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
      <StaffHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
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
      </div>
      <StaffFooter />
    </main>
  );
}
