
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req) {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
        return new NextResponse(JSON.stringify({ error: "No file uploaded." }), { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // The name of the file will be preserved
    const filePath = path.join(process.cwd(), 'public/uploads', file.name);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${file.name}`;

    return new NextResponse(JSON.stringify({ url: fileUrl }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
