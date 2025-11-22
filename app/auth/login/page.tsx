"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg space-y-8 rounded-3xl border border-sky-100 bg-white p-10 shadow-sm sm:p-12">
          <header className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">BT&nbsp;IC</p>
            <h1 className="text-3xl font-semibold text-sky-800">Welcome back</h1>
            <p className="text-sm text-sky-600">Sign in with your event credentials to continue as an attendee.</p>
            <p className="text-sm text-sky-600">
              If you have not already registered using the email you used to apply for the event, please do so first.
            </p>
          </header>

          <form className="space-y-5" action="#" method="post">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-sky-800">
                Email
              </Label>
              <AuthInput
                id="email"
                type="email"
                placeholder="Enter your email address"
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
              className="h-11 w-full rounded-xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400"
              onClick={async (e) => {
                e.preventDefault();
                setLoading(true);
                await signInWithEmailActionClient({ email, password }, router);
                setLoading(false);
              }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </Button>

            <GoogleButton
              router={router}
              loading={loading}
              setLoading={setLoading}
              signInWithGoogleAction={signInWithGoogleActionClient}
            />
          </form>

          <footer className="space-y-2 text-center text-sm text-sky-500">
            <p>
              Not registered with your attendee email?{" "}
              <Link href="/auth/signup" className="font-semibold text-sky-600 hover:text-sky-700">
                Attendee sign-up page
              </Link>
            </p>
            <p>
              Trouble accessing the attendee portal?{" "}
              <Link href="/auth/invite-request" className="font-semibold text-sky-600 hover:text-sky-700">
                Request approval
              </Link>
            </p>
            <p>
              Signing in as a staff member?{" "}
              <Link href="/staff/auth/login" className="font-semibold text-sky-600 hover:text-sky-700">
                Staff login page
              </Link>
            </p>
          </footer>
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
