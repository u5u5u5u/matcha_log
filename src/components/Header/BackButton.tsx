"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed left-4 text-white font-bold px-3"
    >
      <ArrowLeft size={24} color="#000" />
    </button>
  );
};

export default BackButton;
