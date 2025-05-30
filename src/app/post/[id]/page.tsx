import { PrismaClient } from "@/generated/prisma";
import { notFound } from "next/navigation";
import React from "react";
import PostDetailClient from "@/components/post/id/PostDetailClient";
import styles from "../../page.module.scss";

const prisma = new PrismaClient();

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
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
