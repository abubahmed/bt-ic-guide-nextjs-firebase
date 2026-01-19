"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signUpWithEmailActionClient, signInWithGoogleActionClient } from "@/actions/auth/client";

import GoogleButton from "@/components/custom/google-button";
import AuthInput from "@/components/custom/auth-input";

export default function StaffSignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-svh flex-col bg-slate-900">
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="relative w-full max-w-3xl">
          <div className="absolute inset-0 -translate-x-6 translate-y-6 rounded-[40px] bg-slate-800/80 blur-3xl" />
          <div className="relative grid gap-8 rounded-[32px] border border-slate-700/80 bg-slate-800/95 p-6 text-slate-100 shadow-[0_25px_90px_rgba(2,6,23,0.8)] backdrop-blur-xl sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-6">
              <header className="space-y-3">
                <Badge className="rounded-full bg-slate-700 text-[0.6rem] uppercase tracking-[0.4em] text-sky-300">
                  Staff
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-white">Join the staff portal</h1>
                  <p className="text-sm text-slate-300">
                    Register with your staff email to unlock admin scheduling tools, comms dashboards, and live
                    programming updates.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="staff-signup-email" className="text-sm font-medium text-slate-100">
                    Email
                  </Label>
                  <AuthInput
                    id="staff-signup-email"
                    type="email"
                    placeholder="name@btic.io"
                    autoComplete="email"
                    staff
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staff-signup-password" className="text-sm font-medium text-slate-100">
                    Password
                  </Label>
                  <AuthInput
                    id="staff-signup-password"
                    type="password"
                    placeholder="Create your password"
                    autoComplete="new-password"
                    staff
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staff-confirm-password" className="text-sm font-medium text-slate-100">
                    Confirm password
                  </Label>
                  <AuthInput
                    id="staff-confirm-password"
                    type="password"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    staff
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400"
                  disabled={loading}
                  onClick={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    await signUpWithEmailActionClient({ email, password, passwordConfirm: confirmPassword }, router);
                    setLoading(false);
                  }}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
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
                <div className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3">
                  <p className="font-semibold text-white">Attendee portal</p>
                  <p>
                    Registering as a participant instead? Switch over to the{" "}
                    <Link href="/auth/login" className="font-semibold text-sky-300 hover:text-white">
                      attendee login
                    </Link>{" "}
                    experience.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3">
                  <p className="font-semibold text-white">Already approved</p>
                  <p>
                    When your account is confirmed, continue straight to{" "}
                    <Link href="/staff/auth/login" className="font-semibold text-sky-300 hover:text-white">
                      staff login
                    </Link>{" "}
                    and pick up where you left off.
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
