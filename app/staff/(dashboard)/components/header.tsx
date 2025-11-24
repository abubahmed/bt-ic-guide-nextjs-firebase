import { getTheme } from "@/lib/theme";
import { signOutActionClient } from "@/actions/client/auth-actions";
import { useRouter } from "next/navigation";
import { primaryNav, staffProfile } from "../static-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Header() {
  const theme = getTheme("staff");
  const router = useRouter();
  const headerBorder = theme.id === "staff" ? "border-slate-900/70" : "border-sky-100";
  const headerBg = theme.id === "staff" ? "bg-slate-950/90" : "bg-white";
  const brandPillBorder = theme.id === "staff" ? "border-slate-800" : "border-sky-100";
  const brandPillBg = theme.id === "staff" ? "bg-slate-900" : "bg-white";
  const brandPillText = theme.id === "staff" ? "text-slate-100" : "text-sky-900";
  const navText = theme.id === "staff" ? "text-slate-100" : "text-sky-900";
  const navHover = theme.id === "staff" ? "hover:bg-slate-900/50" : "hover:bg-sky-100";
  const panelBorder = theme.id === "staff" ? "border-slate-800" : "border-sky-100";
  const panelBg = theme.id === "staff" ? "bg-slate-900" : "bg-white";
  const navButtonBorder = theme.id === "staff" ? "border-slate-800" : "border-sky-100";
  const navButtonBg = theme.id === "staff" ? "bg-slate-900" : "bg-white";
  const navButtonText = theme.id === "staff" ? "text-slate-100" : "text-sky-900";
  const navButtonAccentBg = theme.id === "staff" ? "bg-slate-900" : "bg-white";
  const navButtonAccentText = theme.id === "staff" ? "text-slate-100" : "text-sky-900";

  return (
    <header className={`sticky top-0 z-20 border-b ${headerBorder} ${headerBg} backdrop-blur`}>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 lg:flex-nowrap lg:px-0">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-2xl border ${brandPillBorder} ${brandPillBg} px-3 py-2 text-sm font-semibold ${brandPillText}`}>
            BTIC Ops
          </div>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${theme.colors.textMuted}`}>
              Business Today
            </p>
            <p className={`text-sm ${theme.colors.textSecondary}`}>Annual International Conference</p>
          </div>
        </div>
        <nav
          className={`flex flex-1 items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] ${navText}`}>
          {primaryNav.map((link) => (
            <button
              key={link.slug}
              data-nav={link.slug}
              className={`rounded-full border border-transparent px-4 py-1.5 transition ${navHover}`}>
              {link.label}
            </button>
          ))}
        </nav>
        <div className={`flex items-center gap-3 rounded-2xl border ${panelBorder} ${panelBg} px-3 py-2`}>
          <Avatar className={`size-10 border ${panelBorder} ${theme.id === "staff" ? "bg-slate-900" : "bg-white"}`}>
            <AvatarFallback
              className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.colors.textSecondary}`}>
              {staffProfile.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className={`font-semibold ${theme.colors.textPrimary}`}>{staffProfile.name}</p>
            <p className={`text-xs ${theme.colors.textMuted}`}>{staffProfile.email}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              className={`h-7 rounded-xl border ${navButtonBorder} ${navButtonBg} text-[0.65rem] uppercase tracking-[0.25em] ${navButtonText}`}>
              Switch
            </Button>
            <Button
              onClick={async () => await signOutActionClient(router)}
              size="sm"
              className={`h-7 rounded-xl ${navButtonAccentBg} text-[0.65rem] font-semibold uppercase tracking-[0.25em] ${navButtonAccentText}`}>
              Log out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
