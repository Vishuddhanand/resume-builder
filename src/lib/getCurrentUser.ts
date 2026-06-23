import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

async function getCurrentUser() {
    const cookieStorage = await cookies()

    const token = cookieStorage.get('token')?.value

    if (!token) throw new Error('No token found')

    const decoded = verifyToken(token)
    console.log(decoded)

    if (!decoded) throw new Error('Invalid token')

    return decoded as { userId: string, email?: string }


}

export default getCurrentUser