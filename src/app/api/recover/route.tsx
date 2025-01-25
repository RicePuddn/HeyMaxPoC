import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, newPassword } = await req.json();

    if (!username || !newPassword) {
      return NextResponse.json({ error: "Username and new password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    await prisma.user.update({
      where: { username },
      data: { password: newPassword },
    });

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }
}