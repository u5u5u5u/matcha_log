"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "./button";

export default function LogoutButton() {
  return (
    <Button type="button" onClick={() => signOut({ callbackUrl: "/login" })}>
      <LogOut />
    </Button>
  );
}
