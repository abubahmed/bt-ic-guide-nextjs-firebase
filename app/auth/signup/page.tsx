"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signUpWithEmailActionClient, signInWithGoogleActionClient } from "@/actions/client/auth-actions";
import { getAuthTheme } from "@/lib/auth-theme";
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
  const theme = getAuthTheme("attendee");

  return (
    <div className={`flex min-h-svh flex-col ${theme.pageBackgroundClass}`}>
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="relative w-full max-w-3xl">
          <div className={`absolute inset-0 -translate-x-6 translate-y-6 rounded-[40px] blur-3xl ${theme.glowOverlayClass}`} />
          <div className={theme.twoColumnCardClass}>
            <section className="space-y-6">
              <header className="space-y-3">
                <Badge className={theme.badgeClass}>{theme.badgeLabel}</Badge>
                <div className="space-y-2">
                  <h1 className={`text-3xl font-semibold ${theme.headingClass}`}>Create your profile</h1>
                  <p className={`text-sm ${theme.bodyTextClass}`}>
                    Use the same email you submitted with your application so we can sync your schedule, reminders, and
                    approvals.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="email" className={`text-sm font-medium ${theme.labelClass}`}>
                    Email
                  </Label>
                  <AuthInput
                    id="email"
                    type="email"
                    placeholder="name@businesstoday.org"
                    autoComplete="email"
                    staff={theme.isStaff}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className={`text-sm font-medium ${theme.labelClass}`}>
                    Password
                  </Label>
                  <AuthInput
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                    staff={theme.isStaff}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className={`text-sm font-medium ${theme.labelClass}`}>
                    Confirm password
                  </Label>
                  <AuthInput
                    id="confirm-password"
                    type="password"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    staff={theme.isStaff}
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

            <aside className={`space-y-5 rounded-[24px] border p-6 text-sm ${theme.asideContainerClass}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.supportEyebrowClass}`}>Need help?</p>
              <div className="space-y-3">
                <div className={`rounded-2xl border px-4 py-3 ${theme.asideCardClass}`}>
                  <p className={`font-semibold ${theme.asideCardHeadingClass}`}>Already registered?</p>
                  <p>
                    Jump back to the attendee portal and keep planning your schedule by heading to{" "}
                    <Link href="/auth/login" className={`font-semibold ${theme.inlineLinkClass}`}>
                      attendee login
                    </Link>
                    .
                  </p>
                </div>
                <div className={`rounded-2xl border px-4 py-3 ${theme.asideCardClass}`}>
                  <p className={`font-semibold ${theme.asideCardHeadingClass}`}>Staff member?</p>
                  <p>
                    Use your admin invite to access the{" "}
                    <Link href="/staff/auth/login" className={`font-semibold ${theme.inlineLinkClass}`}>
                      staff portal
                    </Link>{" "}
                    and manage programming.
                  </p>
                </div>
                <div className={`rounded-2xl border px-4 py-3 ${theme.asideCardClass}`}>
                  <p className={`font-semibold ${theme.asideCardHeadingClass}`}>Need access?</p>
                  <p>
                    Waiting on approval or missing an invite? Submit a quick{" "}
                    <Link href="/auth/invite-request" className={`font-semibold ${theme.inlineLinkClass}`}>
                      invite request
                    </Link>{" "}
                    and our team will review it.
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
