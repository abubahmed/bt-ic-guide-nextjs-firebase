import { primaryNav, staffProfile } from "../static-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-slate-300 lg:flex-nowrap lg:px-0">
        <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em]"></div>

        <nav className="flex flex-1 items-center justify-start gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:justify-center">
          {primaryNav.map((link) => (
            <button
              key={link.slug}
              type="button"
              className="rounded-full px-3 py-1 text-slate-500 transition hover:bg-slate-900/70 hover:text-sky-200">
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 rounded-full border border-slate-900/60 bg-slate-950/60 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.3em] sm:flex-none">
          <div className="flex items-center gap-2">
            <Avatar className="size-9 border border-slate-800 bg-slate-900">
              <AvatarImage src="/images/profile-placeholder.jpg" alt={staffProfile.name} />
              <AvatarFallback className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-100">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden min-w-[140px] text-[0.6rem] text-slate-200 sm:flex">
              <span>{staffProfile.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={async () => await signOutActionClient(router)}
              size="sm"
              className="h-7 rounded-full bg-slate-100 px-3 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-900">
              Log out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
