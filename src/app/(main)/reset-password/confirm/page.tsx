import ResetPasswordConfirmPage from "../../../../components/auth/ResetPasswordPage/confirm";
import styles from "../page.module.scss";

export default function Page() {
  return (
    <div className={styles.resetPasswordPage}>
      <ResetPasswordConfirmPage />
    </div>
  );
}
