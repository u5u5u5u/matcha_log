import Link from "next/link";

import LatestMatcha from "./components/LatestMatcha";
import TopFive from "./components/TopFive";

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-4 mt-4">
      <LatestMatcha />
      <TopFive />
      <Link href="/profile">プロフィールへ</Link>
    </div>
  );
};

export default Home;
