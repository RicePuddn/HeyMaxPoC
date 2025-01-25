import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    // Extract `id` from params
    const { id } = await context.params;
    const { name, quantity, price, description } = await req.json();

    // Update the food item
    const updatedProduct = await prisma.foodItem.update({
      where: { id: parseInt(id, 10) },
      data: { name, quantity, price, description },
    });

    // Return the updated product
    return NextResponse.json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    // Extract `id` from params
    const { id } = await context.params;

    // Delete the food item
    await prisma.foodItem.delete({
      where: { id: parseInt(id, 10) },
    });

    // Return a success message
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}