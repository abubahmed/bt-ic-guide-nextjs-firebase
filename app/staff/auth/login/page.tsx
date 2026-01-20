"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signInWithEmailActionClient, signInWithGoogleActionClient } from "@/actions/auth/client";

import GoogleButton from "@/components/custom/google-button";
import AuthInput from "@/components/custom/auth-input";

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-svh flex-col bg-slate-900">
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="relative w-full max-w-3xl">
          <div className="absolute inset-0 -translate-x-6 translate-y-6 rounded-[40px] bg-slate-800/80 blur-3xl" />
          <div className="relative grid gap-8 rounded-[32px] border border-slate-700/80 bg-slate-800/95 p-6 text-slate-100 shadow-[0px_30px_80px_rgba(2,6,23,0.3)] backdrop-blur-xl sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-6">
              <header className="space-y-3">
                <Badge className="rounded-full bg-slate-700 text-[0.6rem] uppercase tracking-[0.4em] text-sky-300">
                  Staff
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-white">Welcome back, crew</h1>
                  <p className="text-sm text-slate-300">
                    Login with your staff email to access the staff portal.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="staff-email" className="text-sm font-medium text-slate-100">
                    Email
                  </Label>
                  <AuthInput
                    id="staff-email"
                    type="email"
                    placeholder="name@btic.io"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    staff={true}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <Label htmlFor="staff-password" className="font-medium text-slate-100">
                      Password
                    </Label>
                    <Link href="/auth/forgot-password" className="text-sky-300 hover:text-white">
                      Forgot?
                    </Link>
                  </div>
                  <AuthInput
                    id="staff-password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    staff={true}
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

              <div className="space-y-3">
                <GoogleButton
                  router={router}
                  loading={loading}
                  setLoading={setLoading}
                  signInWithGoogleAction={signInWithGoogleActionClient}
                />
              </div>
            </section>

            <aside className="space-y-5 rounded-[24px] border border-slate-700 bg-slate-800/70 p-6 text-sm text-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Need help?</p>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 space-y-1">
                  <p className="font-semibold text-white">Attendee portal?</p>
                  <p className="text-slate-300">
                    Looking for the attendee portal? Hop over to the{" "}
                    <Link href="/auth/login" className="font-semibold text-sky-300 hover:text-white">
                      attendee login
                    </Link>{" "}
                    instead.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 space-y-1"> <p className="font-semibold text-white">Staff login?</p>
                  <p className="text-slate-300">
                    Looking for staff registration? Hop over to{" "}
                    <Link href="/staff/auth/signup" className="font-semibold text-sky-300 hover:text-white">
                      staff registration
                    </Link>{" "}
                    instead.
                  </p></div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
