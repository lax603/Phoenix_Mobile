
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";

export async function GET(req) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized - Please login" }, { status: 401 })
        }
        if (!await authAdmin(userId)) {
            return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
        }

        const products = await prisma.product.count();
        const orders = await prisma.order.findMany();
        const stores = await prisma.store.count();
        const users = await prisma.user.count();
        const coupons = await prisma.coupon.count();

        const totalRevenue = orders.reduce((total, order) => total + order.total, 0);


        return NextResponse.json({
            products,
            orders: orders.length,
            stores,
            revenue: totalRevenue,
            users,
            coupons
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
