"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createInviteActionClient } from "@/actions/client/invite-actions";
import { getTheme } from "@/lib/theme";

import AuthInput from "@/components/custom/auth-input";
import { AttendeeInvite } from "@/types/types";

export default function RequestInvitePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = getTheme("attendee");

  return (
    <div className={`flex min-h-svh items-center justify-center px-6 py-16 ${theme.background.page}`}>
      <div className={theme.layout.singleCard}>
        <header className="space-y-2 text-center">
          <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.singleCard.eyebrow}`}>BT&nbsp;IC</p>
          <h1 className={`text-3xl font-semibold ${theme.singleCard.heading}`}>Request an invite</h1>
          <p className={`text-sm ${theme.singleCard.body}`}>
            Invited to the event but having trouble accessing the portal? Help us confirm your event access.
          </p>
        </header>

        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="full-name" className={`text-sm font-medium ${theme.text.label}`}>
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
            <Label htmlFor="email" className={`text-sm font-medium ${theme.text.label}`}>
              Email
            </Label>
            <AuthInput
              id="email"
              placeholder="Enter your email address"
              theme={theme.id}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliation" className={`text-sm font-medium ${theme.text.label}`}>
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
            <Label htmlFor="notes" className={`text-sm font-medium ${theme.text.label}`}>
              Anything else we should know?
            </Label>
            <textarea
              id="notes"
              rows={4}
              placeholder="Share context about your role, application, or timeline"
              className={theme.form.textarea}
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

        <footer className={`space-y-2 text-center text-sm ${theme.singleCard.body}`}>
          <p>
            Resolved your issue?{" "}
            <Link href="/auth/login" className={`font-semibold ${theme.singleCard.link}`}>
              Attendee login page
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
