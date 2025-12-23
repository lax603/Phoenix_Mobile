
import { clerkClient } from "@clerk/nextjs/server";

const authAdmin = async (userId) => {
   try {
    if(!userId) {
        console.log("authAdmin: userId is missing");
        return false;
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
        console.log(`authAdmin: user with id ${userId} not found`);
        return false;
    }

    if (!user.emailAddresses || user.emailAddresses.length === 0) {
        console.log(`authAdmin: user with id ${userId} has no email addresses`);
        return false;
    }

    const adminEmail = "user.laxsan732@gmail.com";
    const userEmails = user.emailAddresses.map(email => email.emailAddress);

    // Log the emails found for the user
    console.log(`authAdmin: User emails found: ${JSON.stringify(userEmails)}`);

    const isAdmin = userEmails.includes(adminEmail);
    console.log(`authAdmin: isAdmin check for user ${userId} resulted in ${isAdmin}`);

    return isAdmin;

   } catch (error) {
    console.error("Error in authAdmin:", error);
    return false;
   }
}

export default authAdmin;
