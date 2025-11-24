"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signInWithEmailActionClient, signInWithGoogleActionClient } from "@/actions/client/auth-actions";
import { getAuthTheme } from "@/lib/auth-theme";

import GoogleButton from "@/components/custom/google-button";
import AuthInput from "@/components/custom/auth-input";

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = getAuthTheme("staff");

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
                  <h1 className={`text-3xl font-semibold ${theme.headingClass}`}>Welcome back, crew</h1>
                  <p className={`text-sm ${theme.bodyTextClass}`}>
                    Use your staff email and admin invite credentials to access programming tools, live updates, and
                    on-site checklists.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="staff-email" className={`text-sm font-medium ${theme.labelClass}`}>
                    Email
                  </Label>
                  <AuthInput
                    id="staff-email"
                    type="email"
                    placeholder="name@btic.io"
                    autoComplete="email"
                    staff={theme.isStaff}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <Label htmlFor="staff-password" className={`font-medium ${theme.labelClass}`}>
                      Password
                    </Label>
                    <Link href="/auth/forgot-password" className={theme.inlineLinkClass}>
                      Forgot?
                    </Link>
                  </div>
                  <AuthInput
                    id="staff-password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    staff={theme.isStaff}
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
                  <p className={`font-semibold ${theme.asideCardHeadingClass}`}>Attendee portal?</p>
                  <p>
                    Just helping with check-in? Hop over to the{" "}
                    <Link href="/auth/login" className={`font-semibold ${theme.inlineLinkClass}`}>
                      attendee login
                    </Link>{" "}
                    instead.
                  </p>
                </div>
                <div className={`rounded-2xl border px-4 py-3 ${theme.asideCardClass}`}>
                  <p className={`font-semibold ${theme.asideCardHeadingClass}`}>Missing invite?</p>
                  <p>
                    Request or resend your admin access through a{" "}
                    <Link href="/staff/auth/invite-request" className={`font-semibold ${theme.inlineLinkClass}`}>
                      staff invite
                    </Link>
                    .
                  </p>
                </div>
                <div className={`rounded-2xl border px-4 py-3 ${theme.asideCardClass}`}>
                  <p className={`font-semibold ${theme.asideCardHeadingClass}`}>Staff onboarding</p>
                  <p>
                    Activate your role and confirm access via the{" "}
                    <Link href="/staff/auth/signup" className={`font-semibold ${theme.inlineLinkClass}`}>
                      staff onboarding flow
                    </Link>
                    .
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
