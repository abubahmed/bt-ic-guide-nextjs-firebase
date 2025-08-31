"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signUpWithEmailAction, signInWithGoogleAction } from "@/actions/server/auth-actions";

const SignupForm = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create your account or continue with Google</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" type="submit" formAction={signInWithGoogleAction}>
          Sign up with Google
        </Button>

        <div className="relative my-6">
          <Separator />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-2 text-xs text-gray-500">Or continue with</span>
          </span>
        </div>

        <form action={signUpWithEmailAction} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" name="email" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="********" name="password" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" placeholder="********" name="confirmPassword" required />
          </div>

          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500 w-full text-center">
          Already have an account?{" "}
          <a className="underline underline-offset-4" href="/login">
            Sign in
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
