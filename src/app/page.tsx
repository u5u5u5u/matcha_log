import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-6xl font-bold mb-14">まちゃろぐ</h1>
        <Link
          href="/login"
          className="rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          ログイン
        </Link>
      </div>
    </>
  );
}
