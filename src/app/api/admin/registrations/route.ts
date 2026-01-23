import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Registration from "@/models/Registration";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const registrations = await Registration.find().sort({ createdAt: -1 });
        return NextResponse.json(registrations);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
