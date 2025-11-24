import { primaryNav, staffProfile } from "../static-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOutActionClient } from "@/actions/client/auth-actions";
import { useRouter } from "next/navigation";

export default function StaffHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-900/70 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 lg:flex-nowrap lg:px-0">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm font-semibold text-white">
            BTIC Ops
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Business Today</p>
            <p className="text-sm text-slate-300">Annual International Conference</p>
          </div>
        </div>
        <nav className="flex flex-1 items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          {primaryNav.map((link) => (
            <button
              key={link.slug}
              data-nav={link.slug}
              className="rounded-full border border-transparent px-4 py-1.5 transition hover:border-sky-500/40 hover:text-sky-300">
              {link.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2">
          <Avatar className="size-10 border border-slate-800 bg-slate-900">
            <AvatarFallback className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
              {staffProfile.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-semibold text-white">{staffProfile.name}</p>
            <p className="text-xs text-slate-400">{staffProfile.email}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 rounded-xl border-slate-700 bg-transparent text-[0.65rem] uppercase tracking-[0.25em] text-slate-200">
              Switch
            </Button>
            <Button
              onClick={async () => await signOutActionClient(router)}
              size="sm"
              className="h-7 rounded-xl bg-slate-100 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-slate-900">
              Log out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
