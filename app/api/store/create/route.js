
import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// create a new store
export async function POST(request) {
  try {
    const {userId} = getAuth(request);
    // get the data from the from
    const formatData = await request.formatData();

    const name = formatData.get("name");
    const username = formatData.get("username");
    const description = formatData.get("description");
    const email = formatData.get("email");
    const contact = formatData.get("contact");
    const address = formatData.get("address");
    const image = formatData.get("image");

    if(!name || !username || !description || !email || !contact || !address || !image){
        return NextResponse.json({message: "missing store info"}, {status: 400});
    }

    // check the user have already registered a store
    const store = await prisma.store.findFirst({
        where: {userId: userId}
    })

    // if store is already registered then send stuatus of store
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
        folder: "logos",
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
            image: optimizedImage,
        }
    })

    // link store to user
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


