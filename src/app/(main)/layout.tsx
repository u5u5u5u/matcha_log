"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";

const PageTitle: { [key: string]: string } = {
  "/home": "Home",
  "/matcha/registration": "新規登録",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showBackButton = pathname !== "/home";
  const pageTitle = PageTitle[pathname] || "";

  return (
    <>
      <Header title={pageTitle} showBackButton={showBackButton} />
      <main className="container">{children}</main>
    </>
  );
}
