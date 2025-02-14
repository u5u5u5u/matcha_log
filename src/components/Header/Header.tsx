import Link from "next/link";
import BackButton from "@/components/Header/BackButton";
import { CircleUser } from "lucide-react";

interface HeaderProps {
  title: string;
  showBackButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton }) => {
  return (
    <header className="fixed flex justify-center items-center w-full h-[7vh] bg-primary-400 z-[10000]">
      {showBackButton && <BackButton />}
      <h1>{title}</h1>
      <div className="absolute right-4">
        <Link href="/profile">
          <CircleUser />
        </Link>
      </div>
    </header>
  );
};

export default Header;
