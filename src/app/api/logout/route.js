import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");

    return NextResponse.json(
        {
            success: true,
            message: "User logged out successfully"
        },
        { status: 200 }
    )
}