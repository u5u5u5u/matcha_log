import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import TitleCollectionClient from "@/components/titles/TitleCollectionClient";

export default async function TitleCollectionPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return <div>ログインしてください</div>;
  }

  return <TitleCollectionClient />;
}
