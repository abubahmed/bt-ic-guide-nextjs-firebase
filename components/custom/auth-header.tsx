import Link from "next/link";

export default function AuthHeader( { visitorNav }: { visitorNav: { href: string; label: string }[] } ) {
  return (
    <header className="border-b border-slate-900/10 bg-white/80 backdrop-blur shadow-sm">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:flex-nowrap">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-800">
            BTIC Ops
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Business Today</p>
            <p className="text-sm text-slate-600">Attendee portal</p>
          </div>
        </div>
        <nav className="flex flex-1 items-center justify-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
          {visitorNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-transparent px-4 py-1.5 transition hover:border-sky-400/40 hover:text-sky-600">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2">
          <p className="text-xs text-slate-500">
            Need staff access?{" "}
            <Link href="/staff/auth/login" className="font-semibold text-sky-600 hover:text-sky-700">
              Staff sign-in
            </Link>
          </p>
        </div>
      </div>
    </header>
  );
}
