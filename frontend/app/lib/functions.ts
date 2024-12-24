import { cookies } from "next/headers";

export const getRole = async () => {
    const cookieStore = await cookies()
    const token: string = cookieStore.get("token")?.value as string
    if(!token) return
    
    const tokenPayload = JSON.parse(Buffer.from(token?.split(".")[1], "base64").toString());
    const role = tokenPayload.user.role;

    return role;
}