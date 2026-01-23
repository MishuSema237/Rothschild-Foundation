import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { to, subject, message, applicantName } = await req.json();

    const themedHtml = `
      <div style="font-family: serif; background-color: #0a0a0a; color: #d4af37; padding: 40px; border: 1px solid #d4af37;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d4af37; letter-spacing: 5px; text-transform: uppercase;">Rothschild & Co</h1>
          <p style="color: #d4af37; font-size: 12px; letter-spacing: 2px;">Sacred Communication</p>
        </div>
        
        <div style="background: rgba(212, 175, 55, 0.05); padding: 30px; border-radius: 10px;">
          <p>Dear ${applicantName},</p>
          <p style="line-height: 1.6;">${message}</p>
          
          <div style="margin-top: 40px; border-top: 1px solid rgba(212, 175, 55, 0.2); pt: 20px;">
            <p>Light and progress be upon you.</p>
            <p style="font-style: italic;">The Head Master</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; font-size: 10px; color: rgba(212, 175, 55, 0.3);">
          THIS COMMUNICATION IS ENCRYPTED AND SACRED. 
          UNAUTHORIZED DISCLOSURE IS SUBJECT TO THE LAWS OF THE CIRCLE.
        </div>
      </div>
    `;

    await sendEmail(to, subject, themedHtml);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
