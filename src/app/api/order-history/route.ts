import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function GET(req: Request) {
  try {
    // Extract authToken from cookies
    const authToken = req.headers
      .get("cookie")
      ?.split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token to get customer ID
    const { payload } = await jwtVerify(
      authToken,
      new TextEncoder().encode(JWT_SECRET)
    );
    const customerId = Number(payload.id);

    // Fetch transactions for the customer
    const transactions = await prisma.transactions.findMany({
      where: { customerId },
      include: {
        seller: { select: { username: true } }, // Fetch seller's name
        foodItem: { select: { name: true, price: true } }, // Fetch food item's name and price
      },
    });

    // Map transactions to include calculated quantity and other details
    const mappedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      sellerId: transaction.sellerId,
      sellerName: transaction.seller.username,
      foodItemId: transaction.foodItemId,
      foodItemName: transaction.foodItem.name,
      quantity: transaction.totalPrice / transaction.foodItem.price, // Calculate quantity
      totalPrice: transaction.totalPrice,
      createdAt: transaction.createdAt,
    }));

    return NextResponse.json({ transactions: mappedTransactions });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return NextResponse.json(
      { error: "Failed to fetch order history." },
      { status: 500 }
    );
  }
}