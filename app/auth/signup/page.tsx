"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signUpWithEmailActionClient, signInWithGoogleActionClient } from "@/actions/client/auth-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import GoogleButton from "@/components/custom/google-button";
import AuthInput from "@/components/custom/auth-input";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
                  <h1 className="text-3xl font-semibold text-sky-900">Create your profile</h1>
                  <p className="text-sm text-black">
                    Use the same email you submitted with your application so we can sync your schedule, reminders, and
                    approvals.
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
                  <Label htmlFor="password" className="text-sm font-medium text-black">
                    Password
                  </Label>
                  <AuthInput
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                    staff={false}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-black">
                    Confirm password
                  </Label>
                  <AuthInput
                    id="confirm-password"
                    type="password"
                    placeholder="Re-enter your password"
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

            <aside className="space-y-5 rounded-[24px] border border-sky-50 bg-gradient-to-b from-white to-sky-50/60 p-6 text-sm text-black">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-900">Need help?</p>
              <div className="space-y-3">
                <div className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-3">
                  <p className="font-semibold text-sky-700">Already registered?</p>
                  <p>
                    Jump back to the attendee portal and keep planning your schedule by heading to{" "}
                    <Link href="/auth/login" className="font-semibold text-black hover:text-sky-700">
                      attendee login
                    </Link>
                    .
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-3">
                  <p className="font-semibold text-sky-700">Staff member?</p>
                  <p>
                    Use your admin invite to access the{" "}
                    <Link href="/staff/auth/login" className="font-semibold text-black hover:text-sky-700">
                      staff portal
                    </Link>{" "}
                    and manage programming.
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
