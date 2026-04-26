import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import crypto from "crypto"

/* ================= CONFIG ================= */

export const runtime = "nodejs" // 🔥 penting biar env + crypto stabil

const COOKIE_NAME = "fundraiser_session"
const AUTH_SECRET = process.env.AUTH_SECRET!

/* ================= TYPES ================= */

type SessionUser = {
  id: string
  name: string
  refCode: string
}

/* ================= VERIFY SESSION ================= */

function verifySession(token?: string): SessionUser | null {
  console.log("🍪 RAW TOKEN:", token)

  if (!token) {
    console.log("❌ NO TOKEN")
    return null
  }

  try {
    // 🔥 decode cookie (penting)
    const decoded = decodeURIComponent(token)

    console.log("🔓 DECODED TOKEN:", decoded)

    const parts = decoded.split(".")

    if (parts.length !== 2) {
      console.log("❌ INVALID TOKEN FORMAT")
      return null
    }

    const [base, signature] = parts

    console.log("📦 BASE:", base)
    console.log("✍️ SIGNATURE:", signature)

    /* ================= RE-CREATE SIGNATURE ================= */

    const expected = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(base)
      .digest("hex")

    console.log("🔐 EXPECTED SIGNATURE:", expected)

    if (signature !== expected) {
      console.log("❌ SIGNATURE MISMATCH")
      return null
    }

    /* ================= DECODE PAYLOAD ================= */

    let jsonString: string

    try {
      jsonString = Buffer.from(base, "base64url").toString()
    } catch {
      console.log("⚠️ base64url gagal → fallback base64")
      jsonString = Buffer.from(base, "base64").toString()
    }

    console.log("📄 JSON STRING:", jsonString)

    const parsed: SessionUser = JSON.parse(jsonString)

    console.log("✅ SESSION VALID:", parsed)

    return parsed
  } catch (err) {
    console.log("💥 VERIFY ERROR:", err)
    return null
  }
}

/* ================= MAIN ================= */

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const { pathname, searchParams } = url

  console.log("\n==============================")
  console.log("🌐 PATH:", pathname)
  console.log("🔑 AUTH_SECRET:", AUTH_SECRET ? "SET" : "MISSING")

  const res = NextResponse.next()

  /* =====================================================
     1️⃣ AFFILIATE TRACKING
  ===================================================== */

  const ref = searchParams.get("ref")
  const src = searchParams.get("src")

  if (ref) {
    console.log("🎯 SET REF:", ref)

    res.cookies.set("campaign_ref", ref, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    })
  }

  if (src) {
    console.log("📡 SET SRC:", src)

    res.cookies.set("campaign_src", src, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    })
  }

  /* =====================================================
     2️⃣ AUTH GUARD
  ===================================================== */

  if (pathname.startsWith("/fundraiser")) {
    const isPublic =
      pathname.startsWith("/fundraiser/login") ||
      pathname.startsWith("/fundraiser/register")

    console.log("🔐 FUNDRAISER ROUTE")
    console.log("🟢 IS PUBLIC:", isPublic)

    if (!isPublic) {
      const token = req.cookies.get(COOKIE_NAME)?.value

      console.log("🍪 COOKIE FOUND:", !!token)

      const session = verifySession(token)

      if (!session) {
        console.log("🚫 UNAUTHORIZED → REDIRECT LOGIN")

        const loginUrl = new URL("/fundraiser/login", req.url)
        return NextResponse.redirect(loginUrl)
      }

      console.log("🎉 AUTH SUCCESS:", session.name)
    }
  }

  console.log("➡️ NEXT\n")

  return res
}

/* ================= MATCHER ================= */

export const config = {
  matcher: [
    "/campaign/:path*",
  
  ],
}