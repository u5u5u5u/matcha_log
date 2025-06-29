import styles from "./index.module.scss";
import { Badge, BadgeHelp, Leaf } from "lucide-react";

type Title = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  isUnlocked: boolean;
  isActive: boolean;
};

type TitleCardProps = {
  title: Title;
  categoryNames: Record<string, string>;
  onClick: (title: Title) => void;
};

export default function TitleCard({ title, onClick }: TitleCardProps) {
  return (
    <div
      className={`${styles.titleCard} ${
        !title.isUnlocked ? styles.locked : ""
      } ${title.isActive ? styles.active : ""}`}
      onClick={() => onClick(title)}
    >
      <div className={styles.titleIcon}>
        {title.isUnlocked ? (
          <>
            <Badge size={50} className={styles.badge} />
            <Leaf size={25} strokeWidth={3} className={styles.leaf} />
          </>
        ) : (
          <BadgeHelp size={50} className={styles.badgeHelp} />
        )}
      </div>
      <p className={styles.titleName}>
        {title.isUnlocked ? title.name : "？？？"}
      </p>
    </div>
  );
}
