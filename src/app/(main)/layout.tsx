"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showBackButton = pathname !== "/home";

  return (
    <>
      <Header showBackButton={showBackButton} />
      <main className="container">{children}</main>
    </>
  );
}
