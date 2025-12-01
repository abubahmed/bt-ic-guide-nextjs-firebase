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
    <article className="flex h-full flex-col rounded-2xl border border-slate-800/60 bg-slate-950/40 p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-slate-200 ring-1 ring-slate-800">
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full border border-slate-800/50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </span>
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-lg font-semibold text-white">{action.label}</p>
        <p className="text-sm leading-relaxed text-slate-400">{action.description}</p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-4">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Open</p>
        <Link
          href={action.href}
          aria-label={`Open ${action.label}`}
          target="_blank"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800/60 bg-slate-900/60 text-slate-200 transition-colors hover:border-slate-600 hover:text-white focus-visible:border-slate-600 focus-visible:text-white"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
