'use client'

import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show nothing while loading
  if (!isLoaded) {
    return null;
  }

  // Only render children if signed in
  if (isSignedIn) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}