"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import AuthInput from "@/components/custom/auth-input";
import GoogleButton from "@/components/custom/google-button";
import { signInWithGoogleActionClient } from "@/actions/client/auth-actions";

const visitorNav = [
  { href: "/", label: "Home" },
  { href: "/auth/login", label: "Login" },
  { href: "/auth/invite-request", label: "Support" },
];

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
              <p className="text-sm text-slate-300">Attendee registration</p>
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
            Already confirmed?{" "}
            <Link href="/auth/login" className="font-semibold text-sky-200 hover:text-sky-100">
              Sign in
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
                  Apply
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-white">Create attendee profile</h1>
                  <p className="text-sm text-slate-300">
                    Register with the same email you used to apply. Once verified, you’ll unlock personalized schedules,
                    notifications, and QR access.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className="text-sm font-medium text-slate-200">
                    Full name
                  </Label>
                  <AuthInput
                    id="full-name"
                    type="text"
                    placeholder="First Last"
                    autoComplete="name"
                    staff={false}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

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
                  <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                    Password
                  </Label>
                  <AuthInput
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    staff={false}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-slate-200">
                    Confirm password
                  </Label>
                  <AuthInput
                    id="confirm-password"
                    type="password"
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    staff={false}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400"
                  onClick={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    await new Promise((resolve) => setTimeout(resolve, 1200));
                    setLoading(false);
                    router.push("/auth/login");
                  }}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
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
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Before you start</p>
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                  <p className="font-semibold text-white">Use your approved email</p>
                  <p>
                    We cross-check every sign-up with the spreadsheet submitted by the conference team. If your email isn’t
                    listed, file a{" "}
                    <Link href="/auth/invite-request" className="font-semibold text-sky-200 hover:text-sky-100">
                      quick request
                    </Link>
                    .
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                  <p className="font-semibold text-white">Multi-device access</p>
                  <p>
                    You can sign in from mobile or desktop. QR badges and reminders will follow your profile everywhere you
                    log in.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                  <p className="font-semibold text-white">Already registered?</p>
                  <p>
                    If you’ve completed sign-up, go straight to the{" "}
                    <Link href="/auth/login" className="font-semibold text-sky-200 hover:text-sky-100">
                      attendee login
                    </Link>{" "}
                    to access your schedule.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex w/full max-w-5xl flex-col gap-3 px-6 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
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
