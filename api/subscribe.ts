import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const response = await fetch(
    `https://api.convertkit.com/v3/forms/${process.env.VITE_KIT_FORM_ID}/subscribe`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.VITE_KIT_API_KEY,
        email,
      }),
    }
  );

  const data = await response.json();
  return res.status(response.status).json(data);
}
