"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithEmailActionClient, signInWithGoogleActionClient } from "@/actions/client/auth-actions";

import GoogleButton from "@/components/custom/google-button";

export default function StaffSignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <div className="w-full max-w-md space-y-8 rounded-[32px] border border-slate-800 bg-slate-900/90 p-10 shadow-[0px_20px_45px_rgba(3,7,18,0.65)]">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">BT&nbsp;IC</p>
          <h1 className="text-3xl font-semibold text-white">Join the staff portal</h1>
          <p className="text-sm text-slate-400">Register as a staff member with your staff email address.</p>
        </header>

        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="staff-signup-email" className="text-sm font-medium text-slate-200">
              Email
            </Label>
            <Input
              id="staff-signup-email"
              type="email"
              placeholder="name@btic.io"
              autoComplete="email"
              required
              className="h-11 rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus-visible:ring-sky-400/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-signup-password" className="text-sm font-medium text-slate-200">
              Password
            </Label>
            <Input
              id="staff-signup-password"
              type="password"
              placeholder="Create your password"
              autoComplete="new-password"
              required
              className="h-11 rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus-visible:ring-sky-400/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-confirm-password" className="text-sm font-medium text-slate-200">
              Confirm password
            </Label>
            <Input
              id="staff-confirm-password"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
              className="h-11 rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus-visible:ring-sky-400/40"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400"
            disabled={loading}
            onClick={async (e) => {
              e.preventDefault();
              setLoading(true);
              await signUpWithEmailActionClient({ email, password, passwordConfirm: confirmPassword }, router);
              setLoading(false);
            }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign up"}
          </Button>

          <GoogleButton
            router={router}
            loading={loading}
            setLoading={setLoading}
            signInWithGoogleAction={signInWithGoogleActionClient}
          />
        </form>

        <footer className="space-y-2 text-center text-sm text-slate-400">
          <p>
            Registered with staff email?{" "}
            <Link href="/staff/auth/login" className="font-semibold text-sky-400 hover:text-sky-300">
              Staff login
            </Link>
          </p>
          <p>
            Trouble accessing staff portal?{" "}
            <Link href="/staff/auth/invite-request" className="font-semibold text-sky-400 hover:text-sky-300">
              Request approval
            </Link>
          </p>
          <p>
            Signing in as attendee?{" "}
            <Link href="/auth/signup" className="font-semibold text-sky-400 hover:text-sky-300">
              Attendee login
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
