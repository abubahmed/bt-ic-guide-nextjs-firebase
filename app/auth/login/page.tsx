"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signInWithGoogleActionClient, signInWithEmailActionClient } from "@/actions/auth/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import GoogleButton from "@/components/custom/google-button";
import AuthInput from "@/components/custom/auth-input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-svh flex-col bg-sky-100/40">
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="relative w-full max-w-3xl">
          <div className="absolute inset-0 -translate-x-6 translate-y-6 rounded-[40px] bg-gradient-to-br from-sky-200/70 via-white to-white blur-3xl" />
          <div className="relative grid gap-8 rounded-[32px] border border-sky-100/70 bg-white/95 p-6 shadow-[0_25px_90px_rgba(14,28,56,0.18)] backdrop-blur-lg sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-6">
              <header className="space-y-3">
                <Badge className="rounded-full bg-sky-100 text-[0.6rem] uppercase tracking-[0.4em] text-sky-900">
                  Attendee
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-sky-900">Welcome back</h1>
                  <p className="text-sm text-black">
                    Use your confirmed attendee email to stay synced with live schedules, reminders, and announcements.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-black">
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
                    <Label htmlFor="password" className="font-medium text-black">
                      Password
                    </Label>
                    <Link href="/auth/forgot-password" className="text-sky-900 hover:text-black">
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

            <aside className="space-y-5 rounded-[24px] border border-sky-50 bg-gradient-to-b from-white to-sky-50/60 p-6 text-sm text-black">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-900">Need help?</p>
              <div className="space-y-3">
                <div className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-3">
                  <p className="font-semibold text-sky-700">First-timer?</p>
                  <p>
                    Create your attendee profile through the{" "}
                    <Link href="/auth/signup" className="font-semibold text-black hover:text-sky-700">
                      sign-up flow
                    </Link>
                    . Use the same email you submitted in your application.
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-3">
                  <p className="font-semibold text-sky-700">Switching to staff?</p>
                  <p>
                    Head to the{" "}
                    <Link href="/staff/auth/login" className="font-semibold text-black hover:text-sky-700">
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
    </div>
  );
}
