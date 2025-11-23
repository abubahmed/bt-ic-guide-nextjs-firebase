"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signInWithEmailActionClient, signInWithGoogleActionClient } from "@/actions/client/auth-actions";

import GoogleButton from "@/components/custom/google-button";
import AuthInput from "@/components/custom/auth-input";

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-svh flex-col bg-slate-950">
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_rgba(2,6,23,0.95))]"
          aria-hidden
        />
        <div className="relative w-full max-w-4xl">
          <div className="absolute inset-0 translate-x-6 -translate-y-6 rounded-[44px] bg-gradient-to-br from-slate-900/70 via-slate-950 to-black blur-3xl" />
          <div className="relative grid gap-8 rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-[0_30px_110px_rgba(2,6,23,0.85)] backdrop-blur-2xl sm:p-10 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="space-y-6">
              <header className="space-y-3">
                <Badge className="rounded-full bg-slate-800/80 text-[0.6rem] uppercase tracking-[0.4em] text-sky-300">
                  Staff
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-white">Mission control access</h1>
                  <p className="text-sm text-slate-300">
                    Use your confirmed staff credentials to jump into operations dashboards, live comms, and real-time
                    assignments.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="staff-email" className="text-sm font-medium text-slate-200">
                    Email
                  </Label>
                  <AuthInput
                    id="staff-email"
                    type="email"
                    placeholder="name@btic.io"
                    autoComplete="email"
                    staff
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <Label htmlFor="staff-password" className="font-medium text-slate-200">
                      Password
                    </Label>
                    <Link href="/auth/forgot-password" className="text-sky-400 hover:text-sky-300">
                      Forgot?
                    </Link>
                  </div>
                  <AuthInput
                    id="staff-password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    staff
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400"
                  disabled={loading}
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

            <aside className="space-y-5 rounded-[24px] border border-slate-800/80 bg-gradient-to-b from-slate-950 to-slate-900/80 p-6 text-sm text-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">Need support?</p>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                  <p className="font-semibold text-sky-300">Waiting on invite?</p>
                  <p className="text-slate-300">
                    Submit a{" "}
                    <Link href="/staff/auth/invite-request" className="font-semibold text-white hover:text-sky-300">
                      staff invite request
                    </Link>{" "}
                    so we can add you to the admin roster.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                  <p className="font-semibold text-sky-300">New staff member?</p>
                  <p className="text-slate-300">
                    Complete the{" "}
                    <Link href="/staff/auth/signup" className="font-semibold text-white hover:text-sky-300">
                      staff sign-up
                    </Link>{" "}
                    to link your Princeton email and assign your role.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                  <p className="font-semibold text-sky-300">Need attendee access?</p>
                  <p className="text-slate-300">
                    Head back to the{" "}
                    <Link href="/auth/login" className="font-semibold text-white hover:text-sky-300">
                      attendee portal
                    </Link>{" "}
                    for guest tools and programming.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
