
import nodemailer from 'nodemailer';

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('Email credentials are missing from environment variables');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"CollegeBuddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your CollegeBuddy Verification Code',
      text: `Your CollegeBuddy verification code is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="background:#09090b;color:#fafafa;padding:40px;text-align:center;font-family:Arial,sans-serif;border-radius:16px;max-width:500px;margin:auto;">
          <h1 style="color:#fb923c;">CollegeBuddy</h1>
          <p>Your one-time verification code is below. It expires in 10 minutes.</p>
          <div style="background:#18181b;padding:20px;border-radius:12px;">
            <span style="font-size:32px;font-weight:bold;letter-spacing:5px;color:white;">${otp}</span>
          </div>
          <p style="color:#a1a1aa;font-size:12px;margin-top:30px;">
            If you didn't request this, safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send OTP email:', error.message);
    throw new Error('Unable to send verification email');
  }
};
