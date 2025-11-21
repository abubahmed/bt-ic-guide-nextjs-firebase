"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import AuthInput from "@/components/custom/auth-input";
import { createInviteActionClient } from "@/actions/client/invite-actions";
import { StaffInvite } from "@/types/types";

export default function StaffAccessHelpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <div className="w-full max-w-md space-y-8 rounded-[32px] border border-slate-800 bg-slate-900/90 p-10 shadow-[0px_20px_45px_rgba(3,7,18,0.65)]">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">BT&nbsp;IC Staff</p>
          <h1 className="text-3xl font-semibold text-white">Request staff assistance</h1>
          <p className="text-sm text-slate-400">
            Already part of the team but having trouble accessing the portal? Tell us what’s happening and we’ll get you
            unstuck.
          </p>
        </header>

        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="staff-full-nnpame" className="text-sm font-medium text-slate-200">
              Full name
            </Label>
            <AuthInput
              id="staff-full-name"
              placeholder="Enter your full name"
              staff={true}
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-email" className="text-sm font-medium text-slate-200">
              Princeton email
            </Label>
            <AuthInput
              id="staff-email"
              type="email"
              placeholder="Enter your Princeton email address"
              autoComplete="email"
              staff={true}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-team" className="text-sm font-medium text-slate-200">
              Team / role
            </Label>
            <AuthInput
              id="staff-team"
              placeholder="e.g. Operations, Technology, Marketing"
              staff={true}
              type="text"
              autoComplete="organization"
              value={team}
              onChange={(event) => setTeam(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-issue" className="text-sm font-medium text-slate-200">
              What’s going on?
            </Label>
            <textarea
              id="staff-issue"
              rows={4}
              placeholder="Share any error messages, steps to reproduce, or context we would find helpful."
              className="resize-none w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
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
              const invite = {
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

        <footer className="space-y-2 text-center text-sm text-slate-400">
          <p>
            Resolved your issue?{" "}
            <Link href="/staff/auth/login" className="font-semibold text-sky-400 hover:text-sky-300">
              Staff login page
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
