import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty. Cannot proceed with checkout." },
        { status: 400 }
      );
    }

    // Extract authToken from cookies
    const authToken = req.headers
      .get("cookie")
      ?.split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token to get the customer's ID
    const { payload } = await jwtVerify(
      authToken,
      new TextEncoder().encode(JWT_SECRET)
    );
    const customerId = Number(payload.id);

    const transactionPromises = cart.map(async (item: any) => {
      const foodItem = await prisma.foodItem.findUnique({
        where: { id: item.id },
      });

      if (!foodItem) {
        throw new Error(`FoodItem with ID ${item.id} not found.`);
      }

      if (foodItem.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for FoodItem ${foodItem.name}. Available: ${foodItem.quantity}, Requested: ${item.quantity}`
        );
      }

      // Update the food item's quantity
      await prisma.foodItem.update({
        where: { id: item.id },
        data: {
          quantity: foodItem.quantity - item.quantity,
        },
      });

      // Create a transaction entry
      await prisma.transactions.create({
        data: {
          sellerId: foodItem.providerId,
          customerId,
          foodItemId: item.id,
          totalPrice: item.quantity * foodItem.price,
        },
      });
    });

    // Execute all transaction promises
    await Promise.all(transactionPromises);

    return NextResponse.json({ message: "Checkout successful!" });
  } catch (error) {
    console.error("Error during checkout:", error);
    const errorMessage = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}