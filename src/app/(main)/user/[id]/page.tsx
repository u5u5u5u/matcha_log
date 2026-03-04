export const dynamic = "force-dynamic";

import { getUserProfile } from "@/app/actions/users";
import UserProfileClient from "@/components/user/UserProfileClient";
import { getServerUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getServerUser();
  const meId = currentUser?.id;

  // 自分のプロフィールを見ようとした場合は /me にリダイレクト
  if (meId && meId === id) {
    redirect("/me");
  }

  const profile = await getUserProfile(id);

  if ("error" in profile) {
    return <div>{profile.error}</div>;
  }

  return (
    <UserProfileClient
      user={profile.user}
      posts={profile.posts}
      followingList={profile.followingList}
      followerList={profile.followerList}
      initialIsFollowing={profile.initialIsFollowing}
      showFollowButton={profile.showFollowButton}
    />
  );
}
