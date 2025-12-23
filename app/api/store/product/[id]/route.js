
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";

// Get a single product by ID
export async function GET(request, { params }) {
    try {
        const { id } = params;
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
    }
}


// Update a product
export async function PUT(request, { params }) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "You are not an authorized seller." }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();
        const { name, description, mrp, price, images } = body;

        if (!name || !description || !mrp || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                mrp: parseFloat(mrp),
                price: parseFloat(price),
                images: images,
                storeId: storeId
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
    }
}

// Delete a product
export async function DELETE(request, { params }) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "You are not an authorized seller." }, { status: 401 });
        }

        const { id } = params;

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
    }
}
