'use client';

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { signOut } = useAuthActions();

  return <div> Logged In!

    <Button onClick={() => signOut()}>Sign Out</Button>
  </div>;
}
