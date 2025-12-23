
import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get all pending stores
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "You are not an authorized admin." }, { status: 401 });
        }

        const stores = await prisma.store.findMany({
            where: { status: "pending" },
            include: {
                owner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        imageUrl: true,
                        primaryEmailAddress: true
                    }
                }
            }
        });

        return NextResponse.json(stores);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
    }
}

// Approve or reject a store
export async function PUT(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "You are not an authorized admin." }, { status: 401 });
        }

        const body = await request.json();
        const { storeId, status } = body;

        if (!storeId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const store = await prisma.store.update({
            where: { id: storeId },
            data: { status }
        });

        return NextResponse.json(store);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
    }
}
