import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const emailHtml = `
            <div style="font-family: sans-serif; border: 1px solid #d4af37; padding: 20px; color: #050505;">
                <h2 style="color: #d4af37;">New Contact Message</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr style="border: 0; border-top: 1px solid #d4af37/20; margin: 20px 0;" />
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
            </div>
        `;

        await sendEmail(
            process.env.ADMIN_EMAIL!,
            `Portal Contact: ${subject}`,
            emailHtml
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ error: "Error submitting form. Try again later." }, { status: 500 });
    }
}
