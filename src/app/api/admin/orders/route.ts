import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Registration from '@/models/Registration';
import Item from '@/models/Item';
// These imports are required to register models for .populate()
const _models = { Registration, Item };
console.log("Registered models for population:", !!_models);
import { cookies, headers } from 'next/headers';

export async function GET() {
    await cookies();
    await headers();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await connectToDatabase();
        // Populate registration and item info
        const orders = await Order.find({})
            .populate('registrationId', 'name email uniqueCode')
            .populate('itemId', 'name price')
            .sort({ createdAt: -1 });
        return NextResponse.json(orders);
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
        const body = await req.json();
        const { id, status } = body;
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        return NextResponse.json(order);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
