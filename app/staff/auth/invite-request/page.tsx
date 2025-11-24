"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import AuthInput from "@/components/custom/auth-input";
import { createInviteActionClient } from "@/actions/client/invite-actions";
import { StaffInvite } from "@/types/types";

export default function StaffAccessHelpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-svh flex-col bg-slate-950">
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="relative w-full max-w-3xl">
          <div className="absolute inset-0 -translate-x-6 translate-y-6 rounded-[40px] bg-gradient-to-br from-slate-900 via-slate-800/80 to-slate-900 blur-3xl" />
          <div className="relative grid gap-8 rounded-[32px] border border-slate-800/80 bg-slate-900/95 p-6 text-slate-100 shadow-[0_25px_90px_rgba(2,6,23,0.8)] backdrop-blur-xl sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-6">
              <header className="space-y-3">
                <Badge className="rounded-full bg-slate-800 text-[0.6rem] uppercase tracking-[0.4em] text-sky-300">
                  Staff
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-white">Request staff assistance</h1>
                  <p className="text-sm text-slate-300">
                    Having trouble with credentials, invites, or permissions? Share details so we can confirm your
                    access fast.
                  </p>
                </div>
              </header>

              <form className="space-y-5" action="#" method="post">
                <div className="space-y-2">
                  <Label htmlFor="staff-full-name" className="text-sm font-medium text-slate-100">
                    Full name
                  </Label>
                  <AuthInput
                    id="staff-full-name"
                    placeholder="Enter your full name"
                    staff
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staff-email" className="text-sm font-medium text-slate-100">
                    Princeton email
                  </Label>
                  <AuthInput
                    id="staff-email"
                    type="email"
                    placeholder="netid@princeton.edu"
                    autoComplete="email"
                    staff
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staff-team" className="text-sm font-medium text-slate-100">
                    Team / role
                  </Label>
                  <AuthInput
                    id="staff-team"
                    placeholder="e.g. Operations, Technology, Marketing"
                    staff
                    type="text"
                    autoComplete="organization"
                    value={team}
                    onChange={(event) => setTeam(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staff-issue" className="text-sm font-medium text-slate-100">
                    What’s going on?
                  </Label>
                  <textarea
                    id="staff-issue"
                    rows={4}
                    placeholder="Share any errors, what you tried, or context we should know."
                    className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
                    value={issue}
                    onChange={(event) => setIssue(event.target.value)}
                  />
                </div>

                <Button
                  className="h-11 w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-300"
                  disabled={loading}
                  onClick={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    const invite: StaffInvite = {
                      fullName,
                      princetonEmail: email,
                      team,
                      notes: issue,
                    };
                    await createInviteActionClient(invite, "STAFF");
                    setLoading(false);
                  }}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send request"}
                </Button>
              </form>
            </section>

            <aside className="space-y-5 rounded-[24px] border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/70 p-6 text-sm text-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Need help?</p>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                  <p className="font-semibold text-white">Ready to sign in?</p>
                  <p>
                    If your access is already confirmed, head back to{" "}
                    <Link href="/staff/auth/login" className="font-semibold text-sky-300 hover:text-white">
                      staff login
                    </Link>{" "}
                    to continue.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                  <p className="font-semibold text-white">Attendee request</p>
                  <p>
                    Supporting a participant instead? Use the{" "}
                    <Link href="/auth/invite-request" className="font-semibold text-sky-300 hover:text-white">
                      attendee invite request
                    </Link>{" "}
                    form.
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
