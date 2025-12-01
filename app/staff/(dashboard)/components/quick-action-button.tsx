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
    <article className="flex items-center gap-6 border border-slate-800/50 bg-slate-950/30 p-6 h-full">
      <div className="flex-1">
        <p className="text-sm mb-1 font-medium text-white">{action.label}</p>
        <p className="text-sm text-slate-400">{action.description}</p>
      </div>
      <div>
        <span className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-200 ring-1 ring-slate-800">
          <Icon className="h-4 w-4" />
        </span>
        <Link
          href={action.href}
          aria-label={`Open ${action.label}`}
          target="_blank"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800/60 text-slate-300 transition-colors hover:border-slate-600 hover:text-white focus-visible:border-slate-600 focus-visible:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
