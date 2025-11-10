"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithEmailAction, signInWithGoogleAction } from "@/actions/client/auth-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  return (
    <div className="flex min-h-svh items-center justify-center bg-sky-100/40 px-6 py-16">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-sky-100 bg-white p-10 shadow-sm">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">BT&nbsp;IC</p>
          <h1 className="text-3xl font-semibold text-sky-800">Create your account</h1>
          <p className="text-sm text-sky-600">Register with the email you used to apply for the event.</p>
        </header>

        <form className="space-y-5" action="#" method="post">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-sky-800">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="h-11 rounded-xl border border-sky-100 bg-white text-sky-800 placeholder:text-black focus:border-sky-300 focus-visible:ring-sky-400"
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
              placeholder="Create a password"
              autoComplete="new-password"
              required
              className="h-11 rounded-xl border border-sky-100 bg-white text-sky-800 placeholder:text-black focus:border-sky-300 focus-visible:ring-sky-400"
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
              type="password"
              placeholder="Re-enter password"
              autoComplete="new-password"
              required
              className="h-11 rounded-xl border border-sky-100 bg-white text-sky-800 placeholder:text-black focus:border-sky-300 focus-visible:ring-sky-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400"
            onClick={(e) => {
              e.preventDefault();
              signUpWithEmailAction({ email, password, passwordConfirm: confirmPassword }, router);
            }}>
            Sign up
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl border border-sky-200 text-sm font-semibold text-sky-600 hover:bg-sky-50"
            onClick={(e) => {
              e.preventDefault();
              signInWithGoogleAction(router);
            }}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-5 w-5">
              <path
                d="M21.6 12.227c0-.815-.074-1.6-.212-2.353H12v4.432h5.382a4.6 4.6 0 01-1.99 3.017v2.503h3.217c1.885-1.736 2.99-4.29 2.99-7.599z"
                fill="#4285F4"
              />
              <path
                d="M12 22c2.7 0 4.968-.893 6.624-2.376l-3.217-2.503c-.893.6-2.037.956-3.407.956-2.619 0-4.832-1.768-5.622-4.144H3.04v2.608A9.996 9.996 0 0012 22z"
                fill="#34A853"
              />
              <path
                d="M6.378 13.933A5.996 5.996 0 015.976 12c0-.672.116-1.325.402-1.933V7.459H3.04A9.996 9.996 0 002 12c0 1.588.38 3.085 1.04 4.541l3.338-2.608z"
                fill="#FBBC05"
              />
              <path
                d="M12 6.5c1.468 0 2.784.505 3.825 1.498l2.868-2.868C16.96 3.408 14.7 2.5 12 2.5 8.042 2.5 4.614 4.843 3.04 7.459l3.338 2.608C7.168 8.268 9.381 6.5 12 6.5z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
        </form>

        <footer className="space-y-2 text-center text-sm text-sky-500">
          <p>
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-sky-600 hover:text-sky-700">
              Sign in
            </Link>
          </p>
          <p>
            Staff registration?{" "}
            <Link href="/staff/auth/login" className="font-semibold text-sky-600 hover:text-sky-700">
              Go to staff portal
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
