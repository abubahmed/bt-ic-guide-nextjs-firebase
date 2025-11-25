"use client";

import { useState } from "react";

import { primaryNav, staffProfile } from "../(dashboard)/static-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const quickLinks = ["People", "Schedules", "Rooms", "QR Codes", "Help", "Announcements"];
  const [quickLinkValue, setQuickLinkValue] = useState(quickLinks[0]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-900/70 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-slate-300 lg:px-0">
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <nav className="hidden flex-1 flex-wrap items-center gap-2 md:flex">
            {quickLinks.map((item) => (
              <span
                key={item}
                className="rounded-2xl border border-transparent bg-white/5 px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-slate-300 transition hover:bg-slate-900/70 hover:text-white">
                {item}
              </span>
            ))}
          </nav>

          <div className="w-full md:hidden">
            <Select value={quickLinkValue} onValueChange={setQuickLinkValue}>
              <SelectTrigger className="h-9 w-full rounded-2xl border-slate-800 bg-slate-900/80 text-[0.6rem] uppercase tracking-[0.35em] text-slate-200">
                <SelectValue placeholder="Quick links" />
              </SelectTrigger>
              <SelectContent className="border border-slate-800 bg-slate-950 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100">
                {quickLinks.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-1 items-center justify-end">
            <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-900/60 bg-slate-950/60 px-4 py-2 sm:w-auto">
              <Avatar className="size-10 border border-slate-800 bg-slate-900">
                <AvatarImage src="/images/profile-placeholder.jpg" alt={staffProfile.name} />
                <AvatarFallback className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-100">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col text-left text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 sm:text-right">
                <span className="text-[0.8rem] uppercase tracking-[0.25em] text-white">{staffProfile.name}</span>
                <span className="text-slate-500">{staffProfile.email}</span>
              </div>
              <Button
                onClick={async () => await signOutActionClient(router)}
                size="sm"
                className="h-9 rounded-2xl bg-white px-4 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-950">
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
