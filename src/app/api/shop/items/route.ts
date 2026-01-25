import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';

export async function GET() {
    try {
        await connectToDatabase();
        const items = await Item.find({}).sort({ createdAt: -1 });
        return NextResponse.json(items);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
