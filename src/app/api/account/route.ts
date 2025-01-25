import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Get current user data
export async function GET(req: Request) {
  try {
    const authToken = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const { payload } = await jwtVerify(authToken, new TextEncoder().encode(JWT_SECRET));
    const userId = (payload as { id: number }).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, location: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}

// Update user details
export async function PATCH(req: Request) {
  try {
    const authToken = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const { payload } = await jwtVerify(authToken, new TextEncoder().encode(JWT_SECRET));
    const userId = (payload as { id: number }).id;

    const { newUsername, password, location } = await req.json();

    const updatedData: any = {};
    if (newUsername) {
      const existingUser = await prisma.user.findUnique({ where: { username: newUsername } });
      if (existingUser) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
      updatedData.username = newUsername;
    }
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }
    if (location) {
      updatedData.location = location;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    return NextResponse.json({ message: "Account updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}