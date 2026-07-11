import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = {
  sendMail: async ({ to, subject, html }) => {
    const { data, error } = await resend.emails.send({
      from: 'Gastoo <onboarding@resend.dev>',
      to,
      subject,
      html
    });

    if (error) {
      console.error('❌ Email error:', error);
      throw error;
    }

    console.log('✅ Email sent successfully!', data);
    return data;
  }
};

export default transporter;