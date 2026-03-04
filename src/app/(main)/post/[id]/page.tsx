import { supabase, mapToCamel } from "@/lib/supabase";
import { notFound } from "next/navigation";
import React from "react";
import PostDetailClient from "@/components/post/id/PostDetailClient";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: rawPost } = await supabase
    .from("posts")
    .select(
      "*, images(*), shop:shops(*), user:users(id,email,name,icon_url,created_at,updated_at), likes(*)"
    )
    .eq("id", id)
    .single();
  if (!rawPost) return notFound();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post = mapToCamel(rawPost) as any;
  const likeCount = (rawPost.likes as { id: string }[])?.length ?? 0;
  return <PostDetailClient post={post} likeCount={likeCount} />;
}
