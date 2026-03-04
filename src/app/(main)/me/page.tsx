import MePageClientSWR from "@/components/me/MePageClientSWR";
import { getServerUser } from "@/lib/auth";

export default async function MePage() {
  const currentUser = await getServerUser();

  if (!currentUser) {
    return <div>ログインしてください</div>;
  }

  return <MePageClientSWR />;
}
