import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // ALLOW public pages: /setup, /login, /, and static assets
        if (
          pathname === "/setup" || 
          pathname === "/login" || 
          pathname === "/" || 
          pathname.startsWith("/tawakkalna") ||
          pathname.startsWith("/api") || 
          pathname.includes(".")
        ) {
          return true;
        }

        // PROTECT everything else (like /dashboard)
        return !!token;
      },
    },
    pages: {
       signIn: "/login"
    }
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};
