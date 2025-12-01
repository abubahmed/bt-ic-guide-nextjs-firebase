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
      className="group flex h-full min-h-[180px] flex-col justify-between rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6 shadow-sm transition-colors duration-200 hover:border-slate-700 hover:bg-slate-900/60">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/60 text-sky-200 ring-1 ring-slate-700/60">
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full border border-slate-800/60 bg-slate-900/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-400">
          Quick action
        </span>
      </div>

      <div className="mt-6 flex-1">
        <p className="text-base font-semibold text-white">{action.label}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{action.description}</p>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm font-medium text-slate-400">
        <span className="transition group-hover:text-slate-200">Launch workspace</span>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800/60 bg-slate-900/60 text-slate-300 transition-colors group-hover:border-slate-700 group-hover:text-slate-200">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}
