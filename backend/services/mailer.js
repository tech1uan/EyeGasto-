import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function verificationEmailTemplate(code) {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#E6F5F4;padding:40px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="420" cellpadding="0" cellspacing="0" style="max-width:420px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,122,116,0.12);">
        <tr>
          <td style="background:linear-gradient(180deg,#007A74 0%,#009E94 20%,#23736F 100%);padding:36px 24px;" align="center">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">GASTOO</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.85);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Smart Expense Tracker</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:36px 32px 32px;">
            <h2 style="margin:0 0 6px;font-size:19px;font-weight:600;color:#1A1A1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Your verification code</h2>
            <p style="margin:0 0 24px;font-size:14px;color:#6B7280;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Enter this code to verify your email address.</p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
              <tr>
                <td style="background:#E6F5F4;border-radius:12px;padding:18px 36px;">
                  <h1 style="margin:0;font-size:34px;letter-spacing:8px;font-weight:700;color:#007A74;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${code}</h1>
                </td>
              </tr>
            </table>
            <p style="margin:0;font-size:13px;color:#9CA3AF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">This code expires in <b style="color:#23736F;">10 minutes</b></p>
          </td>
        </tr>
        <tr><td style="padding:0 32px;"><div style="border-top:1px solid #F1F5F4;"></div></td></tr>
        <tr>
          <td align="center" style="padding:20px 32px 28px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Didn't request this? You can safely ignore this email.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `;
}

export async function sendVerificationEmail(email, code) {
  const { data, error } = await resend.emails.send({
    from: 'Gastoo <onboarding@resend.dev>', // swap to noreply@yourdomain.com once verified in Resend
    to: [email],
    subject: 'Verify your email',
    html: verificationEmailTemplate(code),
  });

  if (error) {
    throw error;
  }

  return data;
}

export default { sendVerificationEmail };