
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET(req) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ isAdmin: false });
        }
        const isAdmin = await authAdmin(userId);
        return NextResponse.json({ isAdmin });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
