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
    <article className="flex h-full flex-col rounded-2xl border border-slate-800/60 bg-slate-950/30 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-slate-200 ring-1 ring-slate-800">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-base font-semibold text-white">{action.label}</p>
          <p className="text-xs uppercase tracking-wide text-slate-500">{action.slug}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-400">{action.description}</p>

      <Link
        href={action.href}
        aria-label={`Open ${action.label}`}
        target="_blank"
        className="mt-5 inline-flex items-center gap-3 text-sm font-medium text-slate-200 underline-offset-4 transition-colors hover:text-white focus-visible:text-white"
      >
        <span>Open workspace</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800/60 bg-slate-900/60 text-inherit">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </Link>
    </article>
  );
}
