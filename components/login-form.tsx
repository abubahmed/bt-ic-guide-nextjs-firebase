"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signInWithGoogleAction } from "@/actions/client/auth-actions";
import { signInWithEmailAction } from "@/actions/server/auth-actions";

const LoginForm = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use your email or continue with Google</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={signInWithGoogleAction}>
          <Button variant="outline" className="w-full" type="submit">
            Sign in with Google
          </Button>
        </form>

        <div className="relative my-6">
          <Separator />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground">Or continue with</span>
          </span>
        </div>

        <form action={signInWithEmailAction} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" name="email" required />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
                Forgot password?
              </a>
            </div>
            <Input id="password" type="password" placeholder="********" name="password" required />
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground w-full text-center">
          Don&apos;t have an account?{" "}
          <a className="underline underline-offset-4" href="/signup">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
