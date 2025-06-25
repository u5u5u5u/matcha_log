import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import ProfileEditForm from "@/components/me/ProfileEditForm";
import styles from "./page.module.css";

export default async function ProfileEditPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>ログインしてください</div>;
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { name: true, email: true, iconUrl: true },
  });
  if (!user) {
    return <div>ユーザーが見つかりません</div>;
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>プロフィール編集</h2>
      <ProfileEditForm
        initialName={user.name || ""}
        initialEmail={session.user.email}
        initialIconUrl={user.iconUrl || ""}
      />
    </div>
  );
}
