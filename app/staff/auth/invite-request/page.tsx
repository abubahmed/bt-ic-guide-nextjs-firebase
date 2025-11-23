"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createInviteActionClient } from "@/actions/client/invite-actions";

import AuthInput from "@/components/custom/auth-input";
import { AttendeeInvite } from "@/types/types";

export default function RequestInvitePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-svh flex-col bg-sky-100/40">
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="relative w-full max-w-3xl">
          <div className="absolute inset-0 -translate-x-6 translate-y-6 rounded-[40px] bg-gradient-to-br from-sky-200/70 via-white to-white blur-3xl" />
          <div className="relative grid gap-8 rounded-[32px] border border-sky-100/70 bg-white/95 p-6 text-black shadow-[0_25px_90px_rgba(14,28,56,0.18)] backdrop-blur-lg sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-6">
              <header className="space-y-3">
                <Badge className="rounded-full bg-sky-100 text-[0.6rem] uppercase tracking-[0.4em] text-sky-900">
                  Attendee
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-sky-900">Request an invite</h1>
                  <p className="text-sm text-black">
                    Need access to the attendee portal? Share your details and we’ll review your status with the events
                    team.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className="text-sm font-medium text-black">
                    Full name
                  </Label>
                  <AuthInput
                    id="full-name"
                    placeholder="Enter your full name"
                    staff={false}
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-black">
                    Email
                  </Label>
                  <AuthInput
                    id="email"
                    placeholder="name@businesstoday.org"
                    staff={false}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliation" className="text-sm font-medium text-black">
                    Organization / affiliation
                  </Label>
                  <AuthInput
                    id="affiliation"
                    placeholder="Enter your organization or affiliation"
                    staff={false}
                    type="text"
                    autoComplete="organization"
                    value={affiliation}
                    onChange={(event) => setAffiliation(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium text-black">
                    Anything else we should know?
                  </Label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="Share context about your role, application, or timeline"
                    className="w-full resize-none rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm text-black placeholder:text-sky-700 focus:border-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
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

            <aside className="space-y-5 rounded-[24px] border border-sky-50 bg-gradient-to-b from-white to-sky-50/60 p-6 text-sm text-black">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-900">Need help?</p>
              <div className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-3">
                <p className="font-semibold text-sky-700">Ready to sign in?</p>
                <p>
                  Already approved and just need to log back in? Head over to the{" "}
                  <Link href="/auth/login" className="font-semibold text-black hover:text-sky-700">
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
