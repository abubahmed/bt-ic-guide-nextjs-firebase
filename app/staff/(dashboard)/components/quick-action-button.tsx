import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  label: string;
  href: string;
  icon: React.ElementType;
}

export default function QuickActionButton({ action }: { action: QuickAction }) {
  const Icon = action.icon;
  return (
    <Link
      key={action.label}
      href={action.href}
      aria-label={action.label}
      target="_blank"
      className="group flex min-h-[100px] items-center gap-4 rounded-3xl border border-slate-800/60 bg-slate-900/40 p-5 text-left transition hover:-translate-y-0.5 hover:border-sky-500/50 hover:bg-slate-900/80">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 text-sky-400">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{action.label}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-sky-400" />
    </Link>
  );
}
