import Link from "next/link";

const Profile = () => {
  return (
    <div>
      <h1>Profile</h1>
      <Link href="/profile/edit">Edit</Link>
    </div>
  );
};

export default Profile;
