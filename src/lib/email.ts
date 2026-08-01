export type AccountCreatedEmail = {
  to: string;
  name: string;
  loginUrl: string;
  appUrl: string;
};

export async function sendAccountCreatedEmail({ to, name, loginUrl, appUrl }: AccountCreatedEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY is not configured" };

  const from = process.env.EMAIL_FROM || "Aleksandra i Pawel <onboarding@resend.dev>";
  const replyTo = process.env.EMAIL_REPLY_TO;
  const subject = "Dostep do panelu wesela Aleksandry i Pawla";
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
      <h1 style="color:#234d43">Masz dostep do panelu wesela</h1>
      <p>Czesc ${escapeHtml(name)},</p>
      <p>Utworzono dla Ciebie konto superadmina w aplikacji weselnej Aleksandry i Pawla.</p>
      <p><strong>Adres aplikacji:</strong> <a href="${appUrl}">${appUrl}</a></p>
      <p><strong>Logowanie do panelu:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
      <p>Loginem jest ten adres e-mail. Haslo przekaze administrator, ktory utworzyl konto.</p>
      <p style="margin-top:24px;color:#6b7280;font-size:13px">Jesli nie spodziewasz sie tego maila, zignoruj wiadomosc.</p>
    </div>
  `;
  const text = [
    `Czesc ${name},`,
    "Utworzono dla Ciebie konto superadmina w aplikacji weselnej Aleksandry i Pawla.",
    `Adres aplikacji: ${appUrl}`,
    `Logowanie do panelu: ${loginUrl}`,
    "Loginem jest ten adres e-mail. Haslo przekaze administrator, ktory utworzyl konto.",
  ].join("\n\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text, reply_to: replyTo || undefined }),
  });

  if (!response.ok) {
    const error = await response.text().catch(() => "");
    return { sent: false, reason: error || `Resend HTTP ${response.status}` };
  }

  return { sent: true, reason: "" };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char] || char));
}
