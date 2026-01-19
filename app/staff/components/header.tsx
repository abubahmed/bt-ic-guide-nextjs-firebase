"use client";

import { useState } from "react";

import { staffProfile, navLinks } from "./data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { signOutActionClient } from "@/actions/auth/client";
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
    <header className="top-0 z-20 border-b border-slate-700/70 bg-slate-900/85 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-slate-300 lg:px-0">
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <nav className="hidden flex-1 flex-wrap items-center gap-2 md:flex">
            {navLinks
              .filter((item) => item.key !== currentPage)
              .map((item) => {
                if (item.key === "logout") {
                  return (
                    <Button
                      key={item.key}
                      onClick={async () => await signOutActionClient(router)}
                      size="sm"
                      className="rounded-2xl border border-transparent bg-white/5 px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-slate-300 transition hover:bg-slate-800/70 hover:text-white">
                      Log out
                    </Button>
                  );
                }

                return (
                  <Link
                    target="_blank"
                    href={item.href}
                    key={item.key}
                    className={`rounded-2xl border border-transparent bg-white/5 px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-slate-300 transition hover:bg-slate-800/70 hover:text-white`}>
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <div className="w-full md:hidden">
            <Select value={quickLinkValue} onValueChange={(value) => setQuickLinkValue(value as string)}>
              <SelectTrigger className="h-9 w-full rounded-2xl border-slate-700 bg-slate-800/80 text-[0.6rem] uppercase tracking-[0.35em] text-slate-200">
                <SelectValue placeholder="Quick links" />
              </SelectTrigger>
              <SelectContent className="border border-slate-700 bg-slate-900/90 text-[0.65rem] uppercase tracking-[0.3em] text-slate-100">
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

          <div className="flex flex-1 items-center justify-end">
            <div className="flex w-full items-center gap-3 bg-transparent px-4 py-2 sm:w-auto">
              <div className="flex flex-1 flex-col text-left text-[0.65rem] text-slate-400 sm:text-right">
                <span className="text-sm text-white">{staffProfile.name}</span>
                <span className="text-sm slate-500">{staffProfile.email}</span>
              </div>{" "}
              <Avatar className="size-10 border border-slate-700 bg-slate-800">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${staffProfile.name}`} alt={staffProfile.name} />
                <AvatarFallback className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-100">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
