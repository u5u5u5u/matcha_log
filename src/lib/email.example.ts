// // 実際のメール送信機能の実装例（Resendを使用）
// // npm install resend が必要

// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendPasswordResetEmail(
//   email: string,
//   resetToken: string
// ) {
//   const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/confirm?token=${resetToken}`;

//   try {
//     await resend.emails.send({
//       from: "noreply@yourdomain.com",
//       to: email,
//       subject: "パスワードリセットのご案内",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2>パスワードリセットのご案内</h2>
//           <p>パスワードリセットのリクエストを受け付けました。</p>
//           <p>下記のリンクをクリックして、新しいパスワードを設定してください。</p>
//           <p style="margin: 20px 0;">
//             <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
//               パスワードをリセット
//             </a>
//           </p>
//           <p>このリンクは1時間後に無効になります。</p>
//           <p>このリクエストに心当たりがない場合は、このメールを無視してください。</p>
//         </div>
//       `,
//     });
//     return true;
//   } catch (error) {
//     console.error("Email sending failed:", error);
//     return false;
//   }
// }

// // APIルートで使用する場合:
// // import { sendPasswordResetEmail } from '@/lib/email';
// //
// // const emailSent = await sendPasswordResetEmail(email, resetToken);
// // if (!emailSent) {
// //   return NextResponse.json(
// //     { error: "メール送信に失敗しました" },
// //     { status: 500 }
// //   );
// // }
