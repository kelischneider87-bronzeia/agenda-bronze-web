"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const pathname = usePathname();

  const { autenticado } = useAuth();

  useEffect(() => {

    if (
      !autenticado &&
      pathname !== "/login"
    ) {

      router.push("/login");
    }

  }, [autenticado, pathname, router]);

  if (
    !autenticado &&
    pathname !== "/login"
  ) {

    return null;
  }

  return <>{children}</>;
}