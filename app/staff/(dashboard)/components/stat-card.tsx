"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Stat {
  label: string;
  value: string;
  meta: string;
  icon: React.ElementType;
  accent: string;
}

export default function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  const router = useRouter();
  return (
    <Card key={stat.label} className="border-slate-700 bg-slate-800/70 text-slate-100 cursor-pointer">
      <CardContent className="relative rounded-2xl border border-slate-700/80 bg-slate-900/50 p-6">
        <div className="relative flex items-start justify-between" onClick={() => router.push(stat.href)}>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{stat.label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-400">{stat.meta}</p>
          </div>
          <span className="rounded-2xl border border-slate-700 bg-slate-800/70 p-3 text-sky-400">
            <Icon className="h-5 w-5" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
