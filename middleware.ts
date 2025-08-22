import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;
      const isAdminRoute =
        path.startsWith("/admin") || path.startsWith("/api/admin");
      if (!isAdminRoute) return !!token;
      return token?.role === "admin";
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/account/:path*"],
};
