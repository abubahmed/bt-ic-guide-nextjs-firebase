"use client";

import StaffHeader from "../components/header";
import StaffFooter from "../components/footer";
import QuickActionButton from "./components/quick-action-button";
import { stats, quickActions } from "./data";
import StatCard from "./components/stat-card";

export default function StaffDashboardPage() {
  return (
    <main className="min-h-dvh bg-slate-900 text-slate-100">
      <StaffHeader currentPage="home" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
        <section className="rounded-[32px] border border-slate-700 bg-slate-800/70 p-8 shadow-[0px_30px_80px_rgba(2,6,23,0.3)]">
          <div>
            <h1 className="text-3xl font-semibold text-white md:text-4xl">Admin Staffer Dashboard</h1>
            <p className="mt-3 max-w-2xl text-base text-slate-400">
              Business Today International Conference Admin Staff Dashboard
            </p>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Event metrics</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {stats.map((stat) => {
                return <StatCard key={stat.label} stat={stat} />;
              })}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Quick action buttons</h2>
            <div className="rounded-[28px] border border-slate-700/70 bg-slate-900/50 overflow-hidden">
              <div className="grid md:grid-cols-2 auto-rows-fr lg:grid-cols-2">
                {quickActions.map((action) => (
                  <div key={action.label} className="h-full w-full">
                    <QuickActionButton action={action} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <StaffFooter />
    </main>
  );
}
