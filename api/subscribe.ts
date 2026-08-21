import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Visible in Vercel dashboard -> Deployments -> Logs.
  console.log(`FREQUENCY_SIGNUP: ${email}`);

  const emailResult = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Omega Bone <onboarding@resend.dev>",
      to: [email],
      subject: "Here's your free lesson",
      text: "Thanks for signing up! Here's your free lesson video: https://youtu.be/9mUzYjbEd_E",
    }),
  });

  if (!emailResult.ok) {
    console.log("RESEND_ERROR", await emailResult.text());
  }

  return res.status(200).json({ ok: true });
}
