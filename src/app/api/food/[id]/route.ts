import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { name, quantity, price, description } = await req.json();

    const updatedProduct = await prisma.foodItem.update({
      where: { id: parseInt(id) },
      data: { name, quantity, price, description },
    });

    return NextResponse.json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.foodItem.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}