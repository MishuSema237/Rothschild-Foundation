import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Registration from '@/models/Registration';
import Item from '@/models/Item';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const { registrationCode, orderNumber } = await req.json();

        if (!registrationCode || !orderNumber) {
            return NextResponse.json({ error: "Missing sacred identifiers." }, { status: 400 });
        }

        // 1. Find Registration
        const registration = await Registration.findOne({ uniqueCode: registrationCode.trim().toUpperCase() });
        if (!registration) {
            return NextResponse.json({ error: "Sacred Code not found in records." }, { status: 404 });
        }

        // 2. Find Order
        const order = await Order.findOne({
            orderNumber: orderNumber.trim().toUpperCase(),
            registrationId: registration._id
        }).populate('itemId', 'name price image description');

        if (!order) {
            return NextResponse.json({ error: "Order not found or not associated with this code." }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        console.error('Track API Error:', error);
        return NextResponse.json({ error: "Connection to the records was disrupted." }, { status: 500 });
    }
}
