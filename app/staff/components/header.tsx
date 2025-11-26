"use client";

import { useState } from "react";

import { staffProfile, navLinks } from "./data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { signOutActionClient } from "@/actions/client/auth-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StaffHeader({ currentPage }: { currentPage: string }) {
  const router = useRouter();
  const initials = staffProfile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const [quickLinkValue, setQuickLinkValue] = useState(navLinks[0].label);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-900/70 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-slate-300 lg:px-0">
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <nav className="hidden flex-1 flex-wrap items-center gap-2 md:flex">
            {navLinks
              .filter((item) => item.key !== currentPage)
              .map((item) => (
                <Link
                  target="_blank"
                  href={item.href}
                  key={item.key}
                  className="rounded-2xl border border-transparent bg-white/5 px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-slate-300 transition hover:bg-slate-900/70 hover:text-white">
                  {item.label}
                </Link>
              ))}
          </nav>

          <div className="w-full md:hidden">
            <Select value={quickLinkValue} onValueChange={(value) => setQuickLinkValue(value as string)}>
              <SelectTrigger className="h-9 w-full rounded-2xl border-slate-800 bg-slate-900/80 text-[0.6rem] uppercase tracking-[0.35em] text-slate-200">
                <SelectValue placeholder="Quick links" />
              </SelectTrigger>
              <SelectContent className="border border-slate-800 bg-slate-950 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100">
                {navLinks.map((item) => (
                  <SelectItem key={item.label} value={item.label}>
                    <Link target="_blank" href={item.href} className="transition hover:text-sky-300">
                      {item.label}
                    </Link>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-1 justify-end">
            <div className="w-full rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950/60 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.55)] backdrop-blur-sm sm:max-w-2xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-4">
                  <div className="relative">
                    <Avatar className="size-12 border border-white/10 bg-slate-900 shadow-lg">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${staffProfile.name}`} alt={staffProfile.name} />
                      <AvatarFallback className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-slate-100">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <Badge
                      variant="secondary"
                      className="absolute -bottom-1 right-0 translate-y-1/3 rounded-full border-white/20 bg-white/10 px-3 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.35em] text-slate-100">
                      Staff
                    </Badge>
                  </div>
                  <div className="flex flex-1 flex-col text-left text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                    <span className="text-[0.85rem] uppercase tracking-[0.2em] text-white">{staffProfile.name}</span>
                    <span className="text-slate-500">{staffProfile.email}</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 sm:flex-none sm:items-end">
                  <div className="flex flex-wrap items-center gap-2 text-[0.55rem] uppercase tracking-[0.35em] text-slate-400">
                    <Badge className="rounded-full border-white/10 bg-emerald-500/10 px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-emerald-200">
                      Active shift
                    </Badge>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[0.55rem] tracking-[0.35em] text-slate-300">
                      Shift lead · HQ
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="rounded-full border border-white/10 bg-white/5 px-4 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-100 hover:bg-white/10"
                      onClick={() => router.push("/staff/help")}>
                      Need help?
                    </Button>
                    <Button
                      onClick={async () => await signOutActionClient(router)}
                      size="sm"
                      className="h-9 rounded-full bg-white px-5 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-950 shadow-[0_8px_25px_rgba(248,250,252,0.25)] hover:bg-white/90">
                      Log out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
