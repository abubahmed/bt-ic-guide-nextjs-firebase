"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createInviteActionClient } from "@/actions/client/invite-actions";
import { getAuthTheme } from "@/lib/auth-theme";

import AuthInput from "@/components/custom/auth-input";
import { AttendeeInvite } from "@/types/types";

export default function RequestInvitePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
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
                  <h1 className={`text-3xl font-semibold ${theme.headingClass}`}>Request an invite</h1>
                  <p className={`text-sm ${theme.bodyTextClass}`}>
                    Need access to the staff portal? Share your details and we’ll review your status with the events team.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className={`text-sm font-medium ${theme.labelClass}`}>
                    Full name
                  </Label>
                  <AuthInput
                    id="full-name"
                    placeholder="Enter your full name"
                    staff={theme.isStaff}
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={`text-sm font-medium ${theme.labelClass}`}>
                    Email
                  </Label>
                  <AuthInput
                    id="email"
                    placeholder="name@businesstoday.org"
                    staff={theme.isStaff}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliation" className={`text-sm font-medium ${theme.labelClass}`}>
                    Organization / affiliation
                  </Label>
                  <AuthInput
                    id="affiliation"
                    placeholder="Enter your organization or affiliation"
                    staff={theme.isStaff}
                    type="text"
                    autoComplete="organization"
                    value={affiliation}
                    onChange={(event) => setAffiliation(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className={`text-sm font-medium ${theme.labelClass}`}>
                    Anything else we should know?
                  </Label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="Share context about your role, application, or timeline"
                    className={theme.textAreaClass}
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

            <aside className={`space-y-5 rounded-[24px] border p-6 text-sm ${theme.asideContainerClass}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.supportEyebrowClass}`}>Need help?</p>
              <div className={`rounded-2xl border px-4 py-3 ${theme.asideCardClass}`}>
                <p className={`font-semibold ${theme.asideCardHeadingClass}`}>Ready to sign in?</p>
                <p>
                  Already approved and just need to log back in? Head over to the{" "}
                  <Link href="/auth/login" className={`font-semibold ${theme.inlineLinkClass}`}>
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
