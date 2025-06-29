import SignupPage from "@/components/auth/SignupPage";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <div className={styles.signupPage}>
      <SignupPage />
    </div>
  );
}
