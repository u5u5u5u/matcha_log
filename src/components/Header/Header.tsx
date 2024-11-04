import BackButton from "@/components/Header/BackButton";

interface HeaderProps {
  showBackButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ showBackButton }) => {
  return (
    <header className="fixed flex justify-center items-center w-full h-14 bg-primary-400">
      {showBackButton && <BackButton />}
      <h1>Header</h1>
    </header>
  );
};

export default Header;