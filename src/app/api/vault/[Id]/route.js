import dbConnect from "@/lib/dbConnect";
import envConfig from "@/lib/envConfig";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Vault from "@/models/Vault.model";

export async function PUT(req, {params}) {
    const { Id } = await params;

    const {title, username, password, url = '', note = ''} = await req.json();

    if(!title?.trim() || !username?.trim() || !password) {
        return NextResponse.json(
            {
                success: false,
                message: "Title, Username and Password are required"
            },
            { status: 400 }
        )
    }

    try {
        await dbConnect();

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
        
        jwt.verify(token, envConfig.tokenSecret);

        const entry = await Vault.findById(Id);

        if(!entry) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No entry found in the vault"
                },
                { status: 404 }
            )
        }

        const isTitleChanged = title !== entry.title;
        const isUsernameChanged = username !== entry.username;
        const isPasswordChanged = password !== entry.password;
        const isURLChanged = url !== entry.url;
        const isNoteChanged = note !== entry.note;

        if(isTitleChanged) entry.title = title;
        if(isUsernameChanged) entry.username = username;
        if(isPasswordChanged) entry.password = password;
        if(isURLChanged) entry.url = url;
        if(isNoteChanged) entry.note = note;

        if(
            isTitleChanged || 
            isUsernameChanged || 
            isPasswordChanged || 
            isURLChanged || 
            isNoteChanged
        ) {
            await entry.save();

            return NextResponse.json(
                {
                    success: true,
                    message: "Vault's entry updated successfully",
                },
                { status: 200 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: "No Changes detected",
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed updating vault's entry", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed updating vault's entry"
            },
            { status: 500 }
        )
    }
}

export async function DELETE(req, {params}) {
    const { Id } = await params;

    try {
        await dbConnect();

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
        
        jwt.verify(token, envConfig.tokenSecret);

        const entry = await Vault.findById(Id);

        if(!entry) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No entry found in the vault"
                },
                { status: 404 }
            )
        }

        await entry.deleteOne();

        return NextResponse.json(
            {
                success: true,
                message: "Vault's entry deleted successfully",
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed deleting vault's entry", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed deleting vault's entry"
            },
            { status: 500 }
        )
    }
}