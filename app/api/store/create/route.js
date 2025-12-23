
import { auth, currentUser } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Create a new store
export async function POST(request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" }, 
        { status: 401 }
      );
    }
    
    // Get full user info from Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
      );
    }
    
    // Get form data
    const formData = await request.formData();
    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");

    // Validate required fields
    if (!name || !username || !description || !email || !contact || !address || !image) {
      return NextResponse.json(
        { error: "All fields are required" }, 
        { status: 400 }
      );
    }

    // Create user if doesn't exist
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      const userName = clerkUser.firstName && clerkUser.lastName 
        ? `${clerkUser.firstName} ${clerkUser.lastName}`.trim()
        : clerkUser.firstName || clerkUser.username || "User";
      
      const userEmail = clerkUser.emailAddresses[0]?.emailAddress || email;
      const userImage = clerkUser.imageUrl || clerkUser.profileImageUrl || "";

      user = await prisma.user.create({
        data: {
          id: userId,
          name: userName,
          email: userEmail,
          image: userImage, // ✅ Added user image from Clerk
        }
      });
    }

    // Check if user already has a store
    const existingStore = await prisma.store.findFirst({
      where: { userId: userId }
    });

    if (existingStore) {
      return NextResponse.json(
        { error: "You can only create one store per account." },
        { status: 409 }
      );
    }

    // Check if username is already taken
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() }
    });

    if (isUsernameTaken) {
      return NextResponse.json(
        { error: "Username is already taken" }, 
        { status: 400 }
      );
    }

    // Upload image to ImageKit
    const buffer = Buffer.from(await image.arrayBuffer());
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: image.name,
      folder: "logos"
    });

    // Generate optimized image URL
    const optimizedImage = imagekit.url({
      path: uploadResponse.filePath,
      transformation: [
        { quality: 'auto' },
        { format: 'webp' },
        { width: '512' }
      ]
    });

    // Create new store
    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        username: username.toLowerCase(),
        description,
        email,
        contact,
        address,
        logo: optimizedImage
      }
    });

    // Link store to user
    await prisma.user.update({
      where: { id: userId },
      data: { 
        store: { 
          connect: { id: newStore.id } 
        } 
      }
    });

    return NextResponse.json(
      { message: 'Applied successfully! Waiting for admin approval.' }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Store creation error:", error);
    
    // Professional error handling - don't expose internal details
    const userFriendlyMessage = 
      error.code === 'P2002' ? "This information is already registered" :
      error.code === 'P2003' ? "Unable to process your request. Please try again" :
      "Something went wrong. Please try again later";
    
    return NextResponse.json(
      { error: userFriendlyMessage }, 
      { status: 500 }
    );
  }
}

// Check if user has already registered a store
export async function GET(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // Check if user has a store
    const store = await prisma.store.findFirst({
      where: { userId: userId }
    });

    if (store) {
      return NextResponse.json({ status: store.status });
    }

    return NextResponse.json({ status: 'not registered' });

  } catch (error) {
    console.error("Store status check error:", error);
    
    return NextResponse.json(
      { error: "Unable to check store status. Please try again" }, 
      { status: 500 }
    );
  }
}