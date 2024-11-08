import Link from "next/link";

import LatestMatcha from "./components/LatestMatcha";

const Home = () => {
  return (
    <>
      <ul>
        <li>
          <Link href="/matcha/registration">Registration</Link>
        </li>
        <li>
          <Link href="/ranking">Ranking</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
      </ul>
      <LatestMatcha />
    </>
);
};

export default Home;
