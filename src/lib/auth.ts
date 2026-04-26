import { cookies } from "next/headers"
import crypto from "crypto"

/* ================= CONFIG ================= */

const COOKIE_NAME = "fundraiser_session"
const AUTH_SECRET = process.env.AUTH_SECRET || "dev_secret"

/* ================= TYPES ================= */

export type SessionUser = {
  id: string
  name: string
  refCode: string
}

/* ================= VERIFY ================= */

function verifySession(token?: string): SessionUser | null {
  if (!token) return null

  try {
    const [base, signature] = token.split(".")

    if (!base || !signature) return null

    const expected = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(base)
      .digest("hex")

    if (signature !== expected) return null

    const json = Buffer.from(base, "base64").toString()

    return JSON.parse(json)
  } catch {
    return null
  }
}

/* ================= PUBLIC HELPER ================= */

export function getSessionUser(): SessionUser | null {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  return verifySession(token)
}