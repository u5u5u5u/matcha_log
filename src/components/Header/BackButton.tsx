"use client";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className="fixed left-4 top-4 text-white font-bold px-3">
      ← 戻る
    </button>
  );
};

export default BackButton;
