import { PrismaClient } from "@/generated/prisma";
import { notFound } from "next/navigation";
import React from "react";
import PostDetailClient from "@/components/post/id/PostDetailClient";

const prisma = new PrismaClient();

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: {
      images: true,
      shop: true,
      user: true,
      likes: true,
    },
  });
  const likeCount = post?.likes.length || 0;
  if (!post) return notFound();
  return <PostDetailClient post={post} likeCount={likeCount} />;
}
