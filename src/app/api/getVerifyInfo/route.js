import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import envConfig from "@/lib/envConfig";
import User from "@/models/User.model";

export async function GET(req) {
    try {
        const token = await req.cookies.get("accessToken").value;

        if(!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized"
                },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, envConfig.tokenSecret);

        await dbConnect();

        const user = await User.findOne({
            _id: decoded._id
        }).select("-password");
        
        if(!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }
        
        return NextResponse.json(
            {
                success: true,
                message: "Verification information fetched successfully",
                info: {
                    salt: user.salt,
                    vaultTest: user.vaultTest
                }
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed fetching Verification information", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed fetching Verification information"
            },
            { status: 500 }
        )
    }
}