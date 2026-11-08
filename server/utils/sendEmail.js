import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are missing from environment variables");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlTemplate = `
    <div style="background-color: #09090b; color: #fafafa; font-family: Arial, sans-serif; padding: 40px; text-align: center; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <h1 style="color: #fb923c; margin-bottom: 20px; font-size: 24px;">CollegeBuddy</h1>
      <p style="font-size: 16px; margin-bottom: 30px; color: #a1a1aa;">Here is your one-time verification code. It expires in 10 minutes.</p>
      <div style="background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.14); padding: 20px; border-radius: 12px; display: inline-block; margin-bottom: 30px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ffffff;">${otp}</span>
      </div>
      <p style="color: #52525b; font-size: 12px; margin-top: 30px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  const mailOptions = {
    from: `"CollegeBuddy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your CollegeBuddy Verification Code",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};