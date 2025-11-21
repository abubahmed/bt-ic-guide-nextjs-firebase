"use client";
import { signOutActionClient } from "@/actions/client/auth-actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutActionClient(router);
  };

  return (
    <div className="flex items-center justify-center min-h-screen font-sans p-8 sm:p-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Home page</h1>
        <Button onClick={handleSignOut}>Sign out</Button>
      </div>
    </div>
  );
}
