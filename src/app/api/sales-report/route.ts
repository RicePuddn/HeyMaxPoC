import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function GET(req: Request) {
  try {
    const authToken = req.headers
      .get("cookie")
      ?.split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      authToken,
      new TextEncoder().encode(JWT_SECRET)
    );

    const sellerId = Number(payload.id); // Assuming the payload contains the seller ID
    const role = payload.role;

    if (role !== "seller") {
      return NextResponse.json({ error: "Forbidden: Not a seller" }, { status: 403 });
    }

    // Fetch total revenue
    const totalRevenue = await prisma.transactions.aggregate({
      _sum: { totalPrice: true },
      where: { sellerId },
    });

    // Fetch unique customers
    const uniqueCustomersCount = await prisma.transactions.groupBy({
      by: ["customerId"],
      where: { sellerId },
    });
    const uniqueCustomers = uniqueCustomersCount.length;

    // Fetch top-selling products
    const topSellingProducts = await prisma.transactions.groupBy({
      by: ["foodItemId"],
      _sum: { totalPrice: true },
      _count: { foodItemId: true },
      orderBy: { _sum: { totalPrice: "desc" } },
      where: { sellerId },
    });

    const topProduct = topSellingProducts[0];
    console.log(topProduct);

    // Fetch returning customers
    const returningCustomers = await prisma.transactions.groupBy({
      by: ["customerId"],
      _count: { customerId: true },
      having: {
        customerId: {
          _count: { gt: 1 }, // Customers with more than one transaction
        },
      },
      where: { sellerId },
    });

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      uniqueCustomers,
      topSellingProducts,
      topProduct,
      returningCustomers: returningCustomers.length,
    });
  } catch (error) {
    console.error("Error fetching sales report:", error);
    return NextResponse.json({ error: "Failed to fetch sales report." }, { status: 500 });
  }
}