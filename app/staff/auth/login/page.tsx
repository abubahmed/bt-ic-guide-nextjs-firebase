"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signInWithEmailActionClient, signInWithGoogleActionClient } from "@/actions/client/auth-actions";
import { getTheme } from "@/lib/theme";

import GoogleButton from "@/components/custom/google-button";
import AuthInput from "@/components/custom/auth-input";

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = getTheme("staff");
  const cardBase = "relative grid gap-8 rounded-[32px] p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]";
  const cardSkin = `border ${theme.colors.borderStrong} ${theme.colors.surface} ${theme.colors.textBase} ${theme.effects.shadowSurface} ${theme.effects.blur}`;
  const badgeClass = `rounded-full ${theme.colors.badgeBg} text-[0.6rem] uppercase tracking-[0.4em] ${theme.colors.badgeText}`;
  const asideContainer = `space-y-5 rounded-[24px] border ${theme.colors.borderMuted} ${theme.colors.surfaceAlt} p-6 text-sm ${theme.colors.textBase}`;
  const asideCard = `rounded-2xl border ${theme.colors.borderMuted} ${theme.colors.surfaceMuted} px-4 py-3`;

  return (
    <div className={`flex min-h-svh flex-col ${theme.colors.page}`}>
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="relative w-full max-w-3xl">
          <div
            className={`absolute inset-0 -translate-x-6 translate-y-6 rounded-[40px] blur-3xl ${theme.colors.overlay}`}
          />
          <div className={`${cardBase} ${cardSkin}`}>
            <section className="space-y-6">
              <header className="space-y-3">
                <Badge className={badgeClass}>{theme.label}</Badge>
                <div className="space-y-2">
                  <h1 className={`text-3xl font-semibold ${theme.colors.textPrimary}`}>Welcome back, crew</h1>
                  <p className={`text-sm ${theme.colors.textSecondary}`}>
                    Use your staff email and admin invite credentials to access programming tools, live updates, and
                    on-site checklists.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="staff-email" className={`text-sm font-medium ${theme.colors.textLabel}`}>
                    Email
                  </Label>
                  <AuthInput
                    id="staff-email"
                    type="email"
                    placeholder="name@btic.io"
                    autoComplete="email"
                    theme={theme.id}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <Label htmlFor="staff-password" className={`font-medium ${theme.colors.textLabel}`}>
                      Password
                    </Label>
                    <Link href="/auth/forgot-password" className={theme.colors.accent}>
                      Forgot?
                    </Link>
                  </div>
                  <AuthInput
                    id="staff-password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    theme={theme.id}
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

            <aside className={asideContainer}>
              <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.colors.textMuted}`}>
                Need help?
              </p>
              <div className="space-y-3">
                <div className={asideCard}>
                  <p className={`font-semibold ${theme.colors.textPrimary}`}>Attendee portal?</p>
                  <p>
                    Just helping with check-in? Hop over to the{" "}
                    <Link href="/auth/login" className={`font-semibold ${theme.colors.accent}`}>
                      attendee login
                    </Link>{" "}
                    instead.
                  </p>
                </div>
                <div className={asideCard}>
                  <p className={`font-semibold ${theme.colors.textPrimary}`}>Missing invite?</p>
                  <p>
                    Request or resend your admin access through a{" "}
                    <Link href="/staff/auth/invite-request" className={`font-semibold ${theme.colors.accent}`}>
                      staff invite
                    </Link>
                    .
                  </p>
                </div>
                <div className={asideCard}>
                  <p className={`font-semibold ${theme.colors.textPrimary}`}>Staff onboarding</p>
                  <p>
                    Activate your role and confirm access via the{" "}
                    <Link href="/staff/auth/signup" className={`font-semibold ${theme.colors.accent}`}>
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
