"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";

const PageTitleMap = [
  { path: /^\/home$/, title: "Home" },
  { path: /^\/matcha$/, title: "まっちゃ" },
  { path: /^\/matcha\/[^/]+$/, title: "詳細" },
  { path: /^\/matcha\/[^/]+\/edit$/, title: "編集" },
  { path: /^\/matcha\/registration$/, title: "新規登録" },
  { path: /^\/profile$/, title: "プロフィール" },
  { path: /^\/ranking$/, title: "ランキング" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showBackButton = pathname !== "/home";
  const pageTitle =
    PageTitleMap.find((item) => item.path.test(pathname))?.title || "";

  console.log("pathname", pathname);

  return (
    <>
      <Header title={pageTitle} showBackButton={showBackButton} />
      <main className="container">{children}</main>
    </>
  );
}
