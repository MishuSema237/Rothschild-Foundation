import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { sendEmail } from '@/lib/email';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Upload images to Cloudinary
    let personalPhotoUrl = '';
    let idCardPhotoUrl = '';

    if (body.personalPhoto) {
      const uploadRes = await cloudinary.uploader.upload(body.personalPhoto, {
        folder: 'rothschild/members',
      });
      personalPhotoUrl = uploadRes.secure_url;
    }

    if (body.idCardPhoto) {
      const uploadRes = await cloudinary.uploader.upload(body.idCardPhoto, {
        folder: 'rothschild/ids',
      });
      idCardPhotoUrl = uploadRes.secure_url;
    }

    // Create record in DB with URLs instead of base64
    const registration = await Registration.create({
      ...body,
      personalPhoto: personalPhotoUrl,
      idCardPhoto: idCardPhotoUrl,
    });

    // Send notifications
    const adminEmailHtml = `
      <div style="font-family: sans-serif; border: 1px solid #d4af37; padding: 20px;">
        <h2 style="color: #d4af37;">New Member Registration: ${body.name}</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Country:</strong> ${body.country}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        <p><strong>Payment Method:</strong> ${body.paymentMethod}</p>
        <hr />
        <p><strong>Personal Photo:</strong> <a href="${personalPhotoUrl}">View Image</a></p>
        <p><strong>ID Card:</strong> <a href="${idCardPhotoUrl}">View Image</a></p>
        <hr />
        <p>View full details in the <a href="${process.env.NEXTAUTH_URL}/admin">Admin Dashboard</a>.</p>
      </div>
    `;

    const userEmailHtml = `
      <div style="font-family: serif; background-color: #0a0a0a; color: #d4af37; padding: 40px; border: 1px solid #d4af37; text-align: center;">
        <h1 style="color: #d4af37;">Welcome to Rothschild & Co</h1>
        <div style="text-align: left; max-width: 500px; margin: 0 auto;">
          <p>Dear ${body.name},</p>
          <p>Your registration has been received and added to our sacred records. This marks the beginning of your journey into the circle.</p>
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Verification of your documents.</li>
            <li>Initiation instructions via WhatsApp or Email.</li>
          </ul>
          <p style="margin-top: 30px;">Light and progress be upon you always.</p>
          <p style="text-align: right;"><em>Rothschild & Co</em></p>
        </div>
      </div>
    `;

    await Promise.allSettled([
      sendEmail(process.env.ADMIN_EMAIL!, `NEW REGISTRATION: ${body.name}`, adminEmailHtml),
      sendEmail(body.email, "Registration Received - Rothschild & Co", userEmailHtml)
    ]);

    return NextResponse.json({ success: true, id: registration._id });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
