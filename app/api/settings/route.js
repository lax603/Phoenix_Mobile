import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'data', 'siteSettings.json');

export async function GET() {
    try {
        const data = await fs.readFile(settingsFilePath, 'utf-8');
        const settings = JSON.parse(data);
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ message: 'Failed to read settings file.' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const newSettings = await req.json();

        const currentData = await fs.readFile(settingsFilePath, 'utf-8');
        const currentSettings = JSON.parse(currentData);

        // Check if the logo or hero image should be deleted
        if (currentSettings.navbar.logoUrl && !newSettings.navbar.logoUrl) {
            const imagePath = path.join(process.cwd(), 'public', currentSettings.navbar.logoUrl);
            if(!imagePath.includes('default')) await fs.unlink(imagePath);
        }
        if (currentSettings.hero.imageUrl && !newSettings.hero.imageUrl) {
            const imagePath = path.join(process.cwd(), 'public', currentSettings.hero.imageUrl);
            if(!imagePath.includes('default')) await fs.unlink(imagePath);
        }

        await fs.writeFile(settingsFilePath, JSON.stringify(newSettings, null, 2));

        return NextResponse.json({ message: 'Settings saved successfully!' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to save settings.' }, { status: 500 });
    }
}
