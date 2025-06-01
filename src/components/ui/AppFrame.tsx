"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/ui/Header";
import BottomBar from "@/components/ui/BottomBar";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTopPage = pathname === "/";

  return (
    <>
      {!isTopPage && <Header />}
      <main>{children}</main>
      {!isTopPage && <BottomBar />}
    </>
  );
}
