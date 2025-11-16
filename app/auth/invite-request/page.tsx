"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createInviteActionClient } from "@/actions/client/invite-actions";

export default function RequestInvitePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-svh items-center justify-center bg-sky-100/40 px-6 py-16">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-sky-100 bg-white p-10 shadow-sm">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">BT&nbsp;IC</p>
          <h1 className="text-3xl font-semibold text-sky-800">Request an invite</h1>
          <p className="text-sm text-sky-600">
            Invited to the event but having trouble accessing the portal? Tell us a little about yourself so we can
            confirm your event access.
          </p>
        </header>

        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="full-name" className="text-sm font-medium text-sky-800">
              Full name
            </Label>
            <Input
              id="full-name"
              placeholder="Enter your full name"
              required
              className="h-11 rounded-xl border border-sky-100 bg-white text-black placeholder:text-black focus:border-sky-300 focus-visible:ring-sky-400"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-sky-800">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              required
              className="h-11 rounded-xl border border-sky-100 bg-white text-black placeholder:text-black focus:border-sky-300 focus-visible:ring-sky-400"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliation" className="text-sm font-medium text-sky-800">
              Organization / affiliation
            </Label>
            <Input
              id="affiliation"
              placeholder="Enter your organization or affiliation"
              className="h-11 rounded-xl border border-sky-100 bg-white text-black placeholder:text-black focus:border-sky-300 focus-visible:ring-sky-400"
              value={affiliation}
              onChange={(event) => setAffiliation(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-sky-800">
              Anything else we should know?
            </Label>
            <textarea
              id="notes"
              rows={4}
              placeholder="Share context about your role, application, or timeline"
              className="w-full rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm text-black placeholder:text-black focus:border-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <Button
            onClick={async (e) => {
              e.preventDefault();
              setLoading(true);
              await createInviteActionClient({ fullName, email, affiliation, notes, status: "PENDING" });
              setLoading(false);
            }}
            className="h-11 w-full rounded-xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-300">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request invite"}
          </Button>
        </form>

        <footer className="space-y-2 text-center text-sm text-sky-500">
          <p>
            Resolved your issue?{" "}
            <Link href="/auth/login" className="font-semibold text-sky-600 hover:text-sky-700">
              Attendee login page
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
