import UserProfileClientSWR from "@/components/user/UserProfileClientSWR";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const meId = session?.user?.id;

  // 自分のプロフィールを見ようとした場合は /me にリダイレクト
  if (meId && meId === id) {
    redirect("/me");
  }

  return <UserProfileClientSWR userId={id} />;
}
