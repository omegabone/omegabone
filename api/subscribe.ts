import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Visible in Vercel dashboard -> Deployments -> Logs. No database, no credentials.
  console.log(`FREQUENCY_SIGNUP: ${email}`);

  return res.status(200).json({ ok: true });
}
