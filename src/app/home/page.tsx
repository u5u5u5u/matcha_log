import Link from "next/link";

const Home = () => {
  return (
    <>
      <h1>Home</h1>
      <ul>
        <li>
          <Link href="/matcha">Matcha</Link>
        </li>
        <li>
          <Link href="/registration">Registration</Link>
        </li>
        <li>
          <Link href="/ranking">Ranking</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
      </ul>
    </>
  );
};

export default Home;
