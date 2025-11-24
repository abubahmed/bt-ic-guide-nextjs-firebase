export default function StaffFooter() {
  return (
    <footer className="border-t border-slate-900/60 bg-slate-950/90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-0">
        <p className="text-[0.75rem] text-slate-400">
          © 2025 Business Today · Annual International Conference Operations
        </p>
        <div className="flex flex-wrap items-center gap-4 text-[0.65rem] font-semibold uppercase tracking-[0.3em]">
          <button className="transition hover:text-sky-300">Support</button>
          <button className="transition hover:text-sky-300">Ops Playbook</button>
          <button className="transition hover:text-sky-300">Privacy</button>
        </div>
      </div>
    </footer>
  );
}
