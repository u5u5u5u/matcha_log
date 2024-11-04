import Link from "next/link";

const Matcha = () => {
  return (
    <div>
      <h1>Matcha</h1>
      <ul>
        <li>
          <Link href="/matcha/1">Detail</Link>
        </li>
        <li>
          <Link href="/matcha/1/edit">Edit</Link>
        </li>
      </ul>
    </div>
  );
};

export default Matcha;
