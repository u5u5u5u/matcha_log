import { Suspense } from "react";
import ResetPasswordConfirmPage from "../../../../components/auth/ResetPasswordPage/confirm";
import styles from "../page.module.scss";

function LoadingFallback() {
  return (
    <div className={styles.resetPasswordPage}>
      <div>読み込み中...</div>
    </div>
  );
}

export default function Page() {
  return (
    <div className={styles.resetPasswordPage}>
      <Suspense fallback={<LoadingFallback />}>
        <ResetPasswordConfirmPage />
      </Suspense>
    </div>
  );
}
