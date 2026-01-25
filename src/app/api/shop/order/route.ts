import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Registration from '@/models/Registration';
import Item from '@/models/Item';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const { uniqueCode, itemId, paymentMethod } = await req.json();

        // 1. Validate Registration Code
        const registration = await Registration.findOne({ uniqueCode: uniqueCode.trim().toUpperCase() });
        if (!registration) {
            return NextResponse.json({ error: "Invalid Sacred Registration Code. Access Denied." }, { status: 403 });
        }

        // 2. Fetch Item
        const item = await Item.findById(itemId);
        if (!item) {
            return NextResponse.json({ error: "Artifact not found in records." }, { status: 404 });
        }

        // 3. Generate Order Number
        const orderNumber = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // 4. Create Order
        await Order.create({
            registrationId: registration._id,
            itemId: item._id,
            orderNumber,
            paymentMethod,
            totalPrice: item.price,
            status: 'pending'
        });

        // 5. Send Emails
        const adminEmailHtml = `
            <div style="font-family: sans-serif; border: 1px solid #d4af37; padding: 20px;">
                <h2 style="color: #d4af37;">New Order Received: ${orderNumber}</h2>
                <p><strong>Member:</strong> ${registration.name} (${registration.uniqueCode})</p>
                <p><strong>Artifact:</strong> ${item.name}</p>
                <p><strong>Price:</strong> $${item.price}</p>
                <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                <hr />
                <p>Please contact the member via the admin dashboard to confirm payment and provide ritual instructions.</p>
                <p><a href="${process.env.NEXTAUTH_URL}/admin">View Order in Dashboard</a></p>
            </div>
        `;

        const userEmailHtml = `
            <div style="font-family: serif; background-color: #0a0a0a; color: #d4af37; padding: 40px; border: 1px solid #d4af37; text-align: center;">
                <h1 style="color: #d4af37;">Order Recorded</h1>
                <div style="text-align: left; max-width: 500px; margin: 0 auto; border: 1px dashed #d4af37; padding: 20px; margin-bottom: 30px;">
                    <p style="text-align: center; font-size: 0.8em; text-transform: uppercase;">Order Number</p>
                    <p style="text-align: center; font-size: 2em; font-weight: bold;">${orderNumber}</p>
                </div>
                <div style="text-align: left; max-width: 500px; margin: 0 auto;">
                    <p>Dear ${registration.name},</p>
                    <p>Your request for the <strong>${item.name}</strong> has been recorded.</p>
                    <p><strong>Next Steps:</strong> An administrator will review your order and send the payment details and shipping protocol to your email shortly.</p>
                    <p>You can track your order status on our portal using your registration code and this order number.</p>
                    <p style="margin-top: 30px;">Light and progress be upon you.</p>
                    <p style="text-align: right;"><em>Rothschild & Co</em></p>
                </div>
            </div>
        `;

        await Promise.allSettled([
            sendEmail(process.env.ADMIN_EMAIL!, `NEW ORDER: ${orderNumber}`, adminEmailHtml),
            sendEmail(registration.email, `Order Confirmation - ${orderNumber}`, userEmailHtml)
        ]);

        return NextResponse.json({ success: true, orderNumber });
    } catch (error: unknown) {
        console.error('Order API Error:', error);
        return NextResponse.json({ error: "A sacred connection error occurred. Please try again." }, { status: 500 });
    }
}
