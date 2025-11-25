"use client";

import StaffHeader from "../components/header";
import StaffFooter from "../components/footer";
import QuickActionButton from "./components/quick-action-button";
import { stats, quickActions } from "./data";
import StatCard from "./components/stat-card";

export default function StaffDashboardPage() {
  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100">
      <StaffHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-950 p-8 shadow-[0px_30px_80px_rgba(2,6,23,0.7)]">
          <div className="flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-sky-400">
            <span>Business Today International Conference</span>
            <span className="h-px w-8 bg-slate-800" />
            <span>Admin staff dashboard</span>
          </div>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white md:text-4xl">Admin Staffer Dashboard</h1>
              <p className="mt-3 max-w-2xl text-base text-slate-400">
                Business Today International Conference Admin Staff Dashboard
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => {
              return <StatCard key={stat.label} stat={stat} />;
            })}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {quickActions.map((action) => (
            <QuickActionButton key={action.label} action={action} />
          ))}
        </section>
      </div>
      <StaffFooter />
    </main>
  );
}
