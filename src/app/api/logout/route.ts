import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });

  // Clear the authToken cookie
  response.cookies.set("authToken", "", { path: "/", maxAge: 0 });

  return response;
}