"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createInviteActionClient } from "@/actions/client/invite-actions";
import { getAuthTheme } from "@/lib/auth-theme";

import AuthInput from "@/components/custom/auth-input";
import { AttendeeInvite } from "@/types/types";

export default function RequestInvitePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = getAuthTheme("attendee");

  return (
    <div className={`flex min-h-svh items-center justify-center px-6 py-16 ${theme.pageBackgroundClass}`}>
      <div className={theme.singleCardContainerClass}>
        <header className="space-y-2 text-center">
          <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.singleCardEyebrowClass}`}>BT&nbsp;IC</p>
          <h1 className={`text-3xl font-semibold ${theme.singleCardHeadingClass}`}>Request an invite</h1>
          <p className={`text-sm ${theme.singleCardBodyClass}`}>
            Invited to the event but having trouble accessing the portal? Help us confirm your event access.
          </p>
        </header>

        <form className="space-y-5">
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
              placeholder="Enter your email address"
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
              const invite = {
                fullName,
                email,
                affiliation,
                notes,
              };
              await createInviteActionClient(invite, "ATTENDEE");
              setLoading(false);
            }}
            className="h-11 w-full rounded-xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-300">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request invite"}
          </Button>
        </form>

        <footer className={`space-y-2 text-center text-sm ${theme.singleCardBodyClass}`}>
          <p>
            Resolved your issue?{" "}
            <Link href="/auth/login" className={`font-semibold ${theme.singleCardLinkClass}`}>
              Attendee login page
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
