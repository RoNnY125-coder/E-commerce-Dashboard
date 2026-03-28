import nodemailer from 'nodemailer';

// Configure nodemailer (in development, will just log if credentials aren't set)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || 'apikey',
    pass: process.env.SENDGRID_API_KEY || 'fake-api-key',
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`;

  // If no sendgrid key is set skip actual sending to avoid crash in local dev
  if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY.startsWith('SG.xx')) {
    console.log(`[DEV MODE Email] To: ${to} | Subject: ${subject}`);
    console.log(`[DEV MODE Email] Content: ${html}`);
    return;
  }

  try {
    await transporter.sendMail({ from, to, subject, html });
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
};
