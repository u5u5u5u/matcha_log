"use client";

import DropdownMenu from "@/components/posts/DropDownMenu";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import styles from "./index.module.scss";

interface MeetBallsMenuProps {
  postId: string;
  position?: "left" | "right";
}

const MeetBallsMenu = ({ postId, position = "right" }: MeetBallsMenuProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.menuContainer}>
      <button
        className={styles.meetBallsMenu}
        onClick={handleToggleDropdown}
        aria-label="メニューを開く"
      >
        <Ellipsis size={24} />
      </button>
      <DropdownMenu
        isOpen={isDropdownOpen}
        onClose={handleCloseDropdown}
        position={position}
        postId={postId}
      />
    </div>
  );
};

export default MeetBallsMenu;
