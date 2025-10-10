import dbConnect from "@/lib/dbConnect";
import envConfig from "@/lib/envConfig";
import Vault from "@/models/Vault.model";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {data} = await req.json();

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

        const decoded = jwt.verify(token, envConfig.tokenSecret);

        await Vault.create({
            data,
            owner: decoded._id
        })

        return NextResponse.json(
            {
                success: true,
                message: "Vault entry saved successfully",
            },
            { status: 201 }
        )
    } catch (error) {
        console.log("Failed saving vault entry", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed saving vault entry"
            },
            { status: 500 }
        )
    }
}

export async function GET(req) {
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

        const decoded = jwt.verify(token, envConfig.tokenSecret);

        const entries = await Vault.find({
            owner: decoded._id
        }).sort({ createdAt: -1 });

        if(!entries?.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No entries found in the vault"
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Vault's entries fetched successfully",
                data: entries
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed fetching vault's all entries", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed fetching vault's all entries"
            },
            { status: 500 }
        )
    }
}