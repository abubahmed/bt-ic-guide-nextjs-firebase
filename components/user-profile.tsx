"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/actions/client/auth-actions";

interface UserProfileProps {
  user: any;
}

export default function UserProfile({ user }: UserProfileProps) {
  const router = useRouter();

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.displayName || user.email}!</h1>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
        <pre className="text-xs break-all text-left">{JSON.stringify(user, null, 2)}</pre>
      </div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          signOutAction(router);
        }}>
        Sign out
      </Button>
    </div>
  );
}
