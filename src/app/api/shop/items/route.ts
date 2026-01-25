import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';

export async function GET() {
    try {
        await connectToDatabase();
        const items = await Item.find({}).sort({ createdAt: -1 });
        return NextResponse.json(items);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
