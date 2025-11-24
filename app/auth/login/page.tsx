"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signInWithGoogleActionClient, signInWithEmailActionClient } from "@/actions/client/auth-actions";
import { getTheme } from "@/lib/theme";
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
  const theme = getTheme("attendee");
  const cardBase = "relative grid gap-8 rounded-[32px] p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]";
  const cardSkin = `border ${theme.colors.borderStrong} ${theme.colors.surface} ${theme.colors.textBase} ${theme.effects.shadowSurface} ${theme.effects.blur}`;
  const badgeClass = `rounded-full ${theme.colors.badgeBg} text-[0.6rem] uppercase tracking-[0.4em] ${theme.colors.badgeText}`;
  const asideContainer = `space-y-5 rounded-[24px] border ${theme.colors.borderMuted} ${theme.colors.surfaceAlt} p-6 text-sm ${theme.colors.textBase}`;
  const asideCard = `rounded-2xl border ${theme.colors.borderContrast} ${theme.colors.surfaceMuted} px-4 py-3`;

  return (
    <div className={`flex min-h-svh flex-col ${theme.colors.page}`}>
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="relative w-full max-w-3xl">
          <div className={`absolute inset-0 -translate-x-6 translate-y-6 rounded-[40px] blur-3xl ${theme.colors.overlay}`} />
          <div className={`${cardBase} ${cardSkin}`}>
            <section className="space-y-6">
              <header className="space-y-3">
                <Badge className={badgeClass}>{theme.label}</Badge>
                <div className="space-y-2">
                  <h1 className={`text-3xl font-semibold ${theme.colors.textPrimary}`}>Welcome back</h1>
                  <p className={`text-sm ${theme.colors.textSecondary}`}>
                    Use your confirmed attendee email to stay synced with live schedules, reminders, and announcements.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="email" className={`text-sm font-medium ${theme.colors.textLabel}`}>
                    Email
                  </Label>
                  <AuthInput
                    id="email"
                    type="email"
                    placeholder="name@businesstoday.org"
                    autoComplete="email"
                    theme={theme.id}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <Label htmlFor="password" className={`font-medium ${theme.colors.textLabel}`}>
                      Password
                    </Label>
                    <Link href="/auth/forgot-password" className={theme.colors.accent}>
                      Forgot?
                    </Link>
                  </div>
                  <AuthInput
                    id="password"
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

            <aside className={asideContainer}>
              <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.colors.textMuted}`}>Need help?</p>
              <div className="space-y-3">
                <div className={asideCard}>
                  <p className={`font-semibold ${theme.colors.textPrimary}`}>No invite yet?</p>
                  <p>
                    Make sure your email is in our approved spreadsheet. Otherwise, submit a quick{" "}
                    <Link href="/auth/invite-request" className={`font-semibold ${theme.colors.accent}`}>
                      request for approval
                    </Link>
                    .
                  </p>
                </div>
                <div className={asideCard}>
                  <p className={`font-semibold ${theme.colors.textPrimary}`}>First-timer?</p>
                  <p>
                    Create your attendee profile through the{" "}
                    <Link href="/auth/signup" className={`font-semibold ${theme.colors.accent}`}>
                      sign-up flow
                    </Link>
                    . Use the same email you submitted in your application.
                  </p>
                </div>
                <div className={asideCard}>
                  <p className={`font-semibold ${theme.colors.textPrimary}`}>Switching to staff?</p>
                  <p>
                    Head to the{" "}
                    <Link href="/staff/auth/login" className={`font-semibold ${theme.colors.accent}`}>
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
