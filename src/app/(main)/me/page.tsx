import MePageClientSWR from "@/components/me/MePageClientSWR";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function MePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div>ログインしてください</div>;
  }

  return <MePageClientSWR />;
}
