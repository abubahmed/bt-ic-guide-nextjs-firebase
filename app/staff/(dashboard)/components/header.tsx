import { primaryNav, staffProfile } from "../static-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOutActionClient } from "@/actions/client/auth-actions";
import { useRouter } from "next/navigation";

export default function StaffHeader() {
  const router = useRouter();
  const initials = staffProfile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-900/70 bg-slate-950/75 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 lg:px-0">
        <div className="flex flex-col gap-4 rounded-[28px] border border-slate-900/60 bg-slate-950/70 px-4 py-4 shadow-[0_10px_50px_rgba(2,6,23,0.55)] lg:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-r from-sky-500/20 via-transparent to-transparent px-5 py-3 shadow-inner shadow-sky-500/20">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-sky-100">BTIC Ops Command</p>
                <p className="text-lg font-semibold text-white">Conference control deck</p>
              </div>
              <div className="hidden text-xs text-slate-400 sm:flex sm:flex-col">
                <p className="flex items-center gap-2 font-semibold uppercase tracking-[0.35em] text-emerald-300">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  Live sync enabled
                </p>
                <p>Business Today International Conference • NYC · Command HQ</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-900/60 bg-slate-950/50 px-3 py-2">
              <Avatar className="size-11 border border-slate-800 bg-slate-900 shadow-[0_0_25px_rgba(56,189,248,0.45)]">
                <AvatarFallback className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-100">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-semibold text-white">{staffProfile.name}</p>
                <p className="text-xs text-slate-400">{staffProfile.email}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-xl border-slate-700 bg-transparent text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-slate-200 hover:border-sky-500/60">
                  Switch role
                </Button>
                <Button
                  onClick={async () => await signOutActionClient(router)}
                  size="sm"
                  className="h-8 rounded-xl bg-gradient-to-r from-slate-100 to-slate-300 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-slate-900">
                  Log out
                </Button>
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-900/70 bg-slate-950/60 p-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            {primaryNav.map((link) => (
              <button
                key={link.slug}
                type="button"
                className="group flex flex-1 min-w-[120px] items-center justify-between gap-3 rounded-2xl px-4 py-2 text-left transition hover:bg-slate-900/80 hover:text-sky-200">
                <span>{link.label}</span>
                <span className="inline-flex h-2 w-2 rounded-full bg-slate-700 transition group-hover:bg-sky-400" />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
