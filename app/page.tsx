"use client";

import { getSessionUser } from "@/actions/server/session-actions";
import { useEffect, useState } from "react";
import UserProfile from "@/components/user-profile";

export default function Home() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getSessionUser();
      setUser(userData);
    }
    fetchUser();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen font-sans p-8 sm:p-20">
      {user ? (
        <UserProfile user={user} />
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not signed in</h1>
        </div>
      )}
    </div>
  );
}
