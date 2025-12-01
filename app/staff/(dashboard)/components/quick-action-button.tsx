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
    <article className="flex h-full flex-col gap-4 rounded-xl border border-slate-800/50 bg-slate-950/30 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-slate-200 ring-1 ring-slate-800">
          <Icon className="h-5 w-5" />
        </span>
        <p className="text-base font-semibold text-white">{action.label}</p>
      </div>

      <p className="text-sm leading-relaxed text-slate-400">{action.description}</p>

      <div className="flex justify-end">
        <Link
          href={action.href}
          aria-label={`Open ${action.label}`}
          target="_blank"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800/60 bg-slate-900/50 text-slate-200 transition-colors hover:border-slate-600 hover:text-white focus-visible:border-slate-600 focus-visible:text-white"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
