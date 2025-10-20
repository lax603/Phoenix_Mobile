import prisma from "@/lib/prisma";
import { UserIcon } from "lucide-react";

const authSeller = async (UserId) => {
    try {
        const user = await prisma.user.findUnique({
            where: {id: UserId},
            include: {store: true},
        });

        if (user.store){
            if (user.store.status === 'approved'){
                return user.store.id;
            }
        }else{
            return false;
        }
    } catch (error) {
        console.error(error)
        return false;
    }
}

export default authSeller