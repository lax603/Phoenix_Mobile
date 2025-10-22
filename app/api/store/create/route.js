import { auth } from "@clerk/nextjs/server";
import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// create a new store
export async function POST(request) {
  try {
    const {userId} = await auth();
    
    if(!userId){
        return NextResponse.json({error: "Unauthorized - Please login"}, {status: 401});
    }
    
    // get the data from the form data
    const formData = await request.formData();

    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");

    if(!name || !username || !description || !email || !contact || !address || !image){
        return NextResponse.json({message: "missing store info"}, {status: 400});
    }

    // ✅ CREATE USER IF NOT EXISTS
    let user = await prisma.user.findUnique({
        where: {id: userId}
    });

    if(!user){
        user = await prisma.user.create({
            data: {
                id: userId,
                // Add other required fields from your User schema
                // email: email, // if required
                // name: name, // if required
            }
        });
    }

    // check the user have already registered a store
    const store = await prisma.store.findFirst({
        where: {userId: userId}
    })

    // if store is already registered then send status of store
    if(store){
        return NextResponse.json({status: store.status});
    }

    // check user name is already taken
    const isUsernameTaken = await prisma.store.findFirst({
        where: {username: username.toLowerCase()}
    })

    if(isUsernameTaken){
        return NextResponse.json({error: "username is already taken"}, {status: 400});
    }

    // image upload to imagekit
    const buffer = Buffer.from(await image.arrayBuffer());
    const response = await imagekit.upload({
        file: buffer,
        fileName: image.name,
        folder: "logos"
    })

    const optimizedImage = imagekit.url({
        path: response.filePath,
        transformation: [
            {quality: 'auto'},
            {format: 'webp'},
            {width: '512'}
        ]
    })

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
    })

    // link store to user (this might not be needed if relation is automatic)
    await prisma.user.update({
        where: {id: userId},
        data: {store: {connect: {id: newStore.id}}}
    })

    return NextResponse.json({message: 'applied, waiting for approval'});

  } catch (error) {
      console.error(error);
      return NextResponse.json({error: error.code || error.message}, {status: 400});
  }
}

// check is user have already registered a store if yes then send status
export async function GET(request) {
    try {
        const {userId} = await auth();
        
        if(!userId){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        // check the user have already registered a store
        const store = await prisma.store.findFirst({
            where: {userId: userId}
        })

        // if store is already registered then send status of store
        if(store){
            return NextResponse.json({status: store.status});
        }

        return NextResponse.json({status: 'not registered'});

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400});
    }
}