import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";

const SMTP_HOST = "smtp.zeptomail.com";
const SMTP_PORT = 587;
const SMTP_USER = "emailapikey";
const SMTP_PASS = "wSsVR61+/kL5XK5/zTKtcbo+zF9UAlLwF090ilP17SStF63Docdvl0KcDAamFPgfQm5hETUX97N/n0tRg2EN3t4lnwtVCyiF9mqRe1U4J3x17qnvhDzDV2RfkRSPK4gOzwlimWJjFM5u";
const FROM_NAME = "Lixeen Team";
const FROM_EMAIL = "noreply@lixeen.com";

serve(async (req) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Parse body
  const { to, userName, projectCodename, projectTitle } = await req.json();

  if (!to || !projectCodename) {
    return new Response("Missing required fields", { status: 400 });
  }

  const subject = `You've been assigned to ${projectCodename}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#000000;padding:28px 36px;">
              <div style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">⚡ Lixeen</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 36px 28px;">
              <p style="font-size:22px;font-weight:800;color:#000;letter-spacing:-0.03em;margin:0 0 8px;">
                You've been assigned a new project
              </p>
              <p style="font-size:14px;color:#666;margin:0 0 28px;line-height:1.6;">
                Hi ${userName ?? "there"}, an administrator has activated a project for your account.
              </p>

              <!-- Project card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border:1px solid #e8e8e8;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#999;margin-bottom:6px;">Project</div>
                    <div style="font-size:18px;font-weight:800;color:#000;letter-spacing:-0.02em;margin-bottom:4px;">${projectCodename}</div>
                    <div style="font-size:13px;color:#666;">${projectTitle ?? ""}</div>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:#666;line-height:1.7;margin:0 0 28px;">
                Log in to your dashboard to view the project brief and start tasking.
                The project is now available in your <strong>Available Projects</strong> tab.
              </p>

              <!-- CTA -->
              <a href="https://app.lixeen.com/dashboard" style="display:inline-block;background:#000000;color:#ffffff;font-size:13px;font-weight:700;padding:12px 24px;border-radius:8px;text-decoration:none;letter-spacing:0.01em;">
                Go to Dashboard →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid #f0f0f0;">
              <p style="font-size:11px;color:#bbb;margin:0;line-height:1.6;">
                You're receiving this because an administrator assigned you to a project on Lixeen.<br/>
                © ${new Date().getFullYear()} Lixeen. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // Send via ZeptoMail SMTP using fetch to a relay, or direct SMTP via Deno
  // Deno doesn't support nodemailer, so we use the ZeptoMail HTTP API instead
  const zmPayload = {
    from: { address: FROM_EMAIL, name: FROM_NAME },
    to: [{ email_address: { address: to, name: userName ?? to } }],
    subject,
    htmlbody: html,
  };

  const zmRes = await fetch("https://api.zeptomail.com/v1.1/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Zoho-enczapikey ${SMTP_PASS}`,
    },
    body: JSON.stringify(zmPayload),
  });

  const zmData = await zmRes.json();

  if (!zmRes.ok) {
    console.error("ZeptoMail error:", zmData);
    return new Response(JSON.stringify({ error: zmData }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});