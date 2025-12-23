
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get all products for a store
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "You are not an authorized seller." }, { status: 401 });
        }

        const products = await prisma.product.findMany({
            where: { storeId },
        });

        return NextResponse.json(products);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
    }
}


// Add a new product
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "You are not an authorized seller." }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, mrp, price, images } = body;

        if (!name || !description || !mrp || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                mrp: parseFloat(mrp),
                price: parseFloat(price),
                images: images, // Updated to use the images array from the request
                storeId: storeId
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
    }
}
