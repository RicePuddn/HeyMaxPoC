import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const foodItems = await prisma.foodItem.findMany({
      where: {
        quantity: {
          gt: 0, // Ensure only items with quantity > 0 are fetched
        },
      },
      include: {
        provider: {
          select: {
            location: true, // Include the seller's location
          },
        },
      },
    });

    return NextResponse.json({ foodItems });
  } catch (error) {
    console.error("Error fetching food items:", error);
    return NextResponse.json(
      { error: "Failed to fetch food items." },
      { status: 500 }
    );
  }
}