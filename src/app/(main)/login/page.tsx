import LoginForm from "@/components/auth/LoginForm";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <div className={styles.loginPage}>
      <LoginForm />
    </div>
  );
}
