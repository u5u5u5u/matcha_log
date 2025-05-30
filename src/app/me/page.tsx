import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@/generated/prisma";
import React from "react";
import MePageClient from "./MePageClient";

const prisma = new PrismaClient();

export default async function MePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>ログインしてください</div>;
  }
  const posts = await prisma.post.findMany({
    where: { user: { email: session.user.email } },
    include: { images: true, shop: true },
    orderBy: { createdAt: "desc" },
  });

  async function handleDelete(id: string) {
    if (!confirm("本当に削除しますか？")) return;
    const res = await fetch(`/api/post/${id}/delete`, { method: "POST" });
    if (res.ok) {
      window.location.reload();
    } else {
      alert("削除に失敗しました");
    }
  }

  return (
    <MePageClient posts={posts} userName={session.user.name || ""} onDelete={handleDelete} />
  );
}
