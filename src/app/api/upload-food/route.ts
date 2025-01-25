import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req: Request) {
  try {
    // Parse the multipart form data
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const quantity = parseInt(formData.get("quantity") as string, 10);
    const price = parseFloat(formData.get("price") as string); // Get price
    const description = formData.get("description") as string;
    const image = formData.get("image") as File | null;

    // Validate input
    if (!name || !quantity || !price || !description || !image) {
      return NextResponse.json(
        { error: "All fields are required." },
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

    // Verify the token to get the seller's ID
    const { payload } = await jwtVerify(
      authToken,
      new TextEncoder().encode(JWT_SECRET)
    );
    const sellerId = Number(payload.id);

    // Generate a unique filename for the uploaded image
    const filename = `${nanoid()}-${image.name}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // Ensure upload directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Write the image file to the upload directory
    const buffer = await image.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(buffer));

    // Save food item metadata to the database
    const foodItem = await prisma.foodItem.create({
      data: {
        name,
        quantity,
        price,
        description,
        imageUrl: `/uploads/${filename}`, // Store the relative path of the image
        providerId: sellerId, // Associate with the authenticated seller's ID
      },
    });

    return NextResponse.json({ message: "Food item created", foodItem });
  } catch (error) {
    console.error("Error creating food item:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}