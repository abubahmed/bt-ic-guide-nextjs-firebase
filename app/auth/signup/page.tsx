"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithEmailAction, signInWithGoogleAction } from "@/actions/client/auth-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import GoogleButton from "@/components/custom/google-button";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-svh items-center justify-center bg-sky-100/40 px-6 py-16">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-sky-100 bg-white p-10 shadow-sm">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">BT&nbsp;IC</p>
          <h1 className="text-3xl font-semibold text-sky-800">Create your account</h1>
          <p className="text-sm text-sky-600">
            Register with the email you used to apply for the event to continue as an attendee.
          </p>
        </header>

        <form className="space-y-5" action="#" method="post">
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
              className="h-11 rounded-xl border border-sky-100 bg-white text-black placeholder:text-sky-700 focus:border-sky-300 focus-visible:ring-sky-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-sky-800">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create your password"
              autoComplete="new-password"
              required
              className="h-11 rounded-xl border border-sky-100 bg-white text-black placeholder:text-sky-700 focus:border-sky-300 focus-visible:ring-sky-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium text-sky-800">
              Confirm password
            </Label>
            <Input
              id="confirm-password"
              placeholder="Re-enter your password"
              type="password"
              autoComplete="new-password"
              required
              className="h-11 rounded-xl border border-sky-100 bg-white text-black placeholder:text-sky-700 focus:border-sky-300 focus-visible:ring-sky-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400"
            onClick={async (e) => {
              e.preventDefault();
              setLoading(true);
              await signUpWithEmailAction({ email, password, passwordConfirm: confirmPassword }, router);
              setLoading(false);
            }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign up"}
          </Button>

          <GoogleButton
            router={router}
            loading={loading}
            setLoading={setLoading}
            signInWithGoogleAction={signInWithGoogleAction}
          />
        </form>

        <footer className="space-y-2 text-center text-sm text-sky-500">
          <p>
            Already registered with your attendee email?{" "}
            <Link href="/auth/login" className="font-semibold text-sky-600 hover:text-sky-700">
              Attendee login page
            </Link>
          </p>
          <p>
            Trouble accessing the attendee portal?{" "}
            <Link href="/auth/invite-request" className="font-semibold text-sky-600 hover:text-sky-700">
              Request approval
            </Link>
          </p>
          <p>
            Signing in as a staff member?{" "}
            <Link href="/staff/auth/login" className="font-semibold text-sky-600 hover:text-sky-700">
              Staff login page
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
