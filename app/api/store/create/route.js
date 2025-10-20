<<<<<<< HEAD
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
  
    } catch (error) {

  }

}
=======
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
  
    } catch (error) {

  }

}
>>>>>>> 11e0df0a9d43abf0c4dfc31c5c8c4182a4403193
