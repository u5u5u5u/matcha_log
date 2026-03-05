import { CakeSlice, CupSoda } from "lucide-react";
import styles from "./index.module.scss";

const CategoryTag = ({ category }: { category: string }) => {
  return (
    <div className={styles.categoryTag}>
      {category === "SWEET" ? <CakeSlice size={16} /> : <CupSoda size={16} />}
    </div>
  );
};

export default CategoryTag;
