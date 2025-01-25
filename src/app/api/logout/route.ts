import { NextResponse } from "next/server";

export async function POST() {
  // Create a response with a logout confirmation message
  const response = NextResponse.json({ message: "Logout successful" });

  // Clear the authToken cookie by setting it with an empty value and maxAge=0
  response.cookies.set("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    path: "/", // Ensure the cookie is cleared for all routes
    maxAge: 0, // Expire the cookie immediately
  });

  return response;
}