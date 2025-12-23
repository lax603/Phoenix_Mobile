
import { NextResponse } from "next/server";
import imagekit from "@/configs/imageKit";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const fileBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(fileBuffer);

        const response = await imagekit.upload({
            file: buffer,
            fileName: file.name,
        });

        return NextResponse.json({ url: response.url });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
    }
}
