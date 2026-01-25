import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import PaymentMethod from "@/models/PaymentMethod";
import { cookies, headers } from "next/headers";

export async function GET() {
    await cookies();
    await headers();
    try {
        await connectToDatabase();
        const methods = await PaymentMethod.find({ isActive: true });
        return NextResponse.json(methods);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await cookies();
    await headers();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await connectToDatabase();
        const body = await req.json();
        const method = await PaymentMethod.create(body);
        return NextResponse.json(method);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    await cookies();
    await headers();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await connectToDatabase();
        const { id, ...updateData } = await req.json();
        const method = await PaymentMethod.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(method);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    await cookies();
    await headers();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    try {
        await connectToDatabase();
        await PaymentMethod.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
