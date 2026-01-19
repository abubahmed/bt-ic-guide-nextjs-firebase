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
      href={action.href}
      aria-label={`Open ${action.label}`}
      target="_blank"
      className="group relative flex flex-col gap-3  border border-slate-700/60 bg-slate-800/20 p-6 transition-all hover:border-slate-600/80 hover:bg-slate-800/70 hover:shadow-lg h-full">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/50 text-sky-400 transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        <ArrowUpRight className="h-5 w-5 text-slate-400 transition-colors" />
      </div>
      <div className="flex-1 space-y-1">
        <h3 className="text-base font-semibold text-white transition-colors group-hover:text-sky-100">
          {action.label}
        </h3>
        <p className="text-sm text-slate-400">{action.description}</p>
      </div>
    </Link>
  );
}
