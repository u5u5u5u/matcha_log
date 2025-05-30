"use client";
import dynamic from "next/dynamic";
const LikeButtonInline = dynamic(() => import("./LikeButtonInline"), {
  ssr: false,
});

export default function LikeButtonInlineWrapper(props: any) {
  return <LikeButtonInline {...props} />;
}
