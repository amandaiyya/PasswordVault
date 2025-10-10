import dbConnect from "@/lib/dbConnect";
import envConfig from "@/lib/envConfig";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Vault from "@/models/Vault.model";
import mongoose from "mongoose";

export async function PUT(req, {params}) {
    const { Id } = await params;

    if(!mongoose.Types.ObjectId.isValid(Id)){
        return NextResponse.json(
            {
                success: false,
                message: "Entry's ID is Invalid"
            },
            { status: 400 }
        )
    }

    const data = await req.json();

    console.log(data);

    if(!data) {
        return NextResponse.json(
            {
                success: false,
                message: "Entry's data is required"
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

        const entry = await Vault.findByIdAndUpdate(Id, data);

        if(!entry) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No entry found in the vault"
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Vault's entry updated successfully",
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

    if(!mongoose.Types.ObjectId.isValid(Id)){
        return NextResponse.json(
            {
                success: false,
                message: "Entry's ID is Invalid"
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

        const entry = await Vault.findByIdAndDelete(Id);

        if(!entry) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No entry found in the vault"
                },
                { status: 404 }
            )
        }

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