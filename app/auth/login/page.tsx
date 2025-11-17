"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithGoogleAction, signInWithEmailAction } from "@/actions/client/auth-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import GoogleButton from "@/components/custom/google-button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-svh items-center justify-center bg-sky-100/40 px-6 py-16">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-sky-100 bg-white p-10 shadow-sm">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">BT&nbsp;IC</p>
          <h1 className="text-3xl font-semibold text-sky-800">Welcome back</h1>
          <p className="text-sm text-sky-600">Sign in with your event credentials to continue as an attendee.</p>
          <p className="text-sm text-sky-600">
            If you have not already registered using the email you used to apply for the event, please do so first.
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
              className="h-11 rounded-xl border border-sky-100 bg-white text-black placeholder:text-black focus:border-sky-300 focus-visible:ring-sky-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <Label htmlFor="password" className="font-medium text-sky-800">
                Password
              </Label>
              <Link href="/auth/forgot-password" className="text-sky-500 hover:text-sky-600">
                Forgot?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="h-11 rounded-xl border border-sky-100 bg-white text-black placeholder:text-sky-700 focus:border-sky-300 focus-visible:ring-sky-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-sky-500 text-sm font-semibold text-white transition hover:bg-sky-400"
            onClick={async (e) => {
              e.preventDefault();
              setLoading(true);
              await signInWithEmailAction({ email, password }, router);
              setLoading(false);
            }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
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
            Not registered with your attendee email?{" "}
            <Link href="/auth/signup" className="font-semibold text-sky-600 hover:text-sky-700">
              Attendee sign-up page
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
