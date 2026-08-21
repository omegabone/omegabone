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

  // Emails the site owner's own inbox (not the subscriber) with the
  // subscriber's address as reply-to, so a Gmail filter + template on the
  // subject below can auto-reply to the subscriber with the free lesson link.
  const emailResult = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Omega Bone Site <onboarding@resend.dev>",
      to: ["omegabonedotcom@gmail.com"],
      reply_to: email,
      subject: "New Frequency Lesson Signup",
      text: `New signup for the free lesson: ${email}`,
    }),
  });

  if (!emailResult.ok) {
    console.log("RESEND_ERROR", await emailResult.text());
  }

  return res.status(200).json({ ok: true });
}
