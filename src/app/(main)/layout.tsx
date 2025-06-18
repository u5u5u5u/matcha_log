import AppFrame from "@/components/util/AppFrame";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppFrame>{children}</AppFrame>;
}
