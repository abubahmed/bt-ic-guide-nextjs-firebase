"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signInWithGoogleActionClient, signInWithEmailActionClient } from "@/actions/client/auth-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import GoogleButton from "@/components/custom/google-button";
import AuthInput from "@/components/custom/auth-input";

const visitorNav = [
  { href: "/", label: "Home" },
  { href: "/auth/signup", label: "Apply" },
  { href: "/auth/invite-request", label: "Support" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900/95 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:flex-nowrap">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-sky-400/40 bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-100">
              BTIC Ops
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Business Today</p>
              <p className="text-sm text-slate-300">Attendee portal</p>
            </div>
          </div>
          <nav className="flex flex-1 items-center justify-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
            {visitorNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-transparent px-4 py-1.5 transition hover:border-sky-400/40 hover:text-sky-200">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-300">
            Need staff access?{" "}
            <Link href="/staff/auth/login" className="font-semibold text-sky-200 hover:text-sky-100">
              Staff sign-in
            </Link>
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="relative w-full max-w-3xl">
          <div className="absolute inset-0 -translate-x-6 translate-y-6 rounded-[40px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(12,74,110,0.45),_transparent_60%)] blur-3xl" />
          <div className="relative grid gap-8 rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_40px_120px_rgba(2,6,23,0.55)] backdrop-blur-3xl sm:p-12 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-7">
              <header className="space-y-3">
                <Badge className="rounded-full border border-white/15 bg-white/5 text-[0.6rem] uppercase tracking-[0.4em] text-sky-200">
                  Attendee
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
                  <p className="text-sm text-slate-300">
                    Use your confirmed attendee email to stay synced with live schedules, reminders, and announcements.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-200">
                    Email
                  </Label>
                  <AuthInput
                    id="email"
                    type="email"
                    placeholder="name@businesstoday.org"
                    autoComplete="email"
                    staff={false}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <Label htmlFor="password" className="font-medium text-slate-200">
                      Password
                    </Label>
                    <Link href="/auth/forgot-password" className="text-sky-300 hover:text-sky-100">
                      Forgot?
                    </Link>
                  </div>
                  <AuthInput
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    staff={false}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400"
                  onClick={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    await signInWithEmailActionClient({ email, password }, router);
                    setLoading(false);
                  }}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                </Button>
              </form>

              <GoogleButton
                router={router}
                loading={loading}
                setLoading={setLoading}
                signInWithGoogleAction={signInWithGoogleActionClient}
              />
            </section>

            <aside className="space-y-5 rounded-[24px] border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Need help?</p>
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                  <p className="font-semibold text-white">No invite yet?</p>
                  <p>
                    Make sure your email is in our approved spreadsheet. Otherwise, submit a quick{" "}
                    <Link href="/auth/invite-request" className="font-semibold text-sky-200 hover:text-sky-100">
                      request for approval
                    </Link>
                    .
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                  <p className="font-semibold text-white">First-timer?</p>
                  <p>
                    Create your attendee profile through the{" "}
                    <Link href="/auth/signup" className="font-semibold text-sky-200 hover:text-sky-100">
                      sign-up flow
                    </Link>
                    . Use the same email you submitted in your application.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                  <p className="font-semibold text-white">Switching to staff?</p>
                  <p>
                    Head to the{" "}
                    <Link href="/staff/auth/login" className="font-semibold text-sky-200 hover:text-sky-100">
                      staff portal
                    </Link>{" "}
                    and use your admin invite.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <footer className="border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Business Today · Attendee Operations</p>
          <div className="flex flex-wrap items-center gap-4 text-[0.6rem] font-semibold uppercase tracking-[0.3em]">
            <Link href="/about" className="transition hover:text-sky-200">
              About
            </Link>
            <Link href="/faq" className="transition hover:text-sky-200">
              FAQ
            </Link>
            <Link href="/contact" className="transition hover:text-sky-200">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
