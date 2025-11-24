"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { signUpWithEmailActionClient, signInWithGoogleActionClient } from "@/actions/client/auth-actions";
import { getTheme } from "@/lib/theme";
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
          <div
            className={`absolute inset-0 -translate-x-6 translate-y-6 rounded-[40px] blur-3xl ${theme.colors.overlay}`}
          />
          <div className={`${cardBase} ${cardSkin}`}>
            <section className="space-y-6">
              <header className="space-y-3">
                <Badge className={badgeClass}>{theme.label}</Badge>
                <div className="space-y-2">
                  <h1 className={`text-3xl font-semibold ${theme.colors.textPrimary}`}>Create your profile</h1>
                  <p className={`text-sm ${theme.colors.textSecondary}`}>
                    Use the same email you submitted with your application so we can sync your schedule, reminders, and
                    approvals.
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
                  <Label htmlFor="password" className={`text-sm font-medium ${theme.colors.textLabel}`}>
                    Password
                  </Label>
                  <AuthInput
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                    theme={theme.id}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className={`text-sm font-medium ${theme.colors.textLabel}`}>
                    Confirm password
                  </Label>
                  <AuthInput
                    id="confirm-password"
                    type="password"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    theme={theme.id}
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

            <aside className={asideContainer}>
              <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.colors.textMuted}`}>
                Need help?
              </p>
              <div className="space-y-3">
                <div className={asideCard}>
                  <p className={`font-semibold ${theme.colors.textPrimary}`}>Already registered?</p>
                  <p>
                    Jump back to the attendee portal and keep planning your schedule by heading to{" "}
                    <Link href="/auth/login" className={`font-semibold ${theme.colors.accent}`}>
                      attendee login
                    </Link>
                    .
                  </p>
                </div>
                <div className={asideCard}>
                  <p className={`font-semibold ${theme.colors.textPrimary}`}>Staff member?</p>
                  <p>
                    Use your admin invite to access the{" "}
                    <Link href="/staff/auth/login" className={`font-semibold ${theme.colors.accent}`}>
                      staff portal
                    </Link>{" "}
                    and manage programming.
                  </p>
                </div>
                <div className={asideCard}>
                  <p className={`font-semibold ${theme.colors.textPrimary}`}>Need access?</p>
                  <p>
                    Waiting on approval or missing an invite? Submit a quick{" "}
                    <Link href="/auth/invite-request" className={`font-semibold ${theme.colors.accent}`}>
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
