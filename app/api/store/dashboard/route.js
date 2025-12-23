
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



//get dashboard data for seller (analytics)
export async function GET(request) {
    try {
        const {userId} = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "You are not an authorized seller." }, { status: 401 });
        }

        // get all orders for the seller
        const orders = await prisma.order.findMany({where: {storeId}})

        // get all products with ratings for seller
        const products = await prisma.product.findMany({where: {storeId}})


        return NextResponse.json({orders, products});

    } catch (error) {
       console.error(error);
       return NextResponse.json({error: error.message || "An error occurred"}, {status: 500});
    }
}
