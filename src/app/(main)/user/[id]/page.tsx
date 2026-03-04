export const dynamic = "force-dynamic";

import UserProfileClientSWR from "@/components/user/UserProfileClientSWR";
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

  return <UserProfileClientSWR userId={id} />;
}
