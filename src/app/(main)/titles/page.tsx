import { getServerUser } from "@/lib/auth";
import TitleCollectionClient from "@/components/titles/TitleCollectionClient";

export default async function TitleCollectionPage() {
  const currentUser = await getServerUser();

  if (!currentUser) {
    return <div>ログインしてください</div>;
  }

  return <TitleCollectionClient />;
}
