import { cookies } from "next/headers"

const COOKIE_NAME = "fundraiser_session"
const AUTH_SECRET = process.env.AUTH_SECRET!

type SessionUser = {
  id: string
  name: string
  refCode: string
}

/* ================= VERIFY ================= */

async function verifySession(token?: string): Promise<SessionUser | null> {
  if (!token) return null

  try {
    const decoded = decodeURIComponent(token)
    const [base, signature] = decoded.split(".")

    if (!base || !signature) return null

    const enc = new TextEncoder()

    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(AUTH_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    )

    const sigBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      enc.encode(base)
    )

    const expected = Array.from(new Uint8Array(sigBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    if (signature !== expected) return null

    let jsonString: string

    try {
      jsonString = Buffer.from(base, "base64url").toString()
    } catch {
      jsonString = Buffer.from(base, "base64").toString()
    }

    return JSON.parse(jsonString)
  } catch {
    return null
  }
}

/* ================= PUBLIC API ================= */

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  return verifySession(token)
}