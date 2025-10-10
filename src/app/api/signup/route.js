import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
    const {email, password, salt, vaultTest} = await req.json();

    if(!email || !password || !salt || !vaultTest) {
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

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists"
                },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email,
            password: hashedPassword,
            salt,
            vaultTest
        })

        return NextResponse.json(
            {
                success: true,
                message: "User signed up successfully",
            },
            { status: 201 }
        )
        
    } catch (error) {
        console.log("Failed signing up user",error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed signing up user"
            },
            { status: 500 }
        )
    }
}