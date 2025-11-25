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
    <header className="sticky top-0 z-20 border-b border-slate-900/70 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 text-xs text-slate-300 lg:px-0">
        <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em]">
          <span className="rounded-full bg-sky-500/20 px-3 py-1 text-sky-100">BTIC Ops</span>
          <span className="hidden text-slate-500 md:inline">NYC Command Deck</span>
        </div>

        <nav className="flex flex-1 items-center justify-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em]">
          {primaryNav.map((link) => (
            <button
              key={link.slug}
              type="button"
              className="rounded-full px-3 py-1 text-slate-500 transition hover:bg-slate-900/70 hover:text-sky-200">
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 rounded-full border border-slate-900/60 bg-slate-950/60 px-3 py-1.5">
          <Avatar className="size-9 border border-slate-800 bg-slate-900">
            <AvatarFallback className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-100">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden min-w-[140px] text-[0.6rem] uppercase tracking-[0.3em] text-slate-400 sm:flex sm:flex-col">
            <span className="text-slate-200">{staffProfile.name}</span>
            <span>{staffProfile.email}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-full border-slate-700 px-3 text-[0.6rem] uppercase tracking-[0.3em] text-slate-200"
            onClick={() => router.push("/staff/account")}>
            Switch
          </Button>
          <Button
            onClick={async () => await signOutActionClient(router)}
            size="sm"
            className="h-7 rounded-full bg-slate-100 px-3 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-900">
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
