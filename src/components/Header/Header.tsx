import BackButton from "@/components/Header/BackButton";

interface HeaderProps {
  title: string;
  showBackButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton }) => {
  return (
    <header className="fixed flex justify-center items-center w-full h-[7vh] bg-primary-400 z-[10000]">
      {showBackButton && <BackButton />}
      <h1>{title}</h1>
    </header>
  );
};

export default Header;