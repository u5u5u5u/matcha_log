import FloatButton from "@/components/ui/floatButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <FloatButton />
    </>
  );
}
