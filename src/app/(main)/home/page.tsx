import Link from "next/link";

import LatestMatcha from "./components/LatestMatcha";
import TopFive from "./components/TopFive";

const Home = () => {
  return (
    <>
      <ul>
        <li>
          <Link href="/matcha/registration">Registration</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
      </ul>
      <LatestMatcha />
      <TopFive />
    </>
);
};

export default Home;
