import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

export default function QuickActionButton({ action }: { action: QuickAction }) {
  const Icon = action.icon;

  return (
    <Link
      key={action.label}
      href={action.href}
      aria-label={action.label}
      target="_blank"
      className="group flex h-full min-h-[180px] flex-col justify-between rounded-[28px] border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,1)] transition duration-300 hover:border-sky-500/40 hover:shadow-[0_30px_90px_-40px_rgba(56,189,248,0.5)]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/30">
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full border border-slate-800/70 bg-slate-900/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-400">
          Quick action
        </span>
      </div>

      <div className="mt-6 flex-1">
        <p className="text-base font-semibold text-white">{action.label}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{action.description}</p>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm font-medium text-slate-400">
        <span className="transition group-hover:text-sky-300">Launch workspace</span>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800/70 bg-slate-900/70 text-slate-300 transition group-hover:border-sky-500/50 group-hover:text-sky-300">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}
