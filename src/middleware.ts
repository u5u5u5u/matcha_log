export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/me", "/post/new", "/post/:id/edit"],
};
