import { ArrowUpRight } from "lucide-react";

interface QuickAction {
  label: string;
  slug: string;
  icon: React.ElementType;
  description: string;
}

export default function QuickActionButton({ action }: { action: QuickAction }) {
  const Icon = action.icon;
  return (
    <button
      key={action.label}
      data-action={action.slug}
      aria-label={action.label}
      className="group flex h-full flex-col gap-5 rounded-[28px] border border-slate-800/60 bg-slate-900/50 p-6 text-left transition hover:-translate-y-1 hover:border-sky-500/50 hover:bg-slate-900/80"
      type="button">
      <div className="flex items-center justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/60 text-sky-400">
          <Icon className="h-5 w-5" />
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70 text-slate-500 transition group-hover:border-sky-500/40 group-hover:text-sky-300">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="flex-1">
        <p className="text-base font-semibold text-white">{action.label}</p>
        <p className="mt-2 text-sm text-slate-400">{action.description}</p>
      </div>
    </button>
  );
}
