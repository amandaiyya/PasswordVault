import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import envConfig from "@/lib/envConfig";
import { cookies } from "next/headers";

export async function POST(req) {
     const {email, password} = await req.json();

     if(!email || !password) {
        return NextResponse.json(
            {
                success: false,
                message: "Credentials are required"
            },
            { status: 400 }
        )
    }

    try {
        await dbConnect();

        const user = await User.findOne({email});

        if(!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Incorrect Password"
                },
                { status: 400 }
            )
        }

        const accessToken = jwt.sign(
            {
                _id: user._id,
                email: user.email,
            },
            envConfig.tokenSecret,
            { expiresIn: envConfig.tokenExpiry || "1d" }
        )

        const cookieStore = await cookies();

        cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            secure: envConfig.nodeEnv === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60
        })

        return NextResponse.json(
            {
                success: true,
                message: "User logged in successfully",
                user: {
                    _id: user._id,
                    email: user.email,
                    salt: user.salt,
                    vaultTest: user.vaultTest
                }
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed logging in user",error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed logging in user"
            },
            { status: 500 }
        )
    }
}