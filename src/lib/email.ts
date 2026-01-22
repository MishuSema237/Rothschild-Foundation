import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"Rothschild & Co" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        return { success: true, info };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error };
    }
};
