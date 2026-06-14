"use client";

import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({
  children,
}: Props) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex bg-black min-h-screen">
      
      <Sidebar />

      <main className="ml-64 flex-1 p-10">
        {children}
      </main>

    </div>
  );
}