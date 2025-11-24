"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createInviteActionClient } from "@/actions/client/invite-actions";
import { getTheme } from "@/lib/theme";

import AuthInput from "@/components/custom/auth-input";
import { AttendeeInvite } from "@/types/types";

export default function RequestInvitePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

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
                  <h1 className={`text-3xl font-semibold ${theme.colors.textPrimary}`}>Request an invite</h1>
                  <p className={`text-sm ${theme.colors.textSecondary}`}>
                    Need access to the attendee portal? Share your details and we’ll review your status with the events team.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className={`text-sm font-medium ${theme.colors.textLabel}`}>
                    Full name
                  </Label>
                  <AuthInput
                    id="full-name"
                    placeholder="Enter your full name"
                    theme={theme.id}
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={`text-sm font-medium ${theme.colors.textLabel}`}>
                    Email
                  </Label>
                  <AuthInput
                    id="email"
                    placeholder="name@businesstoday.org"
                    theme={theme.id}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliation" className={`text-sm font-medium ${theme.colors.textLabel}`}>
                    Organization / affiliation
                  </Label>
                  <AuthInput
                    id="affiliation"
                    placeholder="Enter your organization or affiliation"
                    theme={theme.id}
                    type="text"
                    autoComplete="organization"
                    value={affiliation}
                    onChange={(event) => setAffiliation(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className={`text-sm font-medium ${theme.colors.textLabel}`}>
                    Anything else we should know?
                  </Label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="Share context about your role, application, or timeline"
                    className={theme.fields.textarea}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                  />
                </div>

                <Button
                  onClick={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    const invite: AttendeeInvite = {
                      fullName,
                      email,
                      affiliation,
                      notes,
                    };
                    await createInviteActionClient(invite, "ATTENDEE");
                    setLoading(false);
                  }}
                  className="h-11 w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-300">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request invite"}
                </Button>
              </form>
            </section>

            <aside className={asideContainer}>
              <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.colors.textMuted}`}>Need help?</p>
              <div className={asideCard}>
                <p className={`font-semibold ${theme.colors.textPrimary}`}>Ready to sign in?</p>
                <p>
                  Already approved and just need to log back in? Head over to the{" "}
                  <Link href="/auth/login" className={`font-semibold ${theme.colors.accent}`}>
                    attendee login
                  </Link>{" "}
                  page.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
