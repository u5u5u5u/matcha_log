import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: async ({ token }) => {
      console.log("Middleware Debug - Token:", token);
      return !!token; // トークンが存在する場合のみ認証済みと判定
    },
  },
});

export const config = {
  matcher: ["/me/:path*", "/post/new", "/post/:id/edit"],
};
