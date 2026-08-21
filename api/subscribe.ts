import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Requires a Vercel KV store connected to this project (Vercel dashboard ->
  // Storage -> Create Database -> Connect). No-ops until that's set up.
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    await kv.sadd("frequency-signups", email);
  }

  return res.status(200).json({ ok: true });
}
