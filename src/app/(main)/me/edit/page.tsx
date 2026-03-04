export const dynamic = "force-dynamic";

import ProfileEditForm from "@/components/me/ProfileEditForm";
import { getServerUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.scss";

export default async function ProfileEditPage() {
  const currentUser = await getServerUser();
  if (!currentUser) {
    return <div>ログインしてください</div>;
  }
  const { data: user } = await supabase
    .from("users")
    .select("name, email, icon_url")
    .eq("id", currentUser.id)
    .single();
  if (!user) {
    return <div>ユーザーが見つかりません</div>;
  }
  return (
    <div className={styles.container}>
      <ProfileEditForm
        initialName={user.name || ""}
        initialEmail={currentUser.email ?? ""}
        initialIconUrl={user.icon_url || ""}
      />
    </div>
  );
}
