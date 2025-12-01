import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
  slug: string;
}

export default function QuickActionButton({ action }: { action: QuickAction }) {
  const Icon = action.icon;

  return (
    <article className="flex h-full flex-col rounded-[26px] border border-slate-800/70 bg-slate-950/30 p-6 shadow-[0_20px_55px_rgba(2,6,23,0.4)]">
      <div className="flex items-center justify-between text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
        <span className="rounded-full border border-slate-800/70 bg-slate-900/40 px-3 py-1 text-[0.55rem] tracking-[0.35em] text-slate-300">
          {action.slug}
        </span>
        <span className="text-slate-600">Quick access</span>
      </div>

      <div className="mt-5 flex gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-sky-200 ring-1 ring-slate-700/70">
          <Icon className="h-5 w-5" />
        </span>
        <div className="space-y-2">
          <p className="text-base font-semibold text-white">{action.label}</p>
          <p className="text-sm leading-relaxed text-slate-400">{action.description}</p>
        </div>
      </div>

      <Link
        href={action.href}
        aria-label={`Open ${action.label}`}
        target="_blank"
        className="mt-6 inline-flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-sky-500/40 hover:text-white focus-visible:border-sky-500/60 focus-visible:text-white"
      >
        <span>Open workspace</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/70 text-inherit">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </Link>
    </article>
  );
}
