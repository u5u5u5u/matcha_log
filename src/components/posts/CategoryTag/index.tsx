import { CakeSlice, CupSoda } from "lucide-react";
import styles from "./index.module.scss";

const CategoryTag = ({ category }: { category: string }) => {
  return (
    <div className={styles.categoryTag}>
      {category === "SWEET" ? <CakeSlice size={12} /> : <CupSoda size={12} />}
      <span>{category === "SWEET" ? "スイーツ" : "ドリンク"}</span>
    </div>
  );
};

export default CategoryTag;
