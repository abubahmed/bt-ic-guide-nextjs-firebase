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
    <div className="flex h-full min-h-[180px] flex-col justify-between rounded-2xl border border-slate-800/50 bg-slate-900/30 p-6 shadow-sm">
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
        <Link
          href={action.href}
          aria-label={`Open ${action.label}`}
          target="_blank"
          className="text-slate-300 underline-offset-4 transition-colors hover:text-white focus-visible:text-white"
        >
          Launch workspace
        </Link>
        <Link
          href={action.href}
          aria-label={`Open ${action.label}`}
          target="_blank"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800/60 bg-slate-900/60 text-slate-300 transition-colors hover:border-slate-700 hover:text-white focus-visible:border-slate-600 focus-visible:text-white"
        >
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
