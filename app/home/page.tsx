import React from "react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/server/auth-actions";

const page = () => {
  return (
    <div>
      <form action={signOutAction}>
        <Button type="submit">Sign Out</Button>
      </form>
    </div>
  );
};

export default page;
