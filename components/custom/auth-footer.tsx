import Link from "next/link";

export default function AuthFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-900/10 bg-white/80 shadow-sm">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {currentYear} Business Today · Attendee Operations</p>
        <div className="flex flex-wrap items-center gap-4 text-[0.6rem] font-semibold uppercase tracking-[0.3em]">
          <Link href="/about" className="transition hover:text-sky-600">
            About
          </Link>
          <Link href="/faq" className="transition hover:text-sky-600">
            FAQ
          </Link>
          <Link href="/contact" className="transition hover:text-sky-600">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
