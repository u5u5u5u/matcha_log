import Link from "next/link";

const FloatButton = () => {
  return (
    <Link
      href="/registration"
      className="fixed right-5 bottom-5 z-[9999] block bg-primary-400 text-white w-12 h-12 text-center leading-[50px] text-2xl rounded-full shadow-md hover:bg-primary-600"
    >
      ＋
    </Link>
  );
};

export default FloatButton;
