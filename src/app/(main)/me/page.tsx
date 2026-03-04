export const dynamic = "force-dynamic";

import { getMyProfile } from "@/app/actions/me";
import MePageClient from "@/components/me/MePageClient";
import { getServerUser } from "@/lib/auth";

export default async function MePage() {
  const currentUser = await getServerUser();

  if (!currentUser) {
    return <div>ログインしてください</div>;
  }

  const profile = await getMyProfile();

  if ("error" in profile) {
    return <div>{profile.error}</div>;
  }

  return (
    <MePageClient
      posts={profile.posts}
      likedPosts={profile.likedPosts}
      userName={profile.user.name}
      userEmail={profile.user.email}
      userIconUrl={profile.user.iconUrl}
      activeTitle={profile.user.activeTitle}
      followingList={profile.user.followingList}
      followerList={profile.user.followerList}
    />
  );
}
