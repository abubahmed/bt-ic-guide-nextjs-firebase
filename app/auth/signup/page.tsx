"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signUpWithEmailActionClient, signInWithGoogleActionClient } from "@/actions/client/auth-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import GoogleButton from "@/components/custom/google-button";
import AuthInput from "@/components/custom/auth-input";

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
          <p className="text-sm text-sky-600">Register as an attendee with your application email.</p>
        </header>

        <form className="space-y-5" action="#" method="post">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-sky-800">
              Email
            </Label>
            <AuthInput
              id="email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              staff={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-sky-800">
              Password
            </Label>
            <AuthInput
              id="password"
              type="password"
              placeholder="Create your password"
              autoComplete="new-password"
              staff={false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium text-sky-800">
              Confirm password
            </Label>
            <AuthInput
              id="confirm-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              staff={false}
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400"
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

        <footer className="space-y-2 text-center text-sm text-sky-500">
          <p>
            Registered with attendee email?{" "}
            <Link href="/auth/login" className="font-semibold text-sky-600 hover:text-sky-700">
              Attendee login
            </Link>
          </p>
          <p>
            Trouble accessing attendee portal?{" "}
            <Link href="/auth/invite-request" className="font-semibold text-sky-600 hover:text-sky-700">
              Request approval
            </Link>
          </p>
          <p>
            Signing in as staff member?{" "}
            <Link href="/staff/auth/login" className="font-semibold text-sky-600 hover:text-sky-700">
              Staff login
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
