import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Import jwtVerify from jose

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Replace with your actual secret key
const protectedPaths = ["/customer-dashboard", "/seller-dashboard"];

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET); // Encode the secret
    const { payload } = await jwtVerify(token, secret); // Verify and decode the token
    return payload; // Return decoded payload if valid
  } catch (err) {
    console.error("Invalid token:", err);
    return null; // Return null if token is invalid
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const authTokenCookie = request.cookies.get("authToken");

    if (!authTokenCookie) {
      console.log("No authToken found. Redirecting to login.");
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("redirect", pathname); // Preserve redirect path
      return NextResponse.redirect(loginUrl);
    }

    const authToken = authTokenCookie.value;

    const decodedToken = await verifyToken(authToken); // Verify token with jose
    if (decodedToken) {
      console.log("Token is valid:", decodedToken);
      return NextResponse.next(); // Allow access
    }

    console.log("Invalid or expired token. Redirecting to login.");
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next(); // Allow non-protected routes
}

export const config = {
  matcher: ["/customer-dashboard/:path*", "/seller-dashboard/:path*"],
};