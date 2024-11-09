"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";

const PageTitleMap = [
  { path: /^\/home$/, title: "ほーむ" },
  { path: /^\/matcha$/, title: "まっちゃ" },
  { path: /^\/matcha\/registration$/, title: "とうろく" },
  { path: /^\/matcha\/[^/]+$/, title: "しょうさい" },
  { path: /^\/matcha\/[^/]+\/edit$/, title: "へんしゅう" },
  { path: /^\/profile$/, title: "ぷろふぃーる" },
  { path: /^\/ranking$/, title: "らんきんぐ" },
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
