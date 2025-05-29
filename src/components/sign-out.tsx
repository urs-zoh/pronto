"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Or sessionStorage, if you use that
    router.push("/login"); // Redirect to login or landing page
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
