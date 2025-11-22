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
    <div className="flex min-h-svh flex-col bg-slate-50/70">
      <header className="border-b border-slate-900/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:flex-nowrap">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-800">
              BTIC Ops
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Business Today</p>
              <p className="text-sm text-slate-600">Attendee portal</p>
            </div>
          </div>
          <nav className="flex flex-1 items-center justify-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
            {visitorNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-transparent px-4 py-1.5 transition hover:border-sky-400/40 hover:text-sky-600">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2">
            <p className="text-xs text-slate-500">
              Need staff access?{" "}
              <Link href="/staff/auth/login" className="font-semibold text-sky-600 hover:text-sky-700">
                Staff sign-in
              </Link>
            </p>
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="relative w-full max-w-3xl">
          <div className="absolute inset-0 -translate-x-6 translate-y-6 rounded-[40px] bg-gradient-to-br from-sky-200/70 via-white to-white blur-3xl" />
          <div className="relative grid gap-8 rounded-[32px] border border-sky-100/70 bg-white/95 p-6 shadow-[0_25px_90px_rgba(14,28,56,0.18)] backdrop-blur-lg sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-6">
              <header className="space-y-3">
                <Badge className="rounded-full bg-sky-100 text-[0.6rem] uppercase tracking-[0.4em] text-sky-600">
                  Attendee
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-sky-900">Welcome back</h1>
                  <p className="text-sm text-sky-600">
                    Use your confirmed attendee email to stay synced with live schedules, reminders, and announcements.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-sky-800">
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
                    <Label htmlFor="password" className="font-medium text-sky-800">
                      Password
                    </Label>
                    <Link href="/auth/forgot-password" className="text-sky-500 hover:text-sky-600">
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

            <aside className="space-y-5 rounded-[24px] border border-sky-50 bg-gradient-to-b from-white to-sky-50/60 p-6 text-sm text-sky-600">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Need help?</p>
              <div className="space-y-3">
                <div className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-3">
                  <p className="font-semibold text-sky-800">No invite yet?</p>
                  <p>
                    Make sure your email is in our approved spreadsheet. Otherwise, submit a quick{" "}
                    <Link href="/auth/invite-request" className="font-semibold text-sky-600 hover:text-sky-700">
                      request for approval
                    </Link>
                    .
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-3">
                  <p className="font-semibold text-sky-800">First-timer?</p>
                  <p>
                    Create your attendee profile through the{" "}
                    <Link href="/auth/signup" className="font-semibold text-sky-600 hover:text-sky-700">
                      sign-up flow
                    </Link>
                    . Use the same email you submitted in your application.
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-3">
                  <p className="font-semibold text-sky-800">Switching to staff?</p>
                  <p>
                    Head to the{" "}
                    <Link href="/staff/auth/login" className="font-semibold text-sky-600 hover:text-sky-700">
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
      <footer className="border-t border-slate-900/10 bg-white/80">
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
    </div>
  );
}
