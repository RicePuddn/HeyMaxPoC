import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function GET(req: Request) {
  try {
    const authToken = req.headers.get("cookie")?.split("; ").find((row) => row.startsWith("authToken="))?.split("=")[1];

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token to get the seller's ID
    const { payload } = await jwtVerify(
      authToken,
      new TextEncoder().encode(JWT_SECRET)
    );

    const sellerId = Number(payload.id);

    // Fetch products for the seller
    const products = await prisma.foodItem.findMany({
      where: { providerId: sellerId },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}