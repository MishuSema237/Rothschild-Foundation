import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Registration from "@/models/Registration";
import { cookies, headers } from "next/headers";

export async function GET() {
    await cookies();
    await headers();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const registrations = await Registration.find().sort({ createdAt: -1 });
        return NextResponse.json(registrations);
    } catch {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
