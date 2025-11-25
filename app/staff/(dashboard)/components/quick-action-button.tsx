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
      className="group relative isolate flex items-center gap-5 overflow-hidden rounded-3xl border border-white/5 bg-slate-950/40 p-6 text-left text-white shadow-[0_25px_50px_-35px_rgba(56,189,248,0.8)] transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/60 hover:bg-slate-950/70 hover:shadow-[0_28px_60px_-25px_rgba(14,165,233,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
      type="button">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/15 via-transparent to-cyan-400/20 opacity-0 transition duration-300 group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 translate-y-8 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.45),_transparent_60%)] opacity-0 blur-2xl transition duration-500 group-hover:translate-y-0 group-hover:opacity-80"
      />
      <div className="relative flex h-14 w-14 items-center justify-center rounded-[20px] bg-sky-500/15 text-sky-300 ring-1 ring-inset ring-sky-400/30 transition group-hover:bg-sky-500/25 group-hover:text-sky-100">
        <Icon className="h-5 w-5" />
      </div>
      <div className="relative flex-1">
        <p className="text-[15px] font-semibold text-white">{action.label}</p>
        <p className="mt-1 text-sm text-slate-400">{action.description}</p>
      </div>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-slate-300 transition group-hover:bg-sky-500/20 group-hover:text-sky-100">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </button>
  );
}
