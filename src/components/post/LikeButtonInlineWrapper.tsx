"use client";
import dynamic from "next/dynamic";
const LikeButtonInline = dynamic(() => import("./LikeButtonInline"), {
  ssr: false,
});

import React from "react";

export default function LikeButtonInlineWrapper(
  props: React.ComponentProps<typeof LikeButtonInline>
) {
  return <LikeButtonInline {...props} />;
}
